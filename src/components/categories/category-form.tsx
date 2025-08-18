"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { Category } from "@/lib/supabase/types"

interface CategoryFormProps {
 category?: Category
 action: (prevState: any, formData: FormData) => Promise<any>
 title: string
}

const PRESET_COLORS = [
 "#EF4444", // Red
 "#F97316", // Orange
 "#F59E0B", // Amber
 "#EAB308", // Yellow
 "#84CC16", // Lime
 "#22C55E", // Green
 "#10B981", // Emerald
 "#06B6D4", // Cyan
 "#3B82F6", // Blue
 "#6366F1", // Indigo
 "#8B5CF6", // Violet
 "#A855F7", // Purple
 "#EC4899", // Pink
 "#F43F5E", // Rose
]

const PRESET_ICONS = [
 "folder",
 "home",
 "car",
 "utensils",
 "heart",
 "book",
 "gamepad-2",
 "banknote",
 "laptop",
 "trending-up",
 "shopping-cart",
 "plane",
 "coffee",
 "more-horizontal",
]

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
    "Atualizar Categoria"
   ) : (
    "Criar Categoria"
   )}
  </Button>
 )
}

export default function CategoryForm({ category, action, title }: CategoryFormProps) {
 const router = useRouter()
 const [state, formAction] = useActionState(action, null)
 const [selectedColor, setSelectedColor] = useState(category?.color || PRESET_COLORS[0])
 const [selectedIcon, setSelectedIcon] = useState(category?.icon || PRESET_ICONS[0])

 // Handle successful form submission
 useEffect(() => {
  if (state?.success) {
   router.push("/categories")
  }
 }, [state, router])

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

     <div className="space-y-2">
      <Label htmlFor="name" className="text-slate-300">
       Nome da Categoria *
      </Label>
      <Input
       id="name"
       name="name"
       type="text"
       placeholder="Ex: Alimentação"
       defaultValue={category?.name}
       required
       className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
      />
     </div>

     <div className="space-y-2">
      <Label className="text-slate-300">Cor *</Label>
      <input type="hidden" name="color" value={selectedColor} />
      <div className="grid grid-cols-7 gap-2">
       {PRESET_COLORS.map((color) => (
        <button
         key={color}
         type="button"
         onClick={() => setSelectedColor(color)}
         className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? "border-white scale-110" : "border-slate-600 hover:border-slate-400"
          }`}
         style={{ backgroundColor: color }}
        />
       ))}
      </div>
     </div>

     <div className="space-y-2">
      <Label className="text-slate-300">Ícone</Label>
      <input type="hidden" name="icon" value={selectedIcon} />
      <div className="grid grid-cols-7 gap-2">
       {PRESET_ICONS.map((icon) => (
        <button
         key={icon}
         type="button"
         onClick={() => setSelectedIcon(icon)}
         className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${selectedIcon === icon
           ? "border-emerald-500 bg-emerald-500/20"
           : "border-slate-600 hover:border-slate-400 bg-slate-700"
          }`}
        >
         <span className="text-white text-sm">{icon.charAt(0).toUpperCase()}</span>
        </button>
       ))}
      </div>
     </div>

     <div className="flex items-center space-x-4">
      <SubmitButton isEditing={!!category} />
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
