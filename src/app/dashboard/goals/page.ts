import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { GoalsOverview } from "@/components/goals/goals-overview"
import { GoalsList } from "@/components/goals/goals-list"

export default async function GoalsPage() {
 const supabase = createServerClient()

 const {
  data: { user },
  error,
 } = await supabase.auth.getUser()

 if (error || !user) {
  redirect("/auth/login")
 }

 return (
  <DashboardShell>
  <div className= "space-y-6" >
  <div>
  <h1 className="text-3xl font-bold tracking-tight" > Metas Financeiras </h1>
   < p className = "text-muted-foreground" > Defina e acompanhe suas metas de economia e gastos.</p>
    </div>

    < GoalsOverview />
    <GoalsList />
    </div>
    </DashboardShell>
  )
}
