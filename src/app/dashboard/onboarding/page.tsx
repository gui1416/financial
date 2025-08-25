import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"

export default async function OnboardingPage() {
 const supabase = await createClient()

 const {
  data: { user },
  error,
 } = await supabase.auth.getUser()

 if (error || !user) {
  redirect("/auth/login")
 }

 const { data: transactions } = await supabase.from("transactions").select("id").eq("user_id", user.id).limit(1)

 if (transactions && transactions.length > 0) {
  redirect("/dashboard")
 }

 return (
  <DashboardShell>
   <OnboardingFlow />
  </DashboardShell>
 )
}