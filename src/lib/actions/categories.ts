"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createCategory(prevState: any, formData: FormData) {
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
 const color = formData.get("color")?.toString()
 const icon = formData.get("icon")?.toString()

 if (!name) {
  return { error: "Nome da categoria é obrigatório" }
 }

 if (!color) {
  return { error: "Cor da categoria é obrigatória" }
 }

 try {
  // Check if category name already exists for this user
  const { data: existingCategory } = await supabase
   .from("categories")
   .select("id")
   .eq("user_id", user.id)
   .eq("name", name)
   .single()

  if (existingCategory) {
   return { error: "Já existe uma categoria com este nome" }
  }

  const { error } = await supabase.from("categories").insert({
   user_id: user.id,
   name,
   color,
   icon: icon || "folder",
  })

  if (error) {
   console.error("Error creating category:", error)
   return { error: "Erro ao criar categoria" }
  }

  revalidatePath("/categories")
  revalidatePath("/transactions")
  return { success: true }
 } catch (error) {
  console.error("Unexpected error:", error)
  return { error: "Erro inesperado ao criar categoria" }
 }
}

export async function updateCategory(categoryId: string, prevState: any, formData: FormData) {
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
 const color = formData.get("color")?.toString()
 const icon = formData.get("icon")?.toString()

 if (!name) {
  return { error: "Nome da categoria é obrigatório" }
 }

 if (!color) {
  return { error: "Cor da categoria é obrigatória" }
 }

 try {
  // Check if category name already exists for this user (excluding current category)
  const { data: existingCategory } = await supabase
   .from("categories")
   .select("id")
   .eq("user_id", user.id)
   .eq("name", name)
   .neq("id", categoryId)
   .single()

  if (existingCategory) {
   return { error: "Já existe uma categoria com este nome" }
  }

  const { error } = await supabase
   .from("categories")
   .update({
    name,
    color,
    icon: icon || "folder",
    updated_at: new Date().toISOString(),
   })
   .eq("id", categoryId)
   .eq("user_id", user.id)

  if (error) {
   console.error("Error updating category:", error)
   return { error: "Erro ao atualizar categoria" }
  }

  revalidatePath("/categories")
  revalidatePath("/transactions")
  return { success: true }
 } catch (error) {
  console.error("Unexpected error:", error)
  return { error: "Erro inesperado ao atualizar categoria" }
 }
}

export async function deleteCategory(categoryId: string) {
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
  // Check if category has transactions
  const { data: transactions } = await supabase
   .from("transactions")
   .select("id")
   .eq("category_id", categoryId)
   .eq("user_id", user.id)
   .limit(1)

  if (transactions && transactions.length > 0) {
   throw new Error("Não é possível excluir categoria que possui transações")
  }

  const { error } = await supabase.from("categories").delete().eq("id", categoryId).eq("user_id", user.id)

  if (error) {
   console.error("Error deleting category:", error)
   throw new Error("Erro ao deletar categoria")
  }

  revalidatePath("/categories")
  revalidatePath("/transactions")
 } catch (error) {
  console.error("Unexpected error:", error)
  throw error
 }
}
