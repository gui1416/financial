"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Plus } from "lucide-react"
import { TransactionDialog } from "./transaction-dialog"
import { DeleteTransactionDialog } from "./delete-transaction-dialog"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

interface Transaction {
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
  }[] | null;
}

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
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Usuário não autenticado");

  let query = supabase
    .from("transactions")
    .select(
      `
        id,
        title,
        description,
        amount,
        type,
        date,
        created_at,
        categories (
          id,
          name,
          color
        )
      `,
    )
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

  return data as Transaction[]
}


export function TransactionsTable({ filters }: TransactionsTableProps) {
  const queryClient = useQueryClient();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)

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
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
      queryClient.invalidateQueries({ queryKey: ['chartData'] });
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
    },
    onError: (error) => {
      toast.error("Erro ao excluir transação", {
        description: error.message
      });
    }
  })


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR")
  }

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDialogOpen(true)
  }

  const handleDelete = (transaction: Transaction) => {
    setTransactionToDelete(transaction)
    setIsDeleteDialogOpen(true)
  }

  const handleTransactionSaved = () => {
    setIsDialogOpen(false)
    setSelectedTransaction(null)
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['metrics'] });
    queryClient.invalidateQueries({ queryKey: ['chartData'] });
  }

  const handleTransactionDeleted = () => {
    if (transactionToDelete) {
      deleteMutation.mutate(transactionToDelete.id);
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transações</CardTitle>
            <CardDescription>Gerencie suas transações financeiras</CardDescription>
          </div>
          <Button onClick={() => { setSelectedTransaction(null); setIsDialogOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Transação
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma transação encontrada</p>
              <Button onClick={() => { setSelectedTransaction(null); setIsDialogOpen(true); }} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Criar primeira transação
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader className="max-md:hidden">
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  const category = transaction.categories && transaction.categories.length > 0 ? transaction.categories[0] : null;
                  return (
                    <TableRow key={transaction.id} className="max-md:block max-md:border-b max-md:mb-4">
                      <TableCell className="max-md:block">
                        <div className="font-medium md:hidden text-muted-foreground text-xs">Título</div>
                        <div>
                          <p className="font-medium">{transaction.title}</p>
                          {transaction.description && (
                            <p className="text-sm text-muted-foreground">{transaction.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-md:block">
                        <div className="font-medium md:hidden text-muted-foreground text-xs">Categoria</div>
                        {category ? (
                          <Badge
                            variant="secondary"
                            className="text-white"
                            style={{ backgroundColor: category.color }}
                          >
                            {category.name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">Sem categoria</span>
                        )}
                      </TableCell>
                      <TableCell className="max-md:block">
                        <div className="font-medium md:hidden text-muted-foreground text-xs">Tipo</div>
                        <Badge variant={transaction.type === "income" ? "default" : "secondary"}>
                          {transaction.type === "income" ? "Receita" : "Despesa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-md:block">
                        <div className="font-medium md:hidden text-muted-foreground text-xs">Data</div>
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell
                        className="max-md:block max-md:text-left font-medium"
                      >
                        <div className="font-medium md:hidden text-muted-foreground text-xs">Valor</div>
                        <span className={`${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                          {transaction.type === "income" ? "+ " : "- "}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="max-md:absolute max-md:top-2 max-md:right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(transaction)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <TransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        transaction={selectedTransaction}
        onSaved={handleTransactionSaved}
      />

      <DeleteTransactionDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        transaction={transactionToDelete}
        onDeleted={handleTransactionDeleted}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}