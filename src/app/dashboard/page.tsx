import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import FinancialCards from "@/components/dashboard/financial-cards"
import ExpenseChart from "@/components/dashboard/expense-chart"
import MonthlyChart from "@/components/dashboard/monthly-chart"
import TransactionsTable from "@/components/dashboard/transactions-table"
import { getFinancialSummary, getRecentTransactions, getMonthlyExpensesByCategory } from "@/lib/supabase/queries"

export default async function DashboardPage() {
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

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get financial data
  const [summary, recentTransactions, expensesByCategory] = await Promise.all([
    getFinancialSummary(user.id),
    getRecentTransactions(user.id, 5),
    getMonthlyExpensesByCategory(user.id),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard Financeiro</h1>
          <p className="text-slate-400 mt-2">Visão geral das suas finanças</p>
        </div>

        <div className="space-y-8">
          {/* Financial Summary Cards */}
          <FinancialCards summary={summary} />

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ExpenseChart data={expensesByCategory} />
            <MonthlyChart userId={user.id} />
          </div>

          {/* Recent Transactions */}
          <TransactionsTable transactions={recentTransactions} />
        </div>
      </main>
    </div>
  )
}
