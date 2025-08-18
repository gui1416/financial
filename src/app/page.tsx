import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, BarChart3, Shield, Zap } from "lucide-react"

export default async function Home() {
  // If Supabase is not configured, show setup message
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
    data: { user },
  } = await supabase.auth.getUser()

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-emerald-500" />
            <span className="text-xl font-bold text-white">FinanceFlow</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white hover:text-emerald-400">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Começar Grátis</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Controle suas
            <span className="text-emerald-400"> finanças </span>
            com inteligência
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Gerencie receitas, despesas e orçamentos de forma simples e eficiente. Tenha insights completos sobre sua
            saúde financeira.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-800 px-8 py-4 text-lg bg-transparent"
              >
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6 rounded-lg bg-slate-800/50 backdrop-blur">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Dashboard Intuitivo</h3>
            <p className="text-slate-400">
              Visualize suas finanças com gráficos e relatórios detalhados em tempo real.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-slate-800/50 backdrop-blur">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Segurança Total</h3>
            <p className="text-slate-400">Seus dados financeiros protegidos com criptografia de ponta a ponta.</p>
          </div>

          <div className="text-center p-6 rounded-lg bg-slate-800/50 backdrop-blur">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Automação Inteligente</h3>
            <p className="text-slate-400">Categorização automática e alertas personalizados para seus gastos.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
