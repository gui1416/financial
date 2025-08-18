"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import type { Category } from "@/lib/supabase/types"
import { deleteCategory } from "@/lib/actions/categories"

interface CategoriesListProps {
 categories: Category[]
}

export default function CategoriesList({ categories }: CategoriesListProps) {
 const [deletingId, setDeletingId] = useState<string | null>(null)

 const handleDelete = async (categoryId: string) => {
  if (!confirm("Tem certeza que deseja excluir esta categoria?")) {
   return
  }

  setDeletingId(categoryId)
  try {
   await deleteCategory(categoryId)
  } catch (error: any) {
   alert(error.message || "Erro ao excluir categoria")
  } finally {
   setDeletingId(null)
  }
 }

 if (categories.length === 0) {
  return (
   <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
    <CardContent className="py-8">
     <div className="text-center text-slate-400">
      <p className="mb-4">Nenhuma categoria encontrada</p>
      <Link href="/categories/new">
       <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Criar primeira categoria</Button>
      </Link>
     </div>
    </CardContent>
   </Card>
  )
 }

 return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
   {categories.map((category) => (
    <Card
     key={category.id}
     className="bg-slate-800/50 border-slate-700 backdrop-blur hover:bg-slate-800/70 transition-colors"
    >
     <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
       <div className="flex items-center space-x-3">
        <div
         className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
         style={{ backgroundColor: category.color }}
        >
         {category.name.charAt(0)}
        </div>
        <div>
         <CardTitle className="text-white text-lg">{category.name}</CardTitle>
         <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
          {category.icon}
         </Badge>
        </div>
       </div>
       <div className="flex items-center space-x-1">
        <Link href={`/categories/${category.id}/edit`}>
         <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
          <Edit className="h-4 w-4" />
         </Button>
        </Link>
        <Button
         size="sm"
         variant="ghost"
         onClick={() => handleDelete(category.id)}
         disabled={deletingId === category.id}
         className="text-slate-400 hover:text-red-400"
        >
         {deletingId === category.id ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
         ) : (
          <Trash2 className="h-4 w-4" />
         )}
        </Button>
       </div>
      </div>
     </CardHeader>
     <CardContent>
      <div className="text-sm text-slate-400">
       Criada em {new Date(category.created_at).toLocaleDateString("pt-BR")}
      </div>
     </CardContent>
    </Card>
   ))}
  </div>
 )
}
