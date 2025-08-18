import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import CategoryForm from "@/components/categories/category-form"
import { createCategory } from "@/lib/actions/categories"

export default async function NewCategoryPage() {
 if (!isSupabaseConfigured) {
  return (
   <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
    <div className="text-center">
     <h1 className="text-2xl font-bold mb-4 text-white">Conecte o Supabase para começar</h1>
     <p className="text-slate-400">Configure a integração do Supabase nas configurações do projeto.</p>
    </div>
   </div>
  )
 }

 const supabase = createClient()
 const {
  data: { user },
 } = await supabase.auth.getUser()

 if (!user) {
  redirect("/auth/login")
 }

 return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
   <DashboardHeader user={user} />

   <main className="container mx-auto px-4 py-8">
    <div className="max-w-2xl mx-auto">
     <div className="mb-8">
      <h1 className="text-3xl font-bold text-white">Nova Categoria</h1>
      <p className="text-slate-400 mt-2">Crie uma nova categoria para organizar suas transações</p>
     </div>

     <CategoryForm action={createCategory} title="Criar Nova Categoria" />
    </div>
   </main>
  </div>
 )
}
