import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings/settings-form";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function SettingsPage() {
 const supabase = await createClient();

 const {
  data: { user },
  error,
 } = await supabase.auth.getUser();

 if (error || !user) {
  redirect("/auth/login");
 }

 const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

 return (
  <DashboardShell>
   <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
    <div className="space-y-6">
     <div>
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
      <p className="text-muted-foreground">
       Gerencie suas informações pessoais e preferências da conta.
      </p>
     </div>
     <SettingsForm profile={profile} />
    </div>
   </div>
  </DashboardShell>
 );
}