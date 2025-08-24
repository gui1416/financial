"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Metrics {
 totalIncome: number
 totalExpenses: number
 balance: number
 transactionsCount: number
}

export function MetricsCards() {
 const [metrics, setMetrics] = useState<Metrics>({
  totalIncome: 0,
  totalExpenses: 0,
  balance: 0,
  transactionsCount: 0,
 })
 const [isLoading, setIsLoading] = useState(true)

 useEffect(() => {
  async function fetchMetrics() {
   const supabase = createClient()
   const {
    data: { user },
   } = await supabase.auth.getUser()

   if (!user) return

   // Get current month transactions
   const currentDate = new Date()
   const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
   const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

   const { data: transactions } = await supabase
    .from("transactions")
    .select("amount, type")
    .eq("user_id", user.id)
    .gte("date", firstDay.toISOString().split("T")[0])
    .lte("date", lastDay.toISOString().split("T")[0])

   if (transactions) {
    const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0)

    const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0)

    setMetrics({
     totalIncome: income,
     totalExpenses: expenses,
     balance: income - expenses,
     transactionsCount: transactions.length,
    })
   }

   setIsLoading(false)
  }

  fetchMetrics()
 }, [])

 const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
   style: "currency",
   currency: "BRL",
  }).format(value)
 }

 if (isLoading) {
  return (
   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
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
     <CardTitle className="text-sm font-medium">Receitas</CardTitle>
     <TrendingUp className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className="text-2xl font-bold text-green-600">{formatCurrency(metrics.totalIncome)}</div>
     <p className="text-xs text-muted-foreground">Este mês</p>
    </CardContent>
   </Card>
   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Gastos</CardTitle>
     <TrendingDown className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className="text-2xl font-bold text-red-600">{formatCurrency(metrics.totalExpenses)}</div>
     <p className="text-xs text-muted-foreground">Este mês</p>
    </CardContent>
   </Card>
   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Saldo</CardTitle>
     <Wallet className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className={`text-2xl font-bold ${metrics.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
      {formatCurrency(metrics.balance)}
     </div>
     <p className="text-xs text-muted-foreground">Este mês</p>
    </CardContent>
   </Card>
   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Transações</CardTitle>
     <DollarSign className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className="text-2xl font-bold">{metrics.transactionsCount}</div>
     <p className="text-xs text-muted-foreground">Este mês</p>
    </CardContent>
   </Card>
  </div>
 )
}
