"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Search, Filter } from "lucide-react"
import Link from "next/link"
import type { Transaction, Category } from "@/lib/supabase/types"
import { deleteTransaction } from "@/lib/actions/transactions"

interface TransactionsListProps {
 transactions: Transaction[]
 categories: Category[]
}

export default function TransactionsList({ transactions, categories }: TransactionsListProps) {
 const [searchTerm, setSearchTerm] = useState("")
 const [selectedCategory, setSelectedCategory] = useState("")
 const [selectedType, setSelectedType] = useState("")
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

 const handleDelete = async (transactionId: string) => {
  if (!confirm("Tem certeza que deseja excluir esta transação?")) {
   return
  }

  setDeletingId(transactionId)
  try {
   await deleteTransaction(transactionId)
  } catch (error) {
   alert("Erro ao excluir transação")
  } finally {
   setDeletingId(null)
  }
 }

 // Filter transactions
 const filteredTransactions = transactions.filter((transaction) => {
  const matchesSearch =
   transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
   transaction.description?.toLowerCase().includes(searchTerm.toLowerCase())

  const matchesCategory = !selectedCategory || transaction.category_id === selectedCategory
  const matchesType = !selectedType || transaction.type === selectedType

  return matchesSearch && matchesCategory && matchesType
 })

 return (
  <div className="space-y-6">
   {/* Filters */}
   <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
    <CardHeader>
     <CardTitle className="text-white flex items-center">
      <Filter className="h-5 w-5 mr-2" />
      Filtros
     </CardTitle>
    </CardHeader>
    <CardContent>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
       <Input
        placeholder="Buscar transações..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
       />
      </div>

      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
       <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
        <SelectValue placeholder="Todas as categorias" />
       </SelectTrigger>
       <SelectContent className="bg-slate-700 border-slate-600">
        <SelectItem value="" className="text-white hover:bg-slate-600">
         Todas as categorias
        </SelectItem>
        {categories.map((category) => (
         <SelectItem key={category.id} value={category.id} className="text-white hover:bg-slate-600">
          <div className="flex items-center space-x-2">
           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
           <span>{category.name}</span>
          </div>
         </SelectItem>
        ))}
       </SelectContent>
      </Select>

      <Select value={selectedType} onValueChange={setSelectedType}>
       <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
        <SelectValue placeholder="Todos os tipos" />
       </SelectTrigger>
       <SelectContent className="bg-slate-700 border-slate-600">
        <SelectItem value="" className="text-white hover:bg-slate-600">
         Todos os tipos
        </SelectItem>
        <SelectItem value="income" className="text-white hover:bg-slate-600">
         Receitas
        </SelectItem>
        <SelectItem value="expense" className="text-white hover:bg-slate-600">
         Despesas
        </SelectItem>
       </SelectContent>
      </Select>
     </div>
    </CardContent>
   </Card>

   {/* Transactions List */}
   <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
    <CardHeader>
     <CardTitle className="text-white">Transações ({filteredTransactions.length})</CardTitle>
    </CardHeader>
    <CardContent>
     {filteredTransactions.length === 0 ? (
      <div className="text-center py-8 text-slate-400">
       {transactions.length === 0 ? "Nenhuma transação encontrada" : "Nenhuma transação corresponde aos filtros"}
      </div>
     ) : (
      <div className="space-y-4">
       {filteredTransactions.map((transaction) => (
        <div
         key={transaction.id}
         className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
        >
         <div className="flex items-center space-x-4">
          <div
           className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-medium"
           style={{ backgroundColor: transaction.category?.color || "#6B7280" }}
          >
           {transaction.category?.name?.charAt(0) || "?"}
          </div>
          <div>
           <h4 className="text-white font-medium">{transaction.title}</h4>
           {transaction.description && (
            <p className="text-sm text-slate-400 mt-1">{transaction.description}</p>
           )}
           <div className="flex items-center space-x-2 text-sm text-slate-400 mt-1">
            <span>{transaction.category?.name || "Sem categoria"}</span>
            <span>•</span>
            <span>{formatDate(transaction.date)}</span>
           </div>
          </div>
         </div>

         <div className="flex items-center space-x-4">
          <div className="text-right">
           <div
            className={`font-semibold text-lg ${transaction.type === "income" ? "text-emerald-400" : "text-red-400"
             }`}
           >
            {transaction.type === "income" ? "+" : "-"}
            {formatCurrency(transaction.amount)}
           </div>
           <Badge
            variant="secondary"
            className={`text-xs ${transaction.type === "income"
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-red-500/20 text-red-400"
             }`}
           >
            {transaction.type === "income" ? "Receita" : "Despesa"}
           </Badge>
          </div>

          <div className="flex items-center space-x-2">
           <Link href={`/transactions/${transaction.id}/edit`}>
            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
             <Edit className="h-4 w-4" />
            </Button>
           </Link>
           <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(transaction.id)}
            disabled={deletingId === transaction.id}
            className="text-slate-400 hover:text-red-400"
           >
            {deletingId === transaction.id ? (
             <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
            ) : (
             <Trash2 className="h-4 w-4" />
            )}
           </Button>
          </div>
         </div>
        </div>
       ))}
      </div>
     )}
    </CardContent>
   </Card>
  </div>
 )
}
