import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AnalyticsFilters } from "@/components/analytics/analytics-filters"
import { AnalyticsOverview } from "@/components/analytics/analytics-overview"
import { CategoryDistribution } from "@/components/analytics/category-distribution"
import { MonthlyComparison } from "@/components/analytics/monthly-comparison"
import { TrendAnalysis } from "@/components/analytics/trend-analysis"

export default async function AnalyticsPage() {
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
     <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
    </div>
    <div className="space-y-4">
     <AnalyticsFilters />
     <AnalyticsOverview />
     <div className="grid gap-4 md:grid-cols-2">
      <CategoryDistribution />
      <MonthlyComparison />
     </div>
     <TrendAnalysis />
    </div>
   </div>
  </DashboardShell>
 )
}
