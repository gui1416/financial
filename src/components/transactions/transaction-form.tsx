// src/components/transactions/transaction-form.tsx

"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Transaction } from "./columns"

interface Category {
 id: string
 name: string
 color: string
 type: "income" | "expense"
}

interface TransactionFormProps {
 transaction?: Transaction | null
 onSaved: () => void;
 onCancel: () => void;
}

export function TransactionForm({ transaction, onSaved, onCancel }: TransactionFormProps) {
 const [categories, setCategories] = React.useState<Category[]>([])
 const [isLoading, setIsLoading] = React.useState(false)
 const [formData, setFormData] = React.useState({
  title: transaction?.title || "",
  description: transaction?.description || "",
  amount: transaction?.amount.toString() || "",
  type: transaction?.type || "expense",
  categoryId: transaction?.categories?.[0]?.id || "",
  date: transaction ? new Date(transaction.date + 'T00:00:00') : new Date(),
 })

 React.useEffect(() => {
  async function fetchCategories() {
   const supabase = createClient()
   const { data: { user } } = await supabase.auth.getUser()
   if (!user) return

   const { data } = await supabase
    .from("categories")
    .select("id, name, color, type")
    .eq("user_id", user.id)
    .order("name")

   if (data) setCategories(data)
  }
  fetchCategories()
 }, [])

 const filteredCategories = categories.filter((category) => category.type === formData.type)

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
   toast.error("Você precisa estar logado para salvar uma transação.");
   setIsLoading(false);
   return;
  }

  const transactionData = {
   title: formData.title,
   description: formData.description || null,
   amount: Number.parseFloat(formData.amount),
   type: formData.type,
   category_id: formData.categoryId || null,
   date: format(formData.date, "yyyy-MM-dd"),
   user_id: user.id,
  }

  try {
   let error;
   if (transaction) {
    // Modo Edição
    const { error: updateError } = await supabase.from("transactions").update(transactionData).eq("id", transaction.id)
    error = updateError;
   } else {
    // Modo Criação
    const { error: insertError } = await supabase.from("transactions").insert(transactionData)
    error = insertError;
   }

   if (error) throw error

   toast.success(transaction ? "Transação atualizada!" : "Transação criada!");
   onSaved()
  } catch (error) {
   toast.error("Erro ao salvar transação", {
    description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
   })
  } finally {
   setIsLoading(false)
  }
 }

 return (
  <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-y-auto px-4">
   <div className="grid gap-4 py-4 flex-1">
    <div className="grid gap-2">
     <Label htmlFor="title-form">Título</Label>
     <Input id="title-form" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
    </div>
    <div className="grid gap-2">
     <Label htmlFor="description-form">Descrição</Label>
     <Textarea id="description-form" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
    </div>
    <div className="grid gap-2">
     <Label>Tipo</Label>
     <RadioGroup
      value={formData.type}
      onValueChange={(value: "income" | "expense") => setFormData({ ...formData, type: value, categoryId: "" })}
      className="flex gap-6"
     >
      <div className="flex items-center space-x-2"><RadioGroupItem value="income" id="income-form" /><Label htmlFor="income-form">Receita</Label></div>
      <div className="flex items-center space-x-2"><RadioGroupItem value="expense" id="expense-form" /><Label htmlFor="expense-form">Despesa</Label></div>
     </RadioGroup>
    </div>
    <div className="grid gap-2">
     <Label htmlFor="amount-form">Valor</Label>
     <Input id="amount-form" type="number" step="0.01" min="0" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
    </div>
    <div className="grid gap-2">
     <Label htmlFor="category-form">Categoria</Label>
     <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
      <SelectTrigger id="category-form"><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
      <SelectContent>
       {filteredCategories.map((category) => (
        <SelectItem key={category.id} value={category.id}>
         <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />{category.name}</div>
        </SelectItem>
       ))}
      </SelectContent>
     </Select>
    </div>
    <div className="grid gap-2">
     <Label htmlFor="date-form">Data</Label>
     <Popover>
      <PopoverTrigger asChild>
       <Button variant={"outline"} id="date-form" className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}>
        <CalendarIcon className="mr-2 h-4 w-4" />
        {formData.date ? format(formData.date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
       </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.date} onSelect={(date) => date && setFormData({ ...formData, date })} initialFocus locale={ptBR} /></PopoverContent>
     </Popover>
    </div>
   </div>
   <div className="mt-auto flex flex-col sm:flex-row-reverse gap-2 p-4 px-0 pt-4">
    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
     {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
     {transaction ? "Salvar Alterações" : "Criar Transação"}
    </Button>
    <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
     Cancelar
    </Button>
   </div>
  </form>
 )
}