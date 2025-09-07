"use client"

import * as React from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { TransactionDialog } from "./transaction-dialog"
import { DeleteTransactionDialog } from "./delete-transaction-dialog"
import { TransactionForm } from "./transaction-form"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import type { Transaction } from "./columns"
import { useMediaQuery } from "@/hooks/use-media-query"

interface TransactionsTableProps {
  filters?: {
    search?: string
    type?: string
    categoryId?: string
    dateFrom?: string
    dateTo?: string
  }
}

const fetchTransactions = async (filters: TransactionsTableProps['filters']) => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Usuário não autenticado");

  let query = supabase
    .from("transactions")
    .select(`id, title, description, amount, type, date, created_at, categories (id, name, color)`)
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }
  if (filters?.type && filters.type !== "all") {
    query = query.eq("type", filters.type)
  }
  if (filters?.categoryId && filters.categoryId !== "all") {
    query = query.eq("category_id", filters.categoryId)
  }
  if (filters?.dateFrom) {
    query = query.gte("date", filters.dateFrom)
  }
  if (filters?.dateTo) {
    query = query.lte("date", filters.dateTo)
  }

  const { data, error } = await query
  if (error) throw error
  return data as unknown as Transaction[]
}

export function TransactionsTable({ filters }: TransactionsTableProps) {
  const queryClient = useQueryClient();
  const [isNewDialogOpen, setIsNewDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => fetchTransactions(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("transactions").delete().eq("id", transactionId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Transação excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['transactions', 'metrics', 'chartData'] });
      setIsDeleteDialogOpen(false);
      setSelectedTransaction(null);
    },
    onError: (error: Error) => {
      toast.error("Erro ao excluir transação", { description: error.message });
    }
  })

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  }

  const handleDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDeleteDialogOpen(true)
  }

  const handleNew = () => {
    setSelectedTransaction(null)
    setIsNewDialogOpen(true)
  }

  const handleSave = () => {
    setIsNewDialogOpen(false)
    setIsEditDialogOpen(false)
    setSelectedTransaction(null)
    queryClient.invalidateQueries({ queryKey: ['transactions', 'metrics', 'chartData'] });
  }

  const handleTransactionDeleted = () => {
    if (selectedTransaction) {
      deleteMutation.mutate(selectedTransaction.id);
    }
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={transactions}
        isLoading={isLoading}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Drawer direction={isDesktop ? "right" : "bottom"} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DrawerContent className="p-4">
          <DrawerHeader className="gap-1 text-left">
            <DrawerTitle>Editar Transação</DrawerTitle>
            <DrawerDescription>Altere os detalhes da sua transação abaixo.</DrawerDescription>
          </DrawerHeader>
          {selectedTransaction && (
            <TransactionForm
              key={selectedTransaction.id}
              transaction={selectedTransaction}
              onSaved={handleSave}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DrawerContent>
      </Drawer>

      <TransactionDialog
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
        onSaved={handleSave}
      />

      <DeleteTransactionDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        transaction={selectedTransaction}
        onDeleted={handleTransactionDeleted}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}