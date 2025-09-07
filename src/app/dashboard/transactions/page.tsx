import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TransactionsTable } from "@/components/transactions/transactions-table"

export default async function TransactionsPage() {
 const supabase = await createClient()
 const {
  data: { user },
  error,
 } = await supabase.auth.getUser()

 if (error || !user) {
  redirect("/auth/login")
 }

 return (
  <>
   <DashboardHeader />
   <div className="space-y-4">
    <div className="flex items-center justify-between space-y-2">
     <div>
      <h2 className="text-3xl font-bold tracking-tight">Transações</h2>
      <p className="text-muted-foreground">
       Gerencie suas receitas e despesas.
      </p>
     </div>
    </div>
    <TransactionsTable />
   </div>
  </>
 )
}