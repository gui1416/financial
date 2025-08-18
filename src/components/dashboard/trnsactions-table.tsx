import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import type { Transaction } from "@/lib/supabase/types"

interface TransactionsTableProps {
 transactions: Transaction[]
}

export default function TransactionsTable({ transactions }: TransactionsTableProps) {
 const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("pt-BR", {
   style: "currency",
   currency: "BRL",
  }).format(amount)
 }

 const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR")
 }

 if (!transactions || transactions.length === 0) {
  return (
   <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
    <CardHeader className="flex flex-row items-center justify-between">
     <CardTitle className="text-white">Transações Recentes</CardTitle>
     <Link href="/transactions">
      <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300">
       Ver todas
       <ArrowUpRight className="h-4 w-4 ml-1" />
      </Button>
     </Link>
    </CardHeader>
    <CardContent>
     <div className="flex items-center justify-center h-32 text-slate-400">Nenhuma transação encontrada</div>
    </CardContent>
   </Card>
  )
 }

 return (
  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
   <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle className="text-white">Transações Recentes</CardTitle>
    <Link href="/transactions">
     <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300">
      Ver todas
      <ArrowUpRight className="h-4 w-4 ml-1" />
     </Button>
    </Link>
   </CardHeader>
   <CardContent>
    <div className="space-y-4">
     {transactions.map((transaction) => (
      <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
       <div className="flex items-center space-x-4">
        <div
         className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
         style={{ backgroundColor: transaction.category?.color || "#6B7280" }}
        >
         {transaction.category?.name?.charAt(0) || "?"}
        </div>
        <div>
         <h4 className="text-white font-medium">{transaction.title}</h4>
         <div className="flex items-center space-x-2 text-sm text-slate-400">
          <span>{transaction.category?.name || "Sem categoria"}</span>
          <span>•</span>
          <span>{formatDate(transaction.date)}</span>
         </div>
        </div>
       </div>
       <div className="text-right">
        <div className={`font-semibold ${transaction.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
         {transaction.type === "income" ? "+" : "-"}
         {formatCurrency(transaction.amount)}
        </div>
        <Badge
         variant="secondary"
         className={`text-xs ${transaction.type === "income" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
          }`}
        >
         {transaction.type === "income" ? "Receita" : "Despesa"}
        </Badge>
       </div>
      </div>
     ))}
    </div>
   </CardContent>
  </Card>
 )
}
