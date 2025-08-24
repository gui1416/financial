import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { TransactionsChart } from "@/components/dashboard/transactions-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"

export default async function DashboardPage() {
 const supabase = await createClient()
 const {
  data: { user },
  error,
 } = await supabase.auth.getUser()

 if (error || !user) {
  redirect("/auth/login")
 }

 return (
  <DashboardShell>
   <DashboardHeader />
   <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
    <div className="flex items-center justify-between space-y-2">
     <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
    </div>
    <div className="space-y-4">
     <MetricsCards />
     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <div className="col-span-4">
       <TransactionsChart />
      </div>
      <div className="col-span-3">
       <RecentTransactions />
      </div>
     </div>
    </div>
   </div>
  </DashboardShell>
 )
}
