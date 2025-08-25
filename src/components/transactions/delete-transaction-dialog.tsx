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

interface Transaction {
 id: string
 title: string
 amount: number
 type: "income" | "expense"
}

interface DeleteTransactionDialogProps {
 open: boolean
 onOpenChange: (open: boolean) => void
 transaction: Transaction | null
 onDeleted: () => void
}

export function DeleteTransactionDialog({ open, onOpenChange, transaction, onDeleted }: DeleteTransactionDialogProps) {
 const [isLoading, setIsLoading] = useState(false)

 const handleDelete = async () => {
  if (!transaction) return

  setIsLoading(true)

  const supabase = createClient()

  try {
   const { error } = await supabase.from("transactions").delete().eq("id", transaction.id)

   if (error) throw error

   onDeleted()
  } catch (error) {
   console.error("Error deleting transaction:", error)
  } finally {
   setIsLoading(false)
  }
 }

 const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
   style: "currency",
   currency: "BRL",
  }).format(value)
 }

 return (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
   <AlertDialogContent>
    <AlertDialogHeader>
     <AlertDialogTitle>Excluir transação</AlertDialogTitle>
     <AlertDialogDescription>
      Tem certeza que deseja excluir a transação &quot;{transaction?.title}&quot; no valor de{" "}
      {transaction && formatCurrency(transaction.amount)}? Esta ação não pode ser desfeita.
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