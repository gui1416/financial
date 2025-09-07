"use client"

import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTableViewOptions } from "./data-table-view-options"
import { Plus } from "lucide-react"

interface DataTableToolbarProps<TData> {
 table: Table<TData>
 onNew: () => void;
}

export function DataTableToolbar<TData>({
 table,
 onNew
}: DataTableToolbarProps<TData>) {

 return (
  <div className="flex items-center justify-between">
   <div className="flex flex-1 items-center space-x-2">
    <Input
     placeholder="Filtrar por título..."
     value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
     onChange={(event) =>
      table.getColumn("title")?.setFilterValue(event.target.value)
     }
     className="h-8 w-[150px] lg:w-[250px]"
    />
    {/* Aqui você pode adicionar os filtros de Categoria e Tipo se desejar, seguindo o padrão do shadcn */}
   </div>
   <div className="flex items-center space-x-2">
    <DataTableViewOptions table={table} />
    <Button onClick={onNew} size="sm" className="h-8 gap-1">
     <Plus className="h-3.5 w-3.5" />
     <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
      Nova Transação
     </span>
    </Button>
   </div>
  </div>
 )
}