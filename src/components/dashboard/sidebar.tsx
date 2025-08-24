"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
 LayoutDashboard,
 CreditCard,
 Tags,
 BarChart3,
 Settings,
 LogOut,
 Wallet,
 Target,
 HelpCircle,
} from "lucide-react"

const navigation = [
 {
  name: "Dashboard",
  href: "/dashboard",
  icon: LayoutDashboard,
 },
 {
  name: "Transações",
  href: "/dashboard/transactions",
  icon: CreditCard,
 },
 {
  name: "Categorias",
  href: "/dashboard/categories",
  icon: Tags,
 },
 {
  name: "Metas",
  href: "/dashboard/goals",
  icon: Target,
 },
 {
  name: "Relatórios",
  href: "/dashboard/analytics",
  icon: BarChart3,
 },
 {
  name: "Ajuda",
  href: "/dashboard/help",
  icon: HelpCircle,
 },
 {
  name: "Configurações",
  href: "/dashboard/settings",
  icon: Settings,
 },
]

export function Sidebar() {
 const pathname = usePathname()
 const router = useRouter()

 const handleSignOut = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  router.push("/auth/login")
 }

 return (
  <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
   <div className="flex h-16 items-center border-b border-sidebar-border px-6">
    <div className="flex items-center gap-2">
     <Wallet className="h-6 w-6 text-sidebar-primary" />
     <span className="text-lg font-semibold text-sidebar-foreground">FinanceApp</span>
    </div>
   </div>
   <nav className="flex-1 space-y-1 p-4">
    {navigation.map((item) => {
     const isActive = pathname === item.href
     return (
      <Link
       key={item.name}
       href={item.href}
       className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
         ? "bg-sidebar-accent text-sidebar-accent-foreground"
         : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
       )}
      >
       <item.icon className="h-4 w-4" />
       {item.name}
      </Link>
     )
    })}
   </nav>
   <div className="border-t border-sidebar-border p-4">
    <Button
     variant="ghost"
     className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
     onClick={handleSignOut}
    >
     <LogOut className="h-4 w-4" />
     Sair
    </Button>
   </div>
  </div>
 )
}
