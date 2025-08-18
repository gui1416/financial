import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import BudgetForm from "@/components/budgets/budget-form"
import { getCategories } from "@/lib/supabase/queries"
import { updateBudget } from "@/lib/actions/budgets"

interface EditBudgetPageProps {
 params: {
  id: string
 }
}

export default async function EditBudgetPage({ params }: EditBudgetPageProps) {
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

 // Get the budget
 const { data: budget } = await supabase
  .from("budgets")
  .select(`
      *,
      category:categories(*)
    `)
  .eq("id", params.id)
  .eq("user_id", user.id)
  .single()

 if (!budget) {
  notFound()
 }

 const categories = await getCategories(user.id)

 // Create a bound action with the budget ID
 const boundUpdateAction = updateBudget.bind(null, params.id)

 return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
   <DashboardHeader user={user} />

   <main className="container mx-auto px-4 py-8">
    <div className="max-w-2xl mx-auto">
     <div className="mb-8">
      <h1 className="text-3xl font-bold text-white">Editar Orçamento</h1>
      <p className="text-slate-400 mt-2">Atualize os dados do orçamento</p>
     </div>

     <BudgetForm categories={categories} budget={budget} action={boundUpdateAction} title="Editar Orçamento" />
    </div>
   </main>
  </div>
 )
}
