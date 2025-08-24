"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface CategoryData {
 name: string
 value: number
 color: string
 percentage: number
}

const chartConfig = {
 value: {
  label: "Valor",
 },
}

export function CategoryDistribution() {
 const [data, setData] = useState<CategoryData[]>([])
 const [isLoading, setIsLoading] = useState(true)
 const [type, setType] = useState<"income" | "expense">("expense")

 useEffect(() => {
  async function fetchCategoryData() {
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
    .select(
     `
          amount,
          type,
          categories (
            name,
            color
          )
        `,
    )
    .eq("user_id", user.id)
    .eq("type", type)
    .gte("date", startDate.toISOString().split("T")[0])
    .lte("date", endDate.toISOString().split("T")[0])

   if (transactions) {
    const categoryTotals: { [key: string]: { amount: number; color: string } } = {}

    transactions.forEach((transaction) => {
     const categoryName = transaction.categories?.name || "Sem categoria"
     const categoryColor = transaction.categories?.color || "#6b7280"
     const amount = Number(transaction.amount)

     if (!categoryTotals[categoryName]) {
      categoryTotals[categoryName] = { amount: 0, color: categoryColor }
     }
     categoryTotals[categoryName].amount += amount
    })

    const total = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.amount, 0)

    const chartData = Object.entries(categoryTotals)
     .map(([name, { amount, color }]) => ({
      name,
      value: amount,
      color,
      percentage: total > 0 ? (amount / total) * 100 : 0,
     }))
     .sort((a, b) => b.value - a.value)
     .slice(0, 8) // Top 8 categories

    setData(chartData)
   }

   setIsLoading(false)
  }

  fetchCategoryData()
 }, [type])

 const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
   style: "currency",
   currency: "BRL",
  }).format(value)
 }

 if (isLoading) {
  return (
   <Card>
    <CardHeader>
     <CardTitle>Distribuição por Categoria</CardTitle>
     <CardDescription>Análise dos gastos por categoria</CardDescription>
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
    <CardTitle>Distribuição por Categoria</CardTitle>
    <CardDescription>
     <div className="flex gap-2">
      <button
       onClick={() => setType("expense")}
       className={`px-3 py-1 rounded text-sm ${type === "expense" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
       Despesas
      </button>
      <button
       onClick={() => setType("income")}
       className={`px-3 py-1 rounded text-sm ${type === "income" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
       Receitas
      </button>
     </div>
    </CardDescription>
   </CardHeader>
   <CardContent>
    {data.length === 0 ? (
     <div className="h-[300px] flex items-center justify-center text-muted-foreground">
      Nenhum dado encontrado para o período
     </div>
    ) : (
     <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
       <PieChart>
        <Pie
         data={data}
         cx="50%"
         cy="50%"
         outerRadius={80}
         dataKey="value"
         label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
        >
         {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
         ))}
        </Pie>
        <ChartTooltip
         content={({ active, payload }) => {
          if (active && payload && payload.length) {
           const data = payload[0].payload
           return (
            <div className="bg-background border rounded-lg p-3 shadow-md">
             <p className="font-medium">{data.name}</p>
             <p className="text-sm text-muted-foreground">
              {formatCurrency(data.value)} ({data.percentage.toFixed(1)}%)
             </p>
            </div>
           )
          }
          return null
         }}
        />
       </PieChart>
      </ResponsiveContainer>
     </ChartContainer>
    )}
   </CardContent>
  </Card>
 )
}
