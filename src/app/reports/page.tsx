import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import ReportsClient from "@/components/reports/reports-client"
import { getCategories } from "@/lib/supabase/queries"

export default async function ReportsPage() {
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

 const categories = await getCategories(user.id)

 return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
   <DashboardHeader user={user} />

   <main className="container mx-auto px-4 py-8">
    <div className="mb-8">
     <h1 className="text-3xl font-bold text-white">Relatórios Financeiros</h1>
     <p className="text-slate-400 mt-2">Gere relatórios detalhados das suas finanças</p>
    </div>

    <ReportsClient categories={categories} />
   </main>
  </div>
 )
}
