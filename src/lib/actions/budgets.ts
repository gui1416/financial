"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createBudget(prevState: any, formData: FormData) {
 const cookieStore = cookies()
 const supabase = createServerActionClient({ cookies: () => cookieStore })

 // Get current user
 const {
  data: { user },
 } = await supabase.auth.getUser()

 if (!user) {
  return { error: "Usuário não autenticado" }
 }

 const name = formData.get("name")?.toString()
 const amount = formData.get("amount")?.toString()
 const period = formData.get("period")?.toString()
 const categoryId = formData.get("categoryId")?.toString()
 const startDate = formData.get("startDate")?.toString()
 const endDate = formData.get("endDate")?.toString()

 if (!name || !amount || !period || !startDate || !endDate) {
  return { error: "Todos os campos obrigatórios devem ser preenchidos" }
 }

 if (period !== "monthly" && period !== "yearly") {
  return { error: "Período deve ser 'monthly' ou 'yearly'" }
 }

 const numericAmount = Number.parseFloat(amount)
 if (isNaN(numericAmount) || numericAmount <= 0) {
  return { error: "Valor deve ser um número positivo" }
 }

 // Validate dates
 const start = new Date(startDate)
 const end = new Date(endDate)
 if (start >= end) {
  return { error: "Data de início deve ser anterior à data de fim" }
 }

 try {
  const { error } = await supabase.from("budgets").insert({
   user_id: user.id,
   name,
   amount: numericAmount,
   period,
   category_id: categoryId || null,
   start_date: startDate,
   end_date: endDate,
  })

  if (error) {
   console.error("Error creating budget:", error)
   return { error: "Erro ao criar orçamento" }
  }

  revalidatePath("/budgets")
  revalidatePath("/dashboard")
  return { success: true }
 } catch (error) {
  console.error("Unexpected error:", error)
  return { error: "Erro inesperado ao criar orçamento" }
 }
}

export async function updateBudget(budgetId: string, prevState: any, formData: FormData) {
 const cookieStore = cookies()
 const supabase = createServerActionClient({ cookies: () => cookieStore })

 // Get current user
 const {
  data: { user },
 } = await supabase.auth.getUser()

 if (!user) {
  return { error: "Usuário não autenticado" }
 }

 const name = formData.get("name")?.toString()
 const amount = formData.get("amount")?.toString()
 const period = formData.get("period")?.toString()
 const categoryId = formData.get("categoryId")?.toString()
 const startDate = formData.get("startDate")?.toString()
 const endDate = formData.get("endDate")?.toString()

 if (!name || !amount || !period || !startDate || !endDate) {
  return { error: "Todos os campos obrigatórios devem ser preenchidos" }
 }

 if (period !== "monthly" && period !== "yearly") {
  return { error: "Período deve ser 'monthly' ou 'yearly'" }
 }

 const numericAmount = Number.parseFloat(amount)
 if (isNaN(numericAmount) || numericAmount <= 0) {
  return { error: "Valor deve ser um número positivo" }
 }

 // Validate dates
 const start = new Date(startDate)
 const end = new Date(endDate)
 if (start >= end) {
  return { error: "Data de início deve ser anterior à data de fim" }
 }

 try {
  const { error } = await supabase
   .from("budgets")
   .update({
    name,
    amount: numericAmount,
    period,
    category_id: categoryId || null,
    start_date: startDate,
    end_date: endDate,
    updated_at: new Date().toISOString(),
   })
   .eq("id", budgetId)
   .eq("user_id", user.id)

  if (error) {
   console.error("Error updating budget:", error)
   return { error: "Erro ao atualizar orçamento" }
  }

  revalidatePath("/budgets")
  revalidatePath("/dashboard")
  return { success: true }
 } catch (error) {
  console.error("Unexpected error:", error)
  return { error: "Erro inesperado ao atualizar orçamento" }
 }
}

export async function deleteBudget(budgetId: string) {
 const cookieStore = cookies()
 const supabase = createServerActionClient({ cookies: () => cookieStore })

 // Get current user
 const {
  data: { user },
 } = await supabase.auth.getUser()

 if (!user) {
  redirect("/auth/login")
 }

 try {
  const { error } = await supabase.from("budgets").delete().eq("id", budgetId).eq("user_id", user.id)

  if (error) {
   console.error("Error deleting budget:", error)
   throw new Error("Erro ao deletar orçamento")
  }

  revalidatePath("/budgets")
  revalidatePath("/dashboard")
 } catch (error) {
  console.error("Unexpected error:", error)
  throw error
 }
}
