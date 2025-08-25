"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader,
 DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface Goal {
 id?: string
 title: string
 description?: string | null
 target: number
 deadline: string
 type: "savings" | "expense"
 category_id?: string | null
}

interface Category {
 id: string
 name: string
 type: "income" | "expense"
}

interface GoalDialogProps {
 open: boolean
 onOpenChange: (open: boolean) => void
 goal?: Partial<Goal> | null
}

export function GoalDialog({ open, onOpenChange, goal }: GoalDialogProps) {
 const queryClient = useQueryClient()
 const [categories, setCategories] = useState<Category[]>([])
 const [formData, setFormData] = useState({
  title: "",
  description: "",
  target: "",
  deadline: "",
  type: "savings" as "savings" | "expense",
  category_id: "",
 })

 useEffect(() => {
  async function fetchCategories() {
   const supabase = createClient()
   const { data } = await supabase
    .from("categories")
    .select("id, name, type")
    .order("name")

   if (data) setCategories(data)
  }
  if (open) fetchCategories()
 }, [open])


 useEffect(() => {
  if (goal) {
   setFormData({
    title: goal.title || "",
    description: goal.description || "",
    target: goal.target?.toString() || "",
    deadline: goal.deadline || new Date().toISOString().split("T")[0],
    type: goal.type || "savings",
    category_id: goal.category_id || "",
   })
  }
 }, [goal, open])

 const mutation = useMutation({
  mutationFn: async (newGoal: Omit<Goal, 'id' | 'current'>) => {
   const supabase = createClient()
   const { data: { user } } = await supabase.auth.getUser()
   if (!user) throw new Error("Usuário não autenticado")

   const { error } = await supabase.from("goals").insert([{ ...newGoal, user_id: user.id }])

   if (error) throw error
  },
  onSuccess: () => {
   toast.success("Meta criada com sucesso!")
   queryClient.invalidateQueries({ queryKey: ['goals'] })
   queryClient.invalidateQueries({ queryKey: ['goals-overview'] })
   onOpenChange(false)
  },
  onError: (error) => {
   toast.error("Erro ao criar meta", {
    description: error.message
   })
  }
 })

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  mutation.mutate({
   title: formData.title,
   description: formData.description,
   target: parseFloat(formData.target),
   deadline: formData.deadline,
   type: formData.type,
   category_id: formData.category_id || null
  })
 }

 const filteredCategories = categories.filter(c => formData.type === 'expense' ? c.type === 'expense' : c.type === 'income');

 return (
  <Dialog open={open} onOpenChange={onOpenChange}>
   <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
     <DialogTitle>{goal?.id ? "Editar Meta" : "Nova Meta Financeira"}</DialogTitle>
     <DialogDescription>Defina uma nova meta para acompanhar seu progresso financeiro.</DialogDescription>
    </DialogHeader>

    <form onSubmit={handleSubmit} className="space-y-4">
     <div className="space-y-2">
      <Label htmlFor="title">Título da Meta</Label>
      <Input
       id="title"
       value={formData.title}
       onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
       placeholder="Ex: Reserva de emergência"
       required
      />
     </div>

     <div className="space-y-2">
      <Label htmlFor="description">Descrição</Label>
      <Textarea
       id="description"
       value={formData.description}
       onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
       placeholder="Descreva sua meta..."
       rows={3}
      />
     </div>

     <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
       <Label htmlFor="type">Tipo</Label>
       <Select
        value={formData.type}
        onValueChange={(value: "savings" | "expense") => setFormData((prev) => ({ ...prev, type: value, category_id: '' }))}
       >
        <SelectTrigger>
         <SelectValue />
        </SelectTrigger>
        <SelectContent>
         <SelectItem value="savings">Economia</SelectItem>
         <SelectItem value="expense">Redução de Gastos</SelectItem>
        </SelectContent>
       </Select>
      </div>

      <div className="space-y-2">
       <Label htmlFor="target">Valor Meta (R$)</Label>
       <Input
        id="target"
        type="number"
        step="0.01"
        value={formData.target}
        onChange={(e) => setFormData((prev) => ({ ...prev, target: e.target.value }))}
        placeholder="0,00"
        required
       />
      </div>
     </div>

     <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
       <Label htmlFor="deadline">Prazo</Label>
       <Input
        id="deadline"
        type="date"
        value={formData.deadline}
        onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
        required
       />
      </div>

      <div className="space-y-2">
       <Label htmlFor="category">Categoria</Label>
       <Select
        value={formData.category_id}
        onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
       >
        <SelectTrigger>
         <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
         {filteredCategories.map(c => (
          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
         ))}
        </SelectContent>
       </Select>
      </div>
     </div>

     <DialogFooter>
      <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
       Cancelar
      </Button>
      <Button type="submit" disabled={mutation.isPending}>
       {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
       Criar Meta
      </Button>
     </DialogFooter>
    </form>
   </DialogContent>
  </Dialog>
 )
}