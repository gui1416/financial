"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Target, PieChart, BarChart3 } from "lucide-react"

interface OverviewData {
 totalIncome: number
 totalExpenses: number
 netIncome: number
 avgMonthlyIncome: number
 avgMonthlyExpenses: number
 savingsRate: number
 topCategory: {
  name: string
  amount: number
 } | null
 transactionCount: number
}

export function AnalyticsOverview() {
 const [data, setData] = useState<OverviewData>({
  totalIncome: 0,
  totalExpenses: 0,
  netIncome: 0,
  avgMonthlyIncome: 0,
  avgMonthlyExpenses: 0,
  savingsRate: 0,
  topCategory: null,
  transactionCount: 0,
 })
 const [isLoading, setIsLoading] = useState(true)

 useEffect(() => {
  async function fetchOverviewData() {
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
          date,
          categories (
            name
          )
        `,
    )
    .eq("user_id", user.id)
    .gte("date", startDate.toISOString().split("T")[0])
    .lte("date", endDate.toISOString().split("T")[0])

   if (transactions) {
    const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0)

    const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0)

    const netIncome = income - expenses
    const savingsRate = income > 0 ? (netIncome / income) * 100 : 0

    // Calculate category totals
    const categoryTotals: { [key: string]: number } = {}
    transactions
     .filter((t) => t.type === "expense" && t.categories)
     .forEach((t) => {
      const categoryName = t.categories!.name
      categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + Number(t.amount)
     })

    const topCategory = Object.entries(categoryTotals).reduce(
     (max, [name, amount]) => (amount > (max?.amount || 0) ? { name, amount } : max),
     null as { name: string; amount: number } | null,
    )

    setData({
     totalIncome: income,
     totalExpenses: expenses,
     netIncome,
     avgMonthlyIncome: income / 3,
     avgMonthlyExpenses: expenses / 3,
     savingsRate,
     topCategory,
     transactionCount: transactions.length,
    })
   }

   setIsLoading(false)
  }

  fetchOverviewData()
 }, [])

 const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
   style: "currency",
   currency: "BRL",
  }).format(value)
 }

 const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`
 }

 if (isLoading) {
  return (
   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 8 }).map((_, i) => (
     <Card key={i}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
       <CardTitle className="text-sm font-medium">Carregando...</CardTitle>
      </CardHeader>
      <CardContent>
       <div className="h-8 bg-muted animate-pulse rounded" />
      </CardContent>
     </Card>
    ))}
   </div>
  )
 }

 return (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
     <TrendingUp className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className="text-2xl font-bold text-green-600">{formatCurrency(data.totalIncome)}</div>
     <p className="text-xs text-muted-foreground">Últimos 3 meses</p>
    </CardContent>
   </Card>

   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Gastos Totais</CardTitle>
     <TrendingDown className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className="text-2xl font-bold text-red-600">{formatCurrency(data.totalExpenses)}</div>
     <p className="text-xs text-muted-foreground">Últimos 3 meses</p>
    </CardContent>
   </Card>

   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Resultado Líquido</CardTitle>
     <DollarSign className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className={`text-2xl font-bold ${data.netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
      {formatCurrency(data.netIncome)}
     </div>
     <p className="text-xs text-muted-foreground">Últimos 3 meses</p>
    </CardContent>
   </Card>

   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Taxa de Poupança</CardTitle>
     <Target className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className={`text-2xl font-bold ${data.savingsRate >= 0 ? "text-green-600" : "text-red-600"}`}>
      {formatPercentage(data.savingsRate)}
     </div>
     <p className="text-xs text-muted-foreground">Do total de receitas</p>
    </CardContent>
   </Card>

   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Receita Média Mensal</CardTitle>
     <BarChart3 className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className="text-2xl font-bold">{formatCurrency(data.avgMonthlyIncome)}</div>
     <p className="text-xs text-muted-foreground">Média dos últimos 3 meses</p>
    </CardContent>
   </Card>

   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Gasto Médio Mensal</CardTitle>
     <BarChart3 className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className="text-2xl font-bold">{formatCurrency(data.avgMonthlyExpenses)}</div>
     <p className="text-xs text-muted-foreground">Média dos últimos 3 meses</p>
    </CardContent>
   </Card>

   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Maior Categoria</CardTitle>
     <PieChart className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className="text-2xl font-bold">{data.topCategory ? formatCurrency(data.topCategory.amount) : "N/A"}</div>
     <p className="text-xs text-muted-foreground">{data.topCategory?.name || "Nenhuma categoria"}</p>
    </CardContent>
   </Card>

   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Total de Transações</CardTitle>
     <DollarSign className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className="text-2xl font-bold">{data.transactionCount}</div>
     <p className="text-xs text-muted-foreground">Últimos 3 meses</p>
    </CardContent>
   </Card>
  </div>
 )
}
