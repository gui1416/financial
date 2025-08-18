import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, DollarSign, TrendingUp } from "lucide-react"
import type { FinancialSummary } from "@/lib/supabase/types"

interface FinancialCardsProps {
 summary: FinancialSummary
}

export default function FinancialCards({ summary }: FinancialCardsProps) {
 const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("pt-BR", {
   style: "currency",
   currency: "BRL",
  }).format(amount)
 }

 const cards = [
  {
   title: "Saldo Total",
   value: summary.balance,
   icon: DollarSign,
   color: summary.balance >= 0 ? "text-emerald-500" : "text-red-500",
   bgColor: summary.balance >= 0 ? "bg-emerald-500/10" : "bg-red-500/10",
  },
  {
   title: "Receitas do Mês",
   value: summary.monthlyIncome,
   icon: ArrowUp,
   color: "text-emerald-500",
   bgColor: "bg-emerald-500/10",
  },
  {
   title: "Despesas do Mês",
   value: summary.monthlyExpenses,
   icon: ArrowDown,
   color: "text-red-500",
   bgColor: "bg-red-500/10",
  },
  {
   title: "Saldo Mensal",
   value: summary.monthlyBalance,
   icon: TrendingUp,
   color: summary.monthlyBalance >= 0 ? "text-emerald-500" : "text-red-500",
   bgColor: summary.monthlyBalance >= 0 ? "bg-emerald-500/10" : "bg-red-500/10",
  },
 ]

 return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
   {cards.map((card, index) => (
    <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur">
     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-slate-400">{card.title}</CardTitle>
      <div className={`p-2 rounded-lg ${card.bgColor}`}>
       <card.icon className={`h-4 w-4 ${card.color}`} />
      </div>
     </CardHeader>
     <CardContent>
      <div className={`text-2xl font-bold ${card.color}`}>{formatCurrency(card.value)}</div>
     </CardContent>
    </Card>
   ))}
  </div>
 )
}
