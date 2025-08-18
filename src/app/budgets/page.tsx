import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import BudgetsList from "@/components/budgets/budgets-list"

export default async function BudgetsPage() {
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

 // Get budgets with categories and calculate spent amounts
 const { data: budgets } = await supabase
  .from("budgets")
  .select(`
      *,
      category:categories(*)
    `)
  .eq("user_id", user.id)
  .order("created_at", { ascending: false })

 // Calculate spent amounts for each budget
 const budgetsWithSpent = await Promise.all(
  (budgets || []).map(async (budget) => {
   let query = supabase
    .from("transactions")
    .select("amount")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .gte("date", budget.start_date)
    .lte("date", budget.end_date)

   // If budget has a specific category, filter by it
   if (budget.category_id) {
    query = query.eq("category_id", budget.category_id)
   }

   const { data: transactions } = await query

   const spent = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

   return {
    ...budget,
    spent,
   }
  }),
 )

 return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
   <DashboardHeader user={user} />

   <main className="container mx-auto px-4 py-8">
    <div className="flex items-center justify-between mb-8">
     <div>
      <h1 className="text-3xl font-bold text-white">Orçamentos</h1>
      <p className="text-slate-400 mt-2">Controle seus gastos com limites personalizados</p>
     </div>
     <Link href="/budgets/new">
      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
       <Plus className="h-4 w-4 mr-2" />
       Novo Orçamento
      </Button>
     </Link>
    </div>

    <BudgetsList budgets={budgetsWithSpent} />
   </main>
  </div>
 )
}
