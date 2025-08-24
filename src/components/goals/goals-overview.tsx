"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, Calendar, DollarSign } from "lucide-react"

export function GoalsOverview() {
 // Mock data - em produção, buscar do banco de dados
 const goals = [
  {
   id: 1,
   title: "Reserva de Emergência",
   target: 10000,
   current: 6500,
   deadline: "2024-12-31",
   type: "savings",
  },
  {
   id: 2,
   title: "Reduzir Gastos com Alimentação",
   target: 800,
   current: 950,
   deadline: "2024-03-31",
   type: "expense",
  },
 ]

 const totalGoals = goals.length
 const completedGoals = goals.filter((goal) =>
  goal.type === "savings" ? goal.current >= goal.target : goal.current <= goal.target,
 ).length

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
     <div className="text-2xl font-bold">Mar 31</div>
     <p className="text-xs text-muted-foreground">Reduzir gastos alimentação</p>
    </CardContent>
   </Card>

   <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
     <CardTitle className="text-sm font-medium">Economia Total</CardTitle>
     <DollarSign className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
     <div className="text-2xl font-bold">R$ 6.500</div>
     <p className="text-xs text-muted-foreground">+12% este mês</p>
    </CardContent>
   </Card>
  </div>
 )
}
