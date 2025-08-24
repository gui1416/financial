"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface ChartData {
 date: string
 income: number
 expenses: number
}

const chartConfig = {
 income: {
  label: "Receitas",
  color: "hsl(var(--chart-1))",
 },
 expenses: {
  label: "Gastos",
  color: "hsl(var(--chart-2))",
 },
}

export function TransactionsChart() {
 const [data, setData] = useState<ChartData[]>([])
 const [isLoading, setIsLoading] = useState(true)

 useEffect(() => {
  async function fetchChartData() {
   const supabase = createClient()
   const {
    data: { user },
   } = await supabase.auth.getUser()

   if (!user) return

   // Get last 30 days
   const endDate = new Date()
   const startDate = new Date()
   startDate.setDate(startDate.getDate() - 30)

   const { data: transactions } = await supabase
    .from("transactions")
    .select("amount, type, date")
    .eq("user_id", user.id)
    .gte("date", startDate.toISOString().split("T")[0])
    .lte("date", endDate.toISOString().split("T")[0])
    .order("date", { ascending: true })

   if (transactions) {
    // Group by date
    const groupedData: { [key: string]: { income: number; expenses: number } } = {}

    transactions.forEach((transaction) => {
     const date = transaction.date
     if (!groupedData[date]) {
      groupedData[date] = { income: 0, expenses: 0 }
     }

     if (transaction.type === "income") {
      groupedData[date].income += Number(transaction.amount)
     } else {
      groupedData[date].expenses += Number(transaction.amount)
     }
    })

    // Convert to chart format
    const chartData = Object.entries(groupedData).map(([date, values]) => ({
     date: new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
     income: values.income,
     expenses: values.expenses,
    }))

    setData(chartData)
   }

   setIsLoading(false)
  }

  fetchChartData()
 }, [])

 if (isLoading) {
  return (
   <Card>
    <CardHeader>
     <CardTitle>Fluxo de Caixa</CardTitle>
     <CardDescription>Receitas e gastos dos últimos 30 dias</CardDescription>
    </CardHeader>
    <CardContent>
     <div className="h-[300px] bg-muted animate-pulse rounded" />
    </CardContent>
   </Card>
  )
 }

 return (
  <Card>
   <CardHeader>
    <CardTitle>Fluxo de Caixa</CardTitle>
    <CardDescription>Receitas e gastos dos últimos 30 dias</CardDescription>
   </CardHeader>
   <CardContent>
    <ChartContainer config={chartConfig} className="h-[300px]">
     <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
       <XAxis dataKey="date" />
       <YAxis />
       <ChartTooltip content={<ChartTooltipContent />} />
       <Area
        type="monotone"
        dataKey="income"
        stackId="1"
        stroke="var(--color-income)"
        fill="var(--color-income)"
        fillOpacity={0.6}
       />
       <Area
        type="monotone"
        dataKey="expenses"
        stackId="2"
        stroke="var(--color-expenses)"
        fill="var(--color-expenses)"
        fillOpacity={0.6}
       />
      </AreaChart>
     </ResponsiveContainer>
    </ChartContainer>
   </CardContent>
  </Card>
 )
}
