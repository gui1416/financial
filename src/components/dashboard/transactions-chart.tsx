"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

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
 const [period, setPeriod] = useState("30")

 useEffect(() => {
  async function fetchChartData() {
   const supabase = createClient()
   const {
    data: { user },
   } = await supabase.auth.getUser()

   if (!user) return

   // Get last N days based on period
   const endDate = new Date()
   const startDate = new Date()
   startDate.setDate(startDate.getDate() - Number.parseInt(period))

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
 }, [period])

 if (isLoading) {
  return (
   <Card className="border-0 bg-card/50 backdrop-blur-sm">
    <CardHeader className="pb-2 px-3 md:px-6 md:pb-3">
     <CardTitle className="text-sm md:text-base">Fluxo de Caixa</CardTitle>
     <CardDescription className="text-xs md:text-sm">Últimos {period} dias</CardDescription>
    </CardHeader>
    <CardContent className="pt-0 px-3 md:px-6">
     <div className="h-[180px] md:h-[300px] bg-muted animate-pulse rounded" />
    </CardContent>
   </Card>
  )
 }

 return (
  <Card className="border-0 bg-card/50 backdrop-blur-sm">
   <CardHeader className="pb-2 px-3 md:px-6 md:pb-3">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
     <div className="space-y-1">
      <CardTitle className="text-sm md:text-base">Fluxo de Caixa</CardTitle>
      <CardDescription className="text-xs md:text-sm">Últimos {period} dias</CardDescription>
     </div>
     <div className="flex gap-1 self-start sm:self-auto">
      {["7", "30", "90"].map((days) => (
       <Button
        key={days}
        variant={period === days ? "default" : "outline"}
        size="sm"
        className="h-6 px-2 text-xs md:h-7 md:px-3"
        onClick={() => setPeriod(days)}
       >
        {days}d
       </Button>
      ))}
     </div>
    </div>
   </CardHeader>
   <CardContent className="pt-0 px-3 md:px-6">
    <ChartContainer config={chartConfig} className="h-[160px] md:h-[280px]">
     <ResponsiveContainer width="100%" height="100%">
      <AreaChart
       data={data}
       margin={{
        top: 5,
        right: 5,
        left: -20,
        bottom: 0,
       }}
      >
       <XAxis
        dataKey="date"
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 10 }}
        className="text-muted-foreground"
        interval="preserveStartEnd"
        minTickGap={20}
       />
       <YAxis
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 10 }}
        className="text-muted-foreground"
        width={30}
        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
       />
       <ChartTooltip
        content={<ChartTooltipContent />}
        labelFormatter={(value) => `Data: ${value}`}
        formatter={(value: number, name: string) => [
         `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
         chartConfig[name as keyof typeof chartConfig]?.label || name,
        ]}
       />
       <Area
        type="monotone"
        dataKey="income"
        stackId="1"
        stroke="var(--color-income)"
        fill="var(--color-income)"
        fillOpacity={0.4}
        strokeWidth={2}
       />
       <Area
        type="monotone"
        dataKey="expenses"
        stackId="2"
        stroke="var(--color-expenses)"
        fill="var(--color-expenses)"
        fillOpacity={0.4}
        strokeWidth={2}
       />
      </AreaChart>
     </ResponsiveContainer>
    </ChartContainer>
   </CardContent>
  </Card>
 )
}
