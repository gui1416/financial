"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, TrendingUp, TrendingDown, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { GoalDialog } from "./goal-dialog"
import { DeleteGoalDialog } from "./delete-goal-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface Goal {
  id: string;
  title: string;
  description: string | null;
  target: number;
  current: number;
  deadline: string;
  type: "savings" | "expense";
  categories: {
    name: string;
  }[] | null;
}

const fetchGoals = async (): Promise<Goal[]> => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Usuário não autenticado")

  const { data, error } = await supabase
    .from("goals")
    .select(`
            id, title, description, target, current, deadline, type,
            categories (name)
        `)
    .eq("user_id", user.id)
    .order("deadline", { ascending: true })

  if (error) throw error
  return data as Goal[]
}

export function GoalsList() {
  const queryClient = useQueryClient()
  const [showDialog, setShowDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: fetchGoals,
  })

  const deleteMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const supabase = createClient()
      const { error } = await supabase.from("goals").delete().eq("id", goalId)
      if (error) throw error
    },
    onSuccess: () => {
      toast.success("Meta excluída com sucesso!")
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['goals-overview'] })
      setShowDeleteDialog(false)
    },
    onError: (error) => {
      toast.error("Erro ao excluir meta", { description: error.message })
    },
  })

  const getProgress = (goal: Goal) => {
    if (goal.target === 0) return 0;
    if (goal.type === "savings") {
      return Math.min((goal.current / goal.target) * 100, 100)
    } else {
      return Math.max(100 - (goal.current / goal.target) * 100, 0)
    }
  }

  const getStatus = (goal: Goal) => {
    const progress = getProgress(goal)
    if (progress >= 100) return "completed"
    if (progress >= 75) return "on-track"
    if (progress >= 50) return "warning"
    return "behind"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white"
      case "on-track":
        return "bg-blue-500 text-white"
      case "warning":
        return "bg-yellow-500 text-white"
      case "behind":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
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
        <Button onClick={() => {
          setSelectedGoal(null)
          setShowDialog(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Meta
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Carregando metas...</div>
      ) : goals.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Nenhuma meta criada ainda.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progress = getProgress(goal)
            const status = getStatus(goal)
            const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            // CORREÇÃO: Pega o nome da categoria do primeiro item do array
            const categoryName = goal.categories && goal.categories.length > 0 ? goal.categories[0].name : 'Geral'


            return (
              <Card key={goal.id} className="relative group">
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
                    <div className="flex items-center">
                      <Badge variant="secondary" className={getStatusColor(status)}>
                        {getStatusText(status)}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-6 w-6 p-0 ml-1 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedGoal(goal); setShowDialog(true); }}>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedGoal(goal); setShowDeleteDialog(true); }} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
                      <span>{daysLeft >= 0 ? `${daysLeft} dias restantes` : "Vencida"}</span>
                    </div>
                    <Badge variant="outline">{categoryName}</Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <GoalDialog open={showDialog} onOpenChange={setShowDialog} goal={selectedGoal} />
      <DeleteGoalDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        goal={selectedGoal}
        onDeleted={() => selectedGoal?.id && deleteMutation.mutate(selectedGoal.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}