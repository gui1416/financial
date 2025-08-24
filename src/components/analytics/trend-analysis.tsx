"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface TrendData {
 date: string
 cumulativeIncome: number
 cumulativeExpenses: number
 balance: number
}

const chartConfig = {
 cumulativeIncome: {
  label: "Receitas Acumuladas",
  color: "hsl(var(--chart-1))",
 },
 cumulativeExpenses: {
  label: "Despesas Acumuladas",
  color: "hsl(var(--chart-2))",
 },
 balance: {
  label: "Saldo",
  color: "hsl(var(--chart-3))",
 },
}

export function TrendAnalysis() {
 const [data, setData] = useState<TrendData[]>([])
 const [isLoading, setIsLoading] = useState(true)

 useEffect(() => {
  async function fetchTrendData() {
   const supabase = createClient()
   const {
    data: { user },
   } = await supabase.auth.getUser()

   if (!user) return

   // Get last 3 months data
   const endDate = new Date()
   const startDate = new Date()
   startDate.setMonth(startDate.getMonth() - 3)

   const { data: transactions } = await supabase
    .from("transactions")
    .select("amount, type, date")
    .eq("user_id", user.id)
    .gte("date", startDate.toISOString().split("T")[0])
    .lte("date", endDate.toISOString().split("T")[0])
    .order("date", { ascending: true })

   if (transactions) {
    let cumulativeIncome = 0
    let cumulativeExpenses = 0
    const dailyTotals: { [key: string]: { income: number; expenses: number } } = {}

    // Group by date
    transactions.forEach((transaction) => {
     const date = transaction.date
     const amount = Number(transaction.amount)

     if (!dailyTotals[date]) {
      dailyTotals[date] = { income: 0, expenses: 0 }
     }

     if (transaction.type === "income") {
      dailyTotals[date].income += amount
     } else {
      dailyTotals[date].expenses += amount
     }
    })

    // Create cumulative data
    const chartData = Object.entries(dailyTotals)
     .sort(([a], [b]) => a.localeCompare(b))
     .map(([date, totals]) => {
      cumulativeIncome += totals.income
      cumulativeExpenses += totals.expenses

      return {
       date: new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
       cumulativeIncome,
       cumulativeExpenses,
       balance: cumulativeIncome - cumulativeExpenses,
      }
     })

    setData(chartData)
   }

   setIsLoading(false)
  }

  fetchTrendData()
 }, [])

 const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
   style: "currency",
   currency: "BRL",
   minimumFractionDigits: 0,
   maximumFractionDigits: 0,
  }).format(value)
 }

 if (isLoading) {
  return (
   <Card>
    <CardHeader>
     <CardTitle>Análise de Tendência</CardTitle>
     <CardDescription>Evolução acumulada das finanças</CardDescription>
    </CardHeader>
    <CardContent>
     <div className="h-[400px] bg-muted animate-pulse rounded" />
    </CardContent>
   </Card>
  )
 }

 return (
  <Card>
   <CardHeader>
    <CardTitle>Análise de Tendência</CardTitle>
    <CardDescription>Evolução acumulada das finanças nos últimos 3 meses</CardDescription>
   </CardHeader>
   <CardContent>
    {data.length === 0 ? (
     <div className="h-[400px] flex items-center justify-center text-muted-foreground">
      Nenhum dado encontrado para o período
     </div>
    ) : (
     <ChartContainer config={chartConfig} className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
       <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis tickFormatter={formatCurrency} />
        <ChartTooltip
         content={({ active, payload, label }) => {
          if (active && payload && payload.length) {
           return (
            <div className="bg-background border rounded-lg p-3 shadow-md">
             <p className="font-medium">{label}</p>
             {payload.map((entry, index) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
               {entry.name}: {formatCurrency(Number(entry.value))}
              </p>
             ))}
            </div>
           )
          }
          return null
         }}
        />
        <Line
         type="monotone"
         dataKey="cumulativeIncome"
         stroke="var(--color-cumulativeIncome)"
         strokeWidth={2}
         name="Receitas Acumuladas"
        />
        <Line
         type="monotone"
         dataKey="cumulativeExpenses"
         stroke="var(--color-cumulativeExpenses)"
         strokeWidth={2}
         name="Despesas Acumuladas"
        />
        <Line type="monotone" dataKey="balance" stroke="var(--color-balance)" strokeWidth={2} name="Saldo" />
       </LineChart>
      </ResponsiveContainer>
     </ChartContainer>
    )}
   </CardContent>
  </Card>
 )
}
