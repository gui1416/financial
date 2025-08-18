"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { Category, Transaction } from "@/lib/supabase/types"

interface TransactionFormProps {
 categories: Category[]
 transaction?: Transaction
 action: (prevState: any, formData: FormData) => Promise<any>
 title: string
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
 const { pending } = useFormStatus()

 return (
  <Button type="submit" disabled={pending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
   {pending ? (
    <>
     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
     {isEditing ? "Atualizando..." : "Criando..."}
    </>
   ) : isEditing ? (
    "Atualizar Transação"
   ) : (
    "Criar Transação"
   )}
  </Button>
 )
}

export default function TransactionForm({ categories, transaction, action, title }: TransactionFormProps) {
 const router = useRouter()
 const [state, formAction] = useActionState(action, null)
 const [selectedType, setSelectedType] = useState(transaction?.type || "expense")
 const [selectedCategory, setSelectedCategory] = useState(transaction?.category_id || "")

 // Handle successful form submission
 useEffect(() => {
  if (state?.success) {
   router.push("/transactions")
  }
 }, [state, router])

 // Format date for input (YYYY-MM-DD)
 const formatDateForInput = (dateString?: string) => {
  if (!dateString) return new Date().toISOString().split("T")[0]
  return new Date(dateString).toISOString().split("T")[0]
 }

 return (
  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
   <CardHeader>
    <CardTitle className="text-white">{title}</CardTitle>
   </CardHeader>
   <CardContent>
    <form action={formAction} className="space-y-6">
     {state?.error && (
      <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded">{state.error}</div>
     )}

     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
       <Label htmlFor="title" className="text-slate-300">
        Título *
       </Label>
       <Input
        id="title"
        name="title"
        type="text"
        placeholder="Ex: Compra no supermercado"
        defaultValue={transaction?.title}
        required
        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
       />
      </div>

      <div className="space-y-2">
       <Label htmlFor="amount" className="text-slate-300">
        Valor *
       </Label>
       <Input
        id="amount"
        name="amount"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0,00"
        defaultValue={transaction?.amount}
        required
        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
       />
      </div>

      <div className="space-y-2">
       <Label htmlFor="type" className="text-slate-300">
        Tipo *
       </Label>
       <Select name="type" value={selectedType} onValueChange={setSelectedType}>
        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
         <SelectValue placeholder="Selecione o tipo" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600">
         <SelectItem value="expense" className="text-white hover:bg-slate-600">
          Despesa
         </SelectItem>
         <SelectItem value="income" className="text-white hover:bg-slate-600">
          Receita
         </SelectItem>
        </SelectContent>
       </Select>
      </div>

      <div className="space-y-2">
       <Label htmlFor="categoryId" className="text-slate-300">
        Categoria
       </Label>
       <Select name="categoryId" value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
         <SelectValue placeholder="Selecione uma categoria" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600">
         <SelectItem value="" className="text-white hover:bg-slate-600">
          Sem categoria
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
      </div>

      <div className="space-y-2">
       <Label htmlFor="date" className="text-slate-300">
        Data *
       </Label>
       <Input
        id="date"
        name="date"
        type="date"
        defaultValue={formatDateForInput(transaction?.date)}
        required
        className="bg-slate-700 border-slate-600 text-white"
       />
      </div>
     </div>

     <div className="space-y-2">
      <Label htmlFor="description" className="text-slate-300">
       Descrição
      </Label>
      <Textarea
       id="description"
       name="description"
       placeholder="Descrição opcional da transação"
       defaultValue={transaction?.description || ""}
       className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
       rows={3}
      />
     </div>

     <div className="flex items-center space-x-4">
      <SubmitButton isEditing={!!transaction} />
      <Button
       type="button"
       variant="outline"
       onClick={() => router.back()}
       className="border-slate-600 text-slate-300 hover:bg-slate-700"
      >
       Cancelar
      </Button>
     </div>
    </form>
   </CardContent>
  </Card>
 )
}
