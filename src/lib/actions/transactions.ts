"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createTransaction(prevState: any, formData: FormData) {
 const cookieStore = cookies()
 const supabase = createServerActionClient({ cookies: () => cookieStore })

 // Get current user
 const {
  data: { user },
 } = await supabase.auth.getUser()

 if (!user) {
  return { error: "Usuário não autenticado" }
 }

 const title = formData.get("title")?.toString()
 const description = formData.get("description")?.toString()
 const amount = formData.get("amount")?.toString()
 const type = formData.get("type")?.toString()
 const categoryId = formData.get("categoryId")?.toString()
 const date = formData.get("date")?.toString()

 if (!title || !amount || !type || !date) {
  return { error: "Título, valor, tipo e data são obrigatórios" }
 }

 if (type !== "income" && type !== "expense") {
  return { error: "Tipo deve ser 'income' ou 'expense'" }
 }

 const numericAmount = Number.parseFloat(amount)
 if (isNaN(numericAmount) || numericAmount <= 0) {
  return { error: "Valor deve ser um número positivo" }
 }

 try {
  const { error } = await supabase.from("transactions").insert({
   user_id: user.id,
   title,
   description: description || null,
   amount: numericAmount,
   type,
   category_id: categoryId || null,
   date,
  })

  if (error) {
   console.error("Error creating transaction:", error)
   return { error: "Erro ao criar transação" }
  }

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
  return { success: true }
 } catch (error) {
  console.error("Unexpected error:", error)
  return { error: "Erro inesperado ao criar transação" }
 }
}

export async function updateTransaction(transactionId: string, prevState: any, formData: FormData) {
 const cookieStore = cookies()
 const supabase = createServerActionClient({ cookies: () => cookieStore })

 // Get current user
 const {
  data: { user },
 } = await supabase.auth.getUser()

 if (!user) {
  return { error: "Usuário não autenticado" }
 }

 const title = formData.get("title")?.toString()
 const description = formData.get("description")?.toString()
 const amount = formData.get("amount")?.toString()
 const type = formData.get("type")?.toString()
 const categoryId = formData.get("categoryId")?.toString()
 const date = formData.get("date")?.toString()

 if (!title || !amount || !type || !date) {
  return { error: "Título, valor, tipo e data são obrigatórios" }
 }

 if (type !== "income" && type !== "expense") {
  return { error: "Tipo deve ser 'income' ou 'expense'" }
 }

 const numericAmount = Number.parseFloat(amount)
 if (isNaN(numericAmount) || numericAmount <= 0) {
  return { error: "Valor deve ser um número positivo" }
 }

 try {
  const { error } = await supabase
   .from("transactions")
   .update({
    title,
    description: description || null,
    amount: numericAmount,
    type,
    category_id: categoryId || null,
    date,
    updated_at: new Date().toISOString(),
   })
   .eq("id", transactionId)
   .eq("user_id", user.id)

  if (error) {
   console.error("Error updating transaction:", error)
   return { error: "Erro ao atualizar transação" }
  }

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
  return { success: true }
 } catch (error) {
  console.error("Unexpected error:", error)
  return { error: "Erro inesperado ao atualizar transação" }
 }
}

export async function deleteTransaction(transactionId: string) {
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
  const { error } = await supabase.from("transactions").delete().eq("id", transactionId).eq("user_id", user.id)

  if (error) {
   console.error("Error deleting transaction:", error)
   throw new Error("Erro ao deletar transação")
  }

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
 } catch (error) {
  console.error("Unexpected error:", error)
  throw new Error("Erro inesperado ao deletar transação")
 }
}
