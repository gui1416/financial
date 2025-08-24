"use client"

import type React from "react"

import { useState } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface GoalDialogProps {
 open: boolean
 onOpenChange: (open: boolean) => void
}

export function GoalDialog({ open, onOpenChange }: GoalDialogProps) {
 const [loading, setLoading] = useState(false)
 const [formData, setFormData] = useState({
  title: "",
  description: "",
  target: "",
  deadline: "",
  type: "savings" as "savings" | "expense",
  category: "",
 })
 const { toast } = useToast()

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  try {
   // Aqui você implementaria a lógica para salvar a meta no banco de dados
   // Por enquanto, apenas simular o salvamento
   await new Promise((resolve) => setTimeout(resolve, 1000))

   toast({
    title: "Meta criada",
    description: "Sua nova meta foi criada com sucesso.",
   })

   // Reset form
   setFormData({
    title: "",
    description: "",
    target: "",
    deadline: "",
    type: "savings",
    category: "",
   })

   onOpenChange(false)
  } catch (error) {
   toast({
    title: "Erro ao criar meta",
    description: "Não foi possível criar a meta. Tente novamente.",
    variant: "destructive",
   })
  } finally {
   setLoading(false)
  }
 }

 return (
  <Dialog open={open} onOpenChange={onOpenChange}>
   <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
     <DialogTitle>Nova Meta Financeira</DialogTitle>
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
        onValueChange={(value: "savings" | "expense") => setFormData((prev) => ({ ...prev, type: value }))}
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
       <Input
        id="category"
        value={formData.category}
        onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
        placeholder="Ex: Poupança"
       />
      </div>
     </div>

     <DialogFooter>
      <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
       Cancelar
      </Button>
      <Button type="submit" disabled={loading}>
       {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
       Criar Meta
      </Button>
     </DialogFooter>
    </form>
   </DialogContent>
  </Dialog>
 )
}
