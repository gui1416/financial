"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface MonthlyData {
 month: string
 income: number
 expenses: number
 net: number
}

const chartConfig = {
 income: {
  label: "Receitas",
  color: "hsl(var(--chart-1))",
 },
 expenses: {
  label: "Despesas",
  color: "hsl(var(--chart-2))",
 },
 net: {
  label: "Líquido",
  color: "hsl(var(--chart-3))",
 },
}

export function MonthlyComparison() {
 const [data, setData] = useState<MonthlyData[]>([])
 const [isLoading, setIsLoading] = useState(true)

 useEffect(() => {
  async function fetchMonthlyData() {
   const supabase = createClient()
   const {
    data: { user },
   } = await supabase.auth.getUser()

   if (!user) return

   // Get last 6 months data
   const endDate = new Date()
   const startDate = new Date()
   startDate.setMonth(startDate.getMonth() - 6)

   const { data: transactions } = await supabase
    .from("transactions")
    .select("amount, type, date")
    .eq("user_id", user.id)
    .gte("date", startDate.toISOString().split("T")[0])
    .lte("date", endDate.toISOString().split("T")[0])
    .order("date", { ascending: true })

   if (transactions) {
    const monthlyTotals: { [key: string]: { income: number; expenses: number } } = {}

    transactions.forEach((transaction) => {
     const date = new Date(transaction.date)
     const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
     const amount = Number(transaction.amount)

     if (!monthlyTotals[monthKey]) {
      monthlyTotals[monthKey] = { income: 0, expenses: 0 }
     }

     if (transaction.type === "income") {
      monthlyTotals[monthKey].income += amount
     } else {
      monthlyTotals[monthKey].expenses += amount
     }
    })

    const chartData = Object.entries(monthlyTotals)
     .map(([monthKey, totals]) => {
      const [year, month] = monthKey.split("-")
      const monthName = new Date(Number(year), Number(month) - 1).toLocaleDateString("pt-BR", {
       month: "short",
       year: "2-digit",
      })

      return {
       month: monthName,
       income: totals.income,
       expenses: totals.expenses,
       net: totals.income - totals.expenses,
      }
     })
     .sort((a, b) => a.month.localeCompare(b.month))

    setData(chartData)
   }

   setIsLoading(false)
  }

  fetchMonthlyData()
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
     <CardTitle>Comparação Mensal</CardTitle>
     <CardDescription>Receitas vs Despesas por mês</CardDescription>
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
    <CardTitle>Comparação Mensal</CardTitle>
    <CardDescription>Receitas vs Despesas por mês</CardDescription>
   </CardHeader>
   <CardContent>
    {data.length === 0 ? (
     <div className="h-[300px] flex items-center justify-center text-muted-foreground">
      Nenhum dado encontrado para o período
     </div>
    ) : (
     <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
       <BarChart data={data}>
        <XAxis dataKey="month" />
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
        <Bar dataKey="income" fill="var(--color-income)" name="Receitas" />
        <Bar dataKey="expenses" fill="var(--color-expenses)" name="Despesas" />
       </BarChart>
      </ResponsiveContainer>
     </ChartContainer>
    )}
   </CardContent>
  </Card>
 )
}
