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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ColorPicker } from "./color-picker"
import { IconPicker } from "./icon-picker"

interface Category {
 id?: string
 name?: string
 color?: string
 icon?: string
 type: "income" | "expense"
}

interface CategoryDialogProps {
 open: boolean
 onOpenChange: (open: boolean) => void
 category?: Category | null
 onSaved: () => void
}

export function CategoryDialog({ open, onOpenChange, category, onSaved }: CategoryDialogProps) {
 const [isLoading, setIsLoading] = useState(false)
 const [formData, setFormData] = useState({
  name: "",
  color: "#6366f1",
  icon: "folder",
  type: "expense" as "income" | "expense",
 })

 useEffect(() => {
  if (category?.id) {
   // Editing existing category
   setFormData({
    name: category.name || "",
    color: category.color || "#6366f1",
    icon: category.icon || "folder",
    type: category.type,
   })
  } else if (category?.type) {
   // Creating new category with predefined type
   setFormData({
    name: "",
    color: category.type === "income" ? "#22c55e" : "#ef4444",
    icon: category.type === "income" ? "trending-up" : "shopping-bag",
    type: category.type,
   })
  } else {
   // Default new category
   setFormData({
    name: "",
    color: "#6366f1",
    icon: "folder",
    type: "expense",
   })
  }
 }, [category, open])

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  const supabase = createClient()
  const {
   data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const categoryData = {
   name: formData.name,
   color: formData.color,
   icon: formData.icon,
   type: formData.type,
   user_id: user.id,
  }

  try {
   if (category?.id) {
    // Update existing category
    const { error } = await supabase.from("categories").update(categoryData).eq("id", category.id)

    if (error) throw error
   } else {
    // Create new category
    const { error } = await supabase.from("categories").insert(categoryData)

    if (error) throw error
   }

   onSaved()
  } catch (error) {
   console.error("Error saving category:", error)
  } finally {
   setIsLoading(false)
  }
 }

 return (
  <Dialog open={open} onOpenChange={onOpenChange}>
   <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
     <DialogTitle>{category?.id ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
     <DialogDescription>
      {category?.id ? "Edite os dados da categoria." : "Crie uma nova categoria para suas transações."}
     </DialogDescription>
    </DialogHeader>
    <form onSubmit={handleSubmit}>
     <div className="grid gap-4 py-4">
      <div className="grid gap-2">
       <Label htmlFor="name">Nome</Label>
       <Input
        id="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
       />
      </div>
      <div className="grid gap-2">
       <Label>Tipo</Label>
       <RadioGroup
        value={formData.type}
        onValueChange={(value: "income" | "expense") => setFormData({ ...formData, type: value })}
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
       <Label>Cor</Label>
       <ColorPicker value={formData.color} onChange={(color) => setFormData({ ...formData, color })} />
      </div>
      <div className="grid gap-2">
       <Label>Ícone</Label>
       <IconPicker value={formData.icon} onChange={(icon) => setFormData({ ...formData, icon })} />
      </div>
     </div>
     <DialogFooter>
      <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
       Cancelar
      </Button>
      <Button type="submit" disabled={isLoading}>
       {isLoading ? "Salvando..." : category?.id ? "Salvar" : "Criar"}
      </Button>
     </DialogFooter>
    </form>
   </DialogContent>
  </Dialog>
 )
}
