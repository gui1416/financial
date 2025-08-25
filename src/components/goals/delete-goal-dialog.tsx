"use client"

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

interface Goal {
 id: string
 title: string
}

interface DeleteGoalDialogProps {
 open: boolean
 onOpenChange: (open: boolean) => void
 goal: Goal | null
 onDeleted: () => void
 isLoading?: boolean;
}

export function DeleteGoalDialog({ open, onOpenChange, goal, onDeleted, isLoading = false }: DeleteGoalDialogProps) {

 return (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
   <AlertDialogContent>
    <AlertDialogHeader>
     <AlertDialogTitle>Excluir Meta</AlertDialogTitle>
     <AlertDialogDescription>
      Tem certeza que deseja excluir a meta &quot;{goal?.title}&quot;? Esta ação não pode ser desfeita.
     </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
     <AlertDialogCancel>Cancelar</AlertDialogCancel>
     <AlertDialogAction
      onClick={onDeleted}
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