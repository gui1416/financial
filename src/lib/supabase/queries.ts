import { createClient } from "./server"
import type { Transaction, Category, FinancialSummary } from "./types"

export async function getFinancialSummary(userId: string): Promise<FinancialSummary> {
 const supabase = createClient()

 // Get current month transactions
 const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format

 const { data: transactions } = await supabase.from("transactions").select("amount, type, date").eq("user_id", userId)

 const { data: monthlyTransactions } = await supabase
  .from("transactions")
  .select("amount, type")
  .eq("user_id", userId)
  .gte("date", `${currentMonth}-01`)
  .lt("date", `${currentMonth}-32`)

 const totalIncome =
  transactions?.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0) || 0
 const totalExpenses =
  transactions?.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0) || 0

 const monthlyIncome =
  monthlyTransactions?.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0) || 0
 const monthlyExpenses =
  monthlyTransactions?.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0) || 0

 return {
  totalIncome,
  totalExpenses,
  balance: totalIncome - totalExpenses,
  monthlyIncome,
  monthlyExpenses,
  monthlyBalance: monthlyIncome - monthlyExpenses,
 }
}

export async function getRecentTransactions(userId: string, limit = 10): Promise<Transaction[]> {
 const supabase = createClient()

 const { data } = await supabase
  .from("transactions")
  .select(`
      *,
      category:categories(*)
    `)
  .eq("user_id", userId)
  .order("date", { ascending: false })
  .order("created_at", { ascending: false })
  .limit(limit)

 return data || []
}

export async function getCategories(userId: string): Promise<Category[]> {
 const supabase = createClient()

 const { data } = await supabase.from("categories").select("*").eq("user_id", userId).order("name")

 return data || []
}

export async function getMonthlyExpensesByCategory(
 userId: string,
 month?: string,
): Promise<{ category: string; amount: number; color: string }[]> {
 const supabase = createClient()
 const targetMonth = month || new Date().toISOString().slice(0, 7)

 const { data } = await supabase
  .from("transactions")
  .select(`
      amount,
      category:categories(name, color)
    `)
  .eq("user_id", userId)
  .eq("type", "expense")
  .gte("date", `${targetMonth}-01`)
  .lt("date", `${targetMonth}-32`)

 const categoryTotals = new Map()

 data?.forEach((transaction) => {
  const categoryName = transaction.category?.name || "Sem categoria"
  const categoryColor = transaction.category?.color || "#6B7280"
  const amount = Number(transaction.amount)

  if (categoryTotals.has(categoryName)) {
   categoryTotals.set(categoryName, {
    ...categoryTotals.get(categoryName),
    amount: categoryTotals.get(categoryName).amount + amount,
   })
  } else {
   categoryTotals.set(categoryName, {
    category: categoryName,
    amount,
    color: categoryColor,
   })
  }
 })

 return Array.from(categoryTotals.values()).sort((a, b) => b.amount - a.amount)
}
