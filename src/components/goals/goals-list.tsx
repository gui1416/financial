"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, TrendingUp, TrendingDown } from "lucide-react"
import { GoalDialog } from "./goal-dialog"

export function GoalsList() {
  const [showDialog, setShowDialog] = useState(false)

  // Mock data - em produção, buscar do banco de dados
  const goals = [
    {
      id: 1,
      title: "Reserva de Emergência",
      description: "Juntar dinheiro para emergências",
      target: 10000,
      current: 6500,
      deadline: "2024-12-31",
      type: "savings" as const,
      category: "Poupança",
    },
    {
      id: 2,
      title: "Reduzir Gastos com Alimentação",
      description: "Diminuir gastos mensais com comida",
      target: 800,
      current: 950,
      deadline: "2024-03-31",
      type: "expense" as const,
      category: "Alimentação",
    },
    {
      id: 3,
      title: "Viagem de Férias",
      description: "Economizar para viagem no final do ano",
      target: 5000,
      current: 2300,
      deadline: "2024-11-30",
      type: "savings" as const,
      category: "Lazer",
    },
  ]

  const getProgress = (goal: (typeof goals)[0]) => {
    if (goal.type === "savings") {
      return Math.min((goal.current / goal.target) * 100, 100)
    } else {
      return Math.max(100 - (goal.current / goal.target) * 100, 0)
    }
  }

  const getStatus = (goal: (typeof goals)[0]) => {
    const progress = getProgress(goal)
    if (progress >= 100) return "completed"
    if (progress >= 75) return "on-track"
    if (progress >= 50) return "warning"
    return "behind"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "on-track":
        return "bg-blue-500"
      case "warning":
        return "bg-yellow-500"
      case "behind":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluída"
      case "on-track":
        return "No Prazo"
      case "warning":
        return "Atenção"
      case "behind":
        return "Atrasada"
      default:
        return "Indefinido"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Suas Metas</h2>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Meta
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const progress = getProgress(goal)
          const status = getStatus(goal)
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

          return (
            <Card key={goal.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {goal.type === "savings" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <CardTitle className="text-base">{goal.title}</CardTitle>
                  </div>
                  <Badge variant="secondary" className={getStatusColor(status)}>
                    {getStatusText(status)}
                  </Badge>
                </div>
                <CardDescription>{goal.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Atual</p>
                    <p className="font-medium">R$ {goal.current.toLocaleString("pt-BR")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Meta</p>
                    <p className="font-medium">R$ {goal.target.toLocaleString("pt-BR")}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{daysLeft > 0 ? `${daysLeft} dias` : "Vencida"}</span>
                  </div>
                  <Badge variant="outline">{goal.category}</Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <GoalDialog open={showDialog} onOpenChange={setShowDialog} />
    </div>
  )
}
