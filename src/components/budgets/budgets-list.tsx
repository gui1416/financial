"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Edit, Trash2, Calendar, Target } from "lucide-react"
import Link from "next/link"
import type { Budget } from "@/lib/supabase/types"
import { deleteBudget } from "@/lib/actions/budgets"

interface BudgetsListProps {
 budgets: (Budget & { spent?: number })[]
}

export default function BudgetsList({ budgets }: BudgetsListProps) {
 const [deletingId, setDeletingId] = useState<string | null>(null)

 const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("pt-BR", {
   style: "currency",
   currency: "BRL",
  }).format(amount)
 }

 const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR")
 }

 const getProgressPercentage = (spent: number, budget: number) => {
  return Math.min((spent / budget) * 100, 100)
 }

 const getProgressColor = (percentage: number) => {
  if (percentage >= 100) return "bg-red-500"
  if (percentage >= 80) return "bg-yellow-500"
  return "bg-emerald-500"
 }

 const getBudgetStatus = (spent: number, budget: number, endDate: string) => {
  const percentage = (spent / budget) * 100
  const isExpired = new Date(endDate) < new Date()

  if (isExpired) return { label: "Expirado", color: "bg-slate-500" }
  if (percentage >= 100) return { label: "Excedido", color: "bg-red-500" }
  if (percentage >= 80) return { label: "Atenção", color: "bg-yellow-500" }
  return { label: "No limite", color: "bg-emerald-500" }
 }

 const handleDelete = async (budgetId: string) => {
  if (!confirm("Tem certeza que deseja excluir este orçamento?")) {
   return
  }

  setDeletingId(budgetId)
  try {
   await deleteBudget(budgetId)
  } catch (error: any) {
   alert(error.message || "Erro ao excluir orçamento")
  } finally {
   setDeletingId(null)
  }
 }

 if (budgets.length === 0) {
  return (
   <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
    <CardContent className="py-8">
     <div className="text-center text-slate-400">
      <p className="mb-4">Nenhum orçamento encontrado</p>
      <Link href="/budgets/new">
       <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Criar primeiro orçamento</Button>
      </Link>
     </div>
    </CardContent>
   </Card>
  )
 }

 return (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
   {budgets.map((budget) => {
    const spent = budget.spent || 0
    const percentage = getProgressPercentage(spent, budget.amount)
    const status = getBudgetStatus(spent, budget.amount, budget.end_date)

    return (
     <Card
      key={budget.id}
      className="bg-slate-800/50 border-slate-700 backdrop-blur hover:bg-slate-800/70 transition-colors"
     >
      <CardHeader className="pb-3">
       <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
         <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
          <Target className="h-5 w-5 text-white" />
         </div>
         <div>
          <CardTitle className="text-white text-lg">{budget.name}</CardTitle>
          <div className="flex items-center space-x-2 text-sm text-slate-400">
           <Calendar className="h-3 w-3" />
           <span>
            {formatDate(budget.start_date)} - {formatDate(budget.end_date)}
           </span>
          </div>
         </div>
        </div>
        <div className="flex items-center space-x-2">
         <Badge className={`text-xs text-white ${status.color}`}>{status.label}</Badge>
         <div className="flex items-center space-x-1">
          <Link href={`/budgets/${budget.id}/edit`}>
           <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
            <Edit className="h-4 w-4" />
           </Button>
          </Link>
          <Button
           size="sm"
           variant="ghost"
           onClick={() => handleDelete(budget.id)}
           disabled={deletingId === budget.id}
           className="text-slate-400 hover:text-red-400"
          >
           {deletingId === budget.id ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
           ) : (
            <Trash2 className="h-4 w-4" />
           )}
          </Button>
         </div>
        </div>
       </div>
      </CardHeader>
      <CardContent className="space-y-4">
       {budget.category && (
        <div className="flex items-center space-x-2">
         <div className="w-4 h-4 rounded-full" style={{ backgroundColor: budget.category.color }} />
         <span className="text-sm text-slate-400">{budget.category.name}</span>
        </div>
       )}

       <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
         <span className="text-slate-400">Progresso</span>
         <span className="text-white font-medium">{percentage.toFixed(1)}%</span>
        </div>
        <Progress value={percentage} className="h-2">
         <div className={`h-full rounded-full transition-all ${getProgressColor(percentage)}`} />
        </Progress>
       </div>

       <div className="flex items-center justify-between">
        <div className="text-center">
         <div className="text-sm text-slate-400">Gasto</div>
         <div className="text-lg font-semibold text-red-400">{formatCurrency(spent)}</div>
        </div>
        <div className="text-center">
         <div className="text-sm text-slate-400">Limite</div>
         <div className="text-lg font-semibold text-emerald-400">{formatCurrency(budget.amount)}</div>
        </div>
        <div className="text-center">
         <div className="text-sm text-slate-400">Restante</div>
         <div
          className={`text-lg font-semibold ${budget.amount - spent >= 0 ? "text-emerald-400" : "text-red-400"
           }`}
         >
          {formatCurrency(budget.amount - spent)}
         </div>
        </div>
       </div>

       <div className="text-xs text-slate-500 text-center">
        Período: {budget.period === "monthly" ? "Mensal" : "Anual"}
       </div>
      </CardContent>
     </Card>
    )
   })}
  </div>
 )
}
