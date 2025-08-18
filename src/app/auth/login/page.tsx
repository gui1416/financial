import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"

export default async function LoginPage() {
 // If Supabase is not configured, show setup message directly
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

 // Check if user is already logged in
 const supabase = createClient()
 const {
  data: { session },
 } = await supabase.auth.getSession()

 // If user is logged in, redirect to dashboard
 if (session) {
  redirect("/dashboard")
 }

 return (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-12 sm:px-6 lg:px-8">
   <LoginForm />
  </div>
 )
}
