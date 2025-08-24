import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CategoriesGrid } from "@/components/categories/categories-grid"

export default async function CategoriesPage() {
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
     <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
    </div>
    <div className="space-y-4">
     <CategoriesGrid />
    </div>
   </div>
  </DashboardShell>
 )
}
