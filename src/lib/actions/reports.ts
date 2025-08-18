"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function generateReport(prevState: any, formData: FormData) {
 const cookieStore = cookies()
 const supabase = createServerActionClient({ cookies: () => cookieStore })

 // Get current user
 const {
  data: { user },
 } = await supabase.auth.getUser()

 if (!user) {
  return { error: "Usuário não autenticado" }
 }

 const reportType = formData.get("reportType")?.toString()
 const startDate = formData.get("startDate")?.toString()
 const endDate = formData.get("endDate")?.toString()
 const categoryId = formData.get("categoryId")?.toString()

 if (!reportType || !startDate || !endDate) {
  return { error: "Tipo de relatório, data de início e fim são obrigatórios" }
 }

 try {
  // Build query based on filters
  let query = supabase
   .from("transactions")
   .select(`
        *,
        category:categories(*)
      `)
   .eq("user_id", user.id)
   .gte("date", startDate)
   .lte("date", endDate)
   .order("date", { ascending: false })

  // Filter by category if specified
  if (categoryId) {
   query = query.eq("category_id", categoryId)
  }

  const { data: transactions, error } = await query

  if (error) {
   console.error("Error fetching transactions:", error)
   return { error: "Erro ao buscar transações" }
  }

  // Calculate summary
  const totalIncome =
   transactions?.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0) || 0
  const totalExpenses =
   transactions?.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0) || 0
  const balance = totalIncome - totalExpenses

  // Group by category for expense breakdown
  const expensesByCategory = new Map()
  transactions
   ?.filter((t) => t.type === "expense")
   .forEach((transaction) => {
    const categoryName = transaction.category?.name || "Sem categoria"
    const amount = Number(transaction.amount)

    if (expensesByCategory.has(categoryName)) {
     expensesByCategory.set(categoryName, expensesByCategory.get(categoryName) + amount)
    } else {
     expensesByCategory.set(categoryName, amount)
    }
   })

  const categoryBreakdown = Array.from(expensesByCategory.entries())
   .map(([category, amount]) => ({ category, amount }))
   .sort((a, b) => b.amount - a.amount)

  return {
   success: true,
   data: {
    reportType,
    period: { startDate, endDate },
    summary: { totalIncome, totalExpenses, balance },
    transactions: transactions || [],
    categoryBreakdown,
    generatedAt: new Date().toISOString(),
   },
  }
 } catch (error) {
  console.error("Unexpected error:", error)
  return { error: "Erro inesperado ao gerar relatório" }
 }
}
