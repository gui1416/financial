"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { Budget, Category } from "@/lib/supabase/types"

interface BudgetFormProps {
 categories: Category[]
 budget?: Budget
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
    "Atualizar Orçamento"
   ) : (
    "Criar Orçamento"
   )}
  </Button>
 )
}

export default function BudgetForm({ categories, budget, action, title }: BudgetFormProps) {
 const router = useRouter()
 const [state, formAction] = useActionState(action, null)
 const [selectedPeriod, setSelectedPeriod] = useState(budget?.period || "monthly")
 const [selectedCategory, setSelectedCategory] = useState(budget?.category_id || "")

 // Handle successful form submission
 useEffect(() => {
  if (state?.success) {
   router.push("/budgets")
  }
 }, [state, router])

 // Format date for input (YYYY-MM-DD)
 const formatDateForInput = (dateString?: string) => {
  if (!dateString) return new Date().toISOString().split("T")[0]
  return new Date(dateString).toISOString().split("T")[0]
 }

 // Calculate default end date based on period
 const getDefaultEndDate = (startDate: string, period: string) => {
  const start = new Date(startDate)
  if (period === "monthly") {
   const end = new Date(start.getFullYear(), start.getMonth() + 1, 0) // Last day of month
   return end.toISOString().split("T")[0]
  } else {
   const end = new Date(start.getFullYear(), 11, 31) // End of year
   return end.toISOString().split("T")[0]
  }
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
       <Label htmlFor="name" className="text-slate-300">
        Nome do Orçamento *
       </Label>
       <Input
        id="name"
        name="name"
        type="text"
        placeholder="Ex: Orçamento Mensal"
        defaultValue={budget?.name}
        required
        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
       />
      </div>

      <div className="space-y-2">
       <Label htmlFor="amount" className="text-slate-300">
        Valor Limite *
       </Label>
       <Input
        id="amount"
        name="amount"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0,00"
        defaultValue={budget?.amount}
        required
        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
       />
      </div>

      <div className="space-y-2">
       <Label htmlFor="period" className="text-slate-300">
        Período *
       </Label>
       <Select name="period" value={selectedPeriod} onValueChange={setSelectedPeriod}>
        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
         <SelectValue placeholder="Selecione o período" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600">
         <SelectItem value="monthly" className="text-white hover:bg-slate-600">
          Mensal
         </SelectItem>
         <SelectItem value="yearly" className="text-white hover:bg-slate-600">
          Anual
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
      </div>

      <div className="space-y-2">
       <Label htmlFor="startDate" className="text-slate-300">
        Data de Início *
       </Label>
       <Input
        id="startDate"
        name="startDate"
        type="date"
        defaultValue={formatDateForInput(budget?.start_date)}
        required
        className="bg-slate-700 border-slate-600 text-white"
       />
      </div>

      <div className="space-y-2">
       <Label htmlFor="endDate" className="text-slate-300">
        Data de Fim *
       </Label>
       <Input
        id="endDate"
        name="endDate"
        type="date"
        defaultValue={formatDateForInput(budget?.end_date)}
        required
        className="bg-slate-700 border-slate-600 text-white"
       />
      </div>
     </div>

     <div className="flex items-center space-x-4">
      <SubmitButton isEditing={!!budget} />
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
