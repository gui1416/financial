"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader,
 DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"

interface Category {
 id: string
 name: string
 color: string
 type: "income" | "expense"
}

interface Transaction {
 id: string
 title: string
 description: string | null
 amount: number
 type: "income" | "expense"
 date: string
 categories: {
  id: string
  name: string
  color: string
 }[] | null
}

interface TransactionDialogProps {
 open: boolean
 onOpenChange: (open: boolean) => void
 transaction?: Transaction | null
 onSaved: () => void
}

export function TransactionDialog({ open, onOpenChange, transaction, onSaved }: TransactionDialogProps) {
 const [categories, setCategories] = useState<Category[]>([])
 const [isLoading, setIsLoading] = useState(false)
 const [formData, setFormData] = useState({
  title: "",
  description: "",
  amount: "",
  type: "expense" as "income" | "expense",
  categoryId: "",
  date: new Date().toISOString().split("T")[0],
 })

 useEffect(() => {
  if (transaction) {
   const category = transaction.categories && transaction.categories.length > 0 ? transaction.categories[0] : null;
   setFormData({
    title: transaction.title,
    description: transaction.description || "",
    amount: transaction.amount.toString(),
    type: transaction.type,
    categoryId: category?.id || "",
    date: transaction.date,
   })
  } else {
   setFormData({
    title: "",
    description: "",
    amount: "",
    type: "expense",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
   })
  }
 }, [transaction, open])

 useEffect(() => {
  async function fetchCategories() {
   const supabase = createClient()
   const {
    data: { user },
   } = await supabase.auth.getUser()

   if (!user) return

   const { data } = await supabase
    .from("categories")
    .select("id, name, color, type")
    .eq("user_id", user.id)
    .order("name")

   if (data) {
    setCategories(data)
   }
  }

  if (open) {
   fetchCategories()
  }
 }, [open])

 const filteredCategories = categories.filter((category) => category.type === formData.type)

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  const supabase = createClient()
  const {
   data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const transactionData = {
   title: formData.title,
   description: formData.description || null,
   amount: Number.parseFloat(formData.amount),
   type: formData.type,
   category_id: formData.categoryId || null,
   date: formData.date,
   user_id: user.id,
  }

  try {
   if (transaction) {
    const { error } = await supabase.from("transactions").update(transactionData).eq("id", transaction.id)

    if (error) throw error

    toast.success("Transação atualizada!", {
     description: "A transação foi atualizada com sucesso.",
    })
   } else {
    const { error } = await supabase.from("transactions").insert(transactionData)

    if (error) throw error

    toast.success("Transação criada!", {
     description: "A nova transação foi adicionada com sucesso.",
    })
   }

   onSaved()
  } catch (error) {
   console.error("Error saving transaction:", error)

   toast.error("Erro ao salvar transação", {
    description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
   })
  } finally {
   setIsLoading(false)
  }
 }

 return (
  <Dialog open={open} onOpenChange={onOpenChange}>
   <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
     <DialogTitle>{transaction ? "Editar Transação" : "Nova Transação"}</DialogTitle>
     <DialogDescription>
      {transaction ? "Edite os dados da transação." : "Adicione uma nova transação financeira."}
     </DialogDescription>
    </DialogHeader>
    <form onSubmit={handleSubmit}>
     <div className="grid gap-4 py-4">
      <div className="grid gap-2">
       <Label htmlFor="title">Título</Label>
       <Input
        id="title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
       />
      </div>
      <div className="grid gap-2">
       <Label htmlFor="description">Descrição</Label>
       <Textarea
        id="description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        rows={3}
       />
      </div>
      <div className="grid gap-2">
       <Label>Tipo</Label>
       <RadioGroup
        value={formData.type}
        onValueChange={(value: "income" | "expense") =>
         setFormData({ ...formData, type: value, categoryId: "" })
        }
        className="flex gap-6"
       >
        <div className="flex items-center space-x-2">
         <RadioGroupItem value="income" id="income" />
         <Label htmlFor="income">Receita</Label>
        </div>
        <div className="flex items-center space-x-2">
         <RadioGroupItem value="expense" id="expense" />
         <Label htmlFor="expense">Despesa</Label>
        </div>
       </RadioGroup>
      </div>
      <div className="grid gap-2">
       <Label htmlFor="amount">Valor</Label>
       <Input
        id="amount"
        type="number"
        step="0.01"
        min="0"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        required
       />
      </div>
      <div className="grid gap-2">
       <Label htmlFor="category">Categoria</Label>
       <Select
        value={formData.categoryId}
        onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
       >
        <SelectTrigger>
         <SelectValue placeholder="Selecione uma categoria" />
        </SelectTrigger>
        <SelectContent>
         {filteredCategories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
           <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
            {category.name}
           </div>
          </SelectItem>
         ))}
        </SelectContent>
       </Select>
      </div>
      <div className="grid gap-2">
       <Label htmlFor="date">Data</Label>
       <Input
        id="date"
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
       />
      </div>
     </div>
     <DialogFooter>
      <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
       Cancelar
      </Button>
      <Button type="submit" disabled={isLoading}>
       {isLoading ? "Salvando..." : transaction ? "Salvar" : "Criar"}
      </Button>
     </DialogFooter>
    </form>
   </DialogContent>
  </Dialog>
 )
}