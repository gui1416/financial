"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Category {
 id: string
 name: string
 _count?: {
  transactions: number
 }
}

interface DeleteCategoryDialogProps {
 open: boolean
 onOpenChange: (open: boolean) => void
 category: Category | null
 onDeleted: () => void
}

export function DeleteCategoryDialog({ open, onOpenChange, category, onDeleted }: DeleteCategoryDialogProps) {
 const [isLoading, setIsLoading] = useState(false)

 const handleDelete = async () => {
  if (!category) return

  setIsLoading(true)

  const supabase = createClient()

  try {
   // First, update all transactions to remove the category reference
   await supabase.from("transactions").update({ category_id: null }).eq("category_id", category.id)

   // Then delete the category
   const { error } = await supabase.from("categories").delete().eq("id", category.id)

   if (error) throw error

   onDeleted()
  } catch (error) {
   console.error("Error deleting category:", error)
  } finally {
   setIsLoading(false)
  }
 }

 const transactionCount = category?._count?.transactions || 0

 return (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
   <AlertDialogContent>
    <AlertDialogHeader>
     <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
     <AlertDialogDescription>
      Tem certeza que deseja excluir a categoria "{category?.name}"?
      {transactionCount > 0 && (
       <>
        <br />
        <br />
        Esta categoria possui {transactionCount} transação(ões) vinculada(s). As transações não serão excluídas,
        mas ficarão sem categoria.
       </>
      )}
      <br />
      <br />
      Esta ação não pode ser desfeita.
     </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
     <AlertDialogCancel>Cancelar</AlertDialogCancel>
     <AlertDialogAction
      onClick={handleDelete}
      disabled={isLoading}
      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
     >
      {isLoading ? "Excluindo..." : "Excluir"}
     </AlertDialogAction>
    </AlertDialogFooter>
   </AlertDialogContent>
  </AlertDialog>
 )
}
