"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useQuery } from "@tanstack/react-query"
interface Transaction {
  id: string
  title: string
  amount: number
  type: "income" | "expense"
  date: string
  categories: {
    name: string
    color: string
  } | null
}

const fetchRecentTransactions = async (): Promise<Transaction[]> => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Usuário não autenticado");

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
           id,
           title,
           amount,
           type,
           date,
           categories (
             name,
             color
           )
         `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) throw error;

  return data as Transaction[];
}


export function RecentTransactions() {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: fetchRecentTransactions
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR")
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>Suas últimas 5 transações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </div>
                <div className="h-6 w-16 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
        <CardDescription>Suas últimas 5 transações</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhuma transação encontrada</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center space-x-4">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: transaction.categories?.color || "#6b7280" }}
                >
                  {transaction.categories?.name.charAt(0).toUpperCase() || "T"}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{transaction.title}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                    {transaction.categories && (
                      <Badge variant="secondary" className="text-xs">
                        {transaction.categories.name}
                      </Badge>
                    )}
                  </div>
                </div>
                <div
                  className={`text-sm font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}