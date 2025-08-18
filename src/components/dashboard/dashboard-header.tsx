import { Button } from "@/components/ui/button"
import { BarChart3, LogOut, Plus, Settings } from "lucide-react"
import { signOut } from "@/lib/actions"
import Link from "next/link"

interface DashboardHeaderProps {
 user: {
  email?: string
  user_metadata?: {
   full_name?: string
  }
 }
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
 const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuário"

 return (
  <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
   <div className="container mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
     <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
       <BarChart3 className="h-8 w-8 text-emerald-500" />
       <span className="text-xl font-bold text-white">FinanceFlow</span>
      </div>
      <nav className="hidden md:flex items-center space-x-6">
       <Link href="/dashboard" className="text-emerald-400 font-medium">
        Dashboard
       </Link>
       <Link href="/transactions" className="text-slate-400 hover:text-white transition-colors">
        Transações
       </Link>
       <Link href="/categories" className="text-slate-400 hover:text-white transition-colors">
        Categorias
       </Link>
       <Link href="/budgets" className="text-slate-400 hover:text-white transition-colors">
        Orçamentos
       </Link>
       <Link href="/reports" className="text-slate-400 hover:text-white transition-colors">
        Relatórios
       </Link>
      </nav>
     </div>

     <div className="flex items-center space-x-4">
      <Link href="/transactions/new">
       <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
        <Plus className="h-4 w-4 mr-2" />
        Nova Transação
       </Button>
      </Link>

      <div className="flex items-center space-x-2">
       <span className="text-sm text-slate-400">Olá, {displayName}</span>
       <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
        <Settings className="h-4 w-4" />
       </Button>
       <form action={signOut}>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
         <LogOut className="h-4 w-4" />
        </Button>
       </form>
      </div>
     </div>
    </div>
   </div>
  </header>
 )
}
