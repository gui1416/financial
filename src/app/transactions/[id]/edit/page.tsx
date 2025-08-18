import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import TransactionForm from "@/components/transactions/transaction-form"
import { getCategories } from "@/lib/supabase/queries"
import { updateTransaction } from "@/lib/actions/transactions"

interface EditTransactionPageProps {
 params: {
  id: string
 }
}

export default async function EditTransactionPage({ params }: EditTransactionPageProps) {
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

 // Get the transaction
 const { data: transaction } = await supabase
  .from("transactions")
  .select(`
      *,
      category:categories(*)
    `)
  .eq("id", params.id)
  .eq("user_id", user.id)
  .single()

 if (!transaction) {
  notFound()
 }

 const categories = await getCategories(user.id)

 // Create a bound action with the transaction ID
 const boundUpdateAction = updateTransaction.bind(null, params.id)

 return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
   <DashboardHeader user={user} />

   <main className="container mx-auto px-4 py-8">
    <div className="max-w-2xl mx-auto">
     <div className="mb-8">
      <h1 className="text-3xl font-bold text-white">Editar Transação</h1>
      <p className="text-slate-400 mt-2">Atualize os dados da transação</p>
     </div>

     <TransactionForm
      categories={categories}
      transaction={transaction}
      action={boundUpdateAction}
      title="Editar Transação"
     />
    </div>
   </main>
  </div>
 )
}
