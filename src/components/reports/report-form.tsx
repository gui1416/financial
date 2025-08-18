"use client"

import React from "react"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, FileText } from "lucide-react"
import { useState } from "react"
import type { Category } from "@/lib/supabase/types"

interface ReportFormProps {
 categories: Category[]
 action: (prevState: any, formData: FormData) => Promise<any>
 onReportGenerated: (data: any) => void
}

function SubmitButton() {
 const { pending } = useFormStatus()

 return (
  <Button type="submit" disabled={pending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
   {pending ? (
    <>
     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
     Gerando...
    </>
   ) : (
    <>
     <FileText className="mr-2 h-4 w-4" />
     Gerar Relatório
    </>
   )}
  </Button>
 )
}

export default function ReportForm({ categories, action, onReportGenerated }: ReportFormProps) {
 const [state, formAction] = useActionState(action, null)
 const [selectedReportType, setSelectedReportType] = useState("monthly")
 const [selectedCategory, setSelectedCategory] = useState("")

 // Handle successful report generation
 React.useEffect(() => {
  if (state?.success && state?.data) {
   onReportGenerated(state.data)
  }
 }, [state, onReportGenerated])

 // Get default dates based on report type
 const getDefaultDates = (reportType: string) => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  switch (reportType) {
   case "monthly":
    return {
     start: new Date(currentYear, currentMonth, 1).toISOString().split("T")[0],
     end: new Date(currentYear, currentMonth + 1, 0).toISOString().split("T")[0],
    }
   case "yearly":
    return {
     start: new Date(currentYear, 0, 1).toISOString().split("T")[0],
     end: new Date(currentYear, 11, 31).toISOString().split("T")[0],
    }
   case "custom":
   default:
    return {
     start: new Date(currentYear, currentMonth, 1).toISOString().split("T")[0],
     end: now.toISOString().split("T")[0],
    }
  }
 }

 const defaultDates = getDefaultDates(selectedReportType)

 return (
  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
   <CardHeader>
    <CardTitle className="text-white">Gerar Relatório Financeiro</CardTitle>
   </CardHeader>
   <CardContent>
    <form action={formAction} className="space-y-6">
     {state?.error && (
      <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded">{state.error}</div>
     )}

     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
       <Label htmlFor="reportType" className="text-slate-300">
        Tipo de Relatório *
       </Label>
       <Select name="reportType" value={selectedReportType} onValueChange={setSelectedReportType}>
        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
         <SelectValue placeholder="Selecione o tipo" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600">
         <SelectItem value="monthly" className="text-white hover:bg-slate-600">
          Relatório Mensal
         </SelectItem>
         <SelectItem value="yearly" className="text-white hover:bg-slate-600">
          Relatório Anual
         </SelectItem>
         <SelectItem value="custom" className="text-white hover:bg-slate-600">
          Período Personalizado
         </SelectItem>
        </SelectContent>
       </Select>
      </div>

      <div className="space-y-2">
       <Label htmlFor="categoryId" className="text-slate-300">
        Categoria (Opcional)
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
        defaultValue={defaultDates.start}
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
        defaultValue={defaultDates.end}
        required
        className="bg-slate-700 border-slate-600 text-white"
       />
      </div>
     </div>

     <SubmitButton />
    </form>
   </CardContent>
  </Card>
 )
}
