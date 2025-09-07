// Em src/components/transactions/columns.tsx

"use client"

import { ColumnDef, RowData } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Button } from "@/components/ui/button"

export interface Transaction {
 id: string
 title: string
 description: string | null
 amount: number
 type: "income" | "expense"
 date: string
 created_at: string
 categories: {
  id: string
  name: string
  color: string;
 } | null;
}

declare module '@tanstack/react-table' {
 interface TableMeta<TData extends RowData> {
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
 }
}

export const columns: ColumnDef<Transaction>[] = [
 {
  id: "select",
  header: ({ table }) => (
   <Checkbox
    checked={
     table.getIsAllPageRowsSelected() ||
     (table.getIsSomePageRowsSelected() && "indeterminate")
    }
    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    aria-label="Selecionar tudo"
    className="translate-y-[2px]"
   />
  ),
  cell: ({ row }) => (
   <Checkbox
    checked={row.getIsSelected()}
    onCheckedChange={(value) => row.toggleSelected(!!value)}
    aria-label="Selecionar linha"
    className="translate-y-[2px]"
   />
  ),
  enableSorting: false,
  enableHiding: false,
 },
 {
  accessorKey: "title",
  header: ({ column }) => (
   <DataTableColumnHeader column={column} title="Título" />
  ),
  cell: ({ row, table }) => {
   const { onEdit } = table.options.meta as { onEdit: (transaction: Transaction) => void };
   return (
    <Button variant="link" className="text-foreground p-0 h-auto font-medium" onClick={() => onEdit(row.original)}>
     {row.original.title}
    </Button>
   )
  },
 },
 {
  accessorKey: "categories",
  header: ({ column }) => (
   <DataTableColumnHeader column={column} title="Categoria" />
  ),
  cell: ({ row }) => {
   const category = row.original.categories;
   if (!category) {
    return <span className="text-muted-foreground">Sem categoria</span>
   }
   return (
    <Badge
     variant="secondary"
     className="text-white"
     style={{ backgroundColor: category.color }}
    >
     {category.name}
    </Badge>
   )
  },
  filterFn: (row, id, value) => {
   const category = row.original.categories;
   return value.includes(category?.id)
  },
 },
 {
  accessorKey: "type",
  header: ({ column }) => (
   <DataTableColumnHeader column={column} title="Tipo" />
  ),
  cell: ({ row }) => {
   const type = row.getValue("type") as string;
   return (
    <Badge variant={type === "income" ? "default" : "secondary"}>
     {type === "income" ? "Receita" : "Despesa"}
    </Badge>
   )
  },
  filterFn: (row, id, value) => {
   return value.includes(row.getValue(id))
  },
 },
 {
  accessorKey: "date",
  header: ({ column }) => (
   <DataTableColumnHeader column={column} title="Data" />
  ),
  cell: ({ row }) => {
   const date = new Date(row.getValue("date") + 'T00:00:00');
   return <span>{date.toLocaleDateString("pt-BR")}</span>
  }
 },
 {
  accessorKey: "amount",
  header: ({ column }) => (
   <DataTableColumnHeader column={column} title="Valor" className="text-right" />
  ),
  cell: ({ row }) => {
   const amount = parseFloat(row.getValue("amount"))
   const type = row.original.type
   const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
   }).format(amount)

   return (
    <div className={`text-right font-medium ${type === "income" ? "text-green-600" : "text-red-600"}`}>
     {type === 'income' ? `+ ${formatted}` : `- ${formatted}`}
    </div>
   )
  }
 },
 {
  id: "actions",
  cell: ({ row, table }) => {
   const { onEdit, onDelete } = table.options.meta as {
    onEdit: (transaction: Transaction) => void;
    onDelete: (transaction: Transaction) => void;
   };
   return <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
  },
 },
]