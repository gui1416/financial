"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, Calendar, DollarSign } from "lucide-react"

// Interface atualizada para incluir todos os campos necessários
interface Goal {
 id: string;
 title: string; // Campo adicionado
 target: number;
 current: number;
 deadline: string;
 type: "savings" | "expense";
}

// Função de busca atualizada para selecionar o 'title'
const fetchGoalsOverview = async (): Promise<Goal[]> => {
 const supabase = createClient()
 const { data: { user } } = await supabase.auth.getUser()
 if (!user) return []

 // Adicionado 'title' na query
 const { data, error } = await supabase
  .from("goals")
  .select("id, title, target, current, deadline, type")
  .eq("user_id", user.id)

 if (error) throw error
 return data || []
}

export function GoalsOverview() {
 const { data: goals = [], isLoading } = useQuery({
  queryKey: ['goals-overview'],
  queryFn: fetchGoalsOverview,
 })

 if (isLoading) {
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
   {Array.from({ length: 4 }).map((_, i) => <Card key={i}><CardHeader><div className="h-4 bg-muted rounded w-1/2" /></CardHeader><CardContent><div className="h-8 bg-muted rounded w-3/4" /></CardContent></Card>)}
  </div>
 }

 const totalGoals = goals.length
 const completedGoals = goals.filter((goal) =>
  goal.type === "savings" ? goal.current >= goal.target : goal.current <= goal.target,
 ).length

 const nextGoal = [...goals].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];
 const totalSavings = goals.filter(g => g.type === 'savings').reduce((acc, goal) => acc + goal.current, 0);

 return (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Total de Metas</CardTitle>
     <Target className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className="text-2xl font-bold">{totalGoals}</div>
     <p className="text-xs text-muted-foreground">metas ativas</p>
    </CardContent>
   </Card>

   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Metas Concluídas</CardTitle>
     <TrendingUp className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className="text-2xl font-bold">{completedGoals}</div>
     <p className="text-xs text-muted-foreground">de {totalGoals} metas</p>
    </CardContent>
   </Card>

   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Próximo Prazo</CardTitle>
     <Calendar className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className="text-2xl font-bold">
      {nextGoal ? new Date(nextGoal.deadline).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }) : '-'}
     </div>
     <p className="text-xs text-muted-foreground truncate">{nextGoal?.title || 'Nenhuma meta próxima'}</p>
    </CardContent>
   </Card>

   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Economia Total</CardTitle>
     <DollarSign className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className="text-2xl font-bold">{totalSavings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
     <p className="text-xs text-muted-foreground">em metas de economia</p>
    </CardContent>
   </Card>
  </div>
 )
}