// Em src/components/transactions/data-table-row-actions.tsx

"use client"

import { Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import type { Transaction } from "./columns";

interface DataTableRowActionsProps<TData> {
 row: Row<TData>
 onEdit: (transaction: Transaction) => void;
 onDelete: (transaction: Transaction) => void;
}

export function DataTableRowActions<TData>({
 row,
 onEdit,
 onDelete,
}: DataTableRowActionsProps<TData>) {

 const transaction = row.original as Transaction;

 return (
  <DropdownMenu>
   <DropdownMenuTrigger asChild>
    <Button
     variant="ghost"
     className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
    >
     <MoreHorizontal className="h-4 w-4" />
     <span className="sr-only">Abrir menu</span>
    </Button>
   </DropdownMenuTrigger>
   <DropdownMenuContent align="end" className="w-[160px]">
    <DropdownMenuItem onClick={() => onEdit(transaction)}>
     <Edit className="mr-2 h-4 w-4" />
     Editar
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={() => onDelete(transaction)} className="text-destructive">
     <Trash2 className="mr-2 h-4 w-4" />
     Excluir
    </DropdownMenuItem>
   </DropdownMenuContent>
  </DropdownMenu>
 )
}