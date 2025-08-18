import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import TransactionsList from "@/components/transactions/transactions-list"
import { getCategories } from "@/lib/supabase/queries"

export default async function TransactionsPage() {
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

 // Get transactions with categories
 const { data: transactions } = await supabase
  .from("transactions")
  .select(`
      *,
      category:categories(*)
    `)
  .eq("user_id", user.id)
  .order("date", { ascending: false })
  .order("created_at", { ascending: false })

 // Get categories for filters
 const categories = await getCategories(user.id)

 return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
   <DashboardHeader user={user} />

   <main className="container mx-auto px-4 py-8">
    <div className="flex items-center justify-between mb-8">
     <div>
      <h1 className="text-3xl font-bold text-white">Transações</h1>
      <p className="text-slate-400 mt-2">Gerencie todas as suas receitas e despesas</p>
     </div>
     <Link href="/transactions/new">
      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
       <Plus className="h-4 w-4 mr-2" />
       Nova Transação
      </Button>
     </Link>
    </div>

    <TransactionsList transactions={transactions || []} categories={categories} />
   </main>
  </div>
 )
}
