import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"

export default async function OnboardingPage() {
 const supabase = createServerClient()

 const {
  data: { user },
  error,
 } = await supabase.auth.getUser()

 if (error || !user) {
  redirect("/auth/login")
 }

 // Check if user has any transactions (to determine if they need onboarding)
 const { data: transactions } = await supabase.from("transactions").select("id").eq("user_id", user.id).limit(1)

 // If user already has transactions, redirect to dashboard
 if (transactions && transactions.length > 0) {
  redirect("/dashboard")
 }

 return (
  <DashboardShell>
   <OnboardingFlow />
  </DashboardShell>
 )
}
