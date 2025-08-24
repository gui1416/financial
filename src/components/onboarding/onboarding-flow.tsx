"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Wallet, Target, BarChart3, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"

const steps = [
 {
  id: 1,
  title: "Bem-vindo ao FinanceApp!",
  description: "Vamos configurar sua conta em alguns passos simples.",
  icon: Wallet,
  content: (
   <div className="space-y-4">
    <div className="text-center space-y-4">
     <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
      <Wallet className="h-8 w-8 text-primary" />
     </div>
     <div>
      <h3 className="text-xl font-semibold">Controle suas finanças com facilidade</h3>
      <p className="text-muted-foreground mt-2">
       O FinanceApp ajuda você a gerenciar receitas, despesas e metas financeiras de forma simples e intuitiva.
      </p>
     </div>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
     <div className="text-center space-y-2">
      <CreditCard className="h-8 w-8 mx-auto text-blue-500" />
      <h4 className="font-medium">Transações</h4>
      <p className="text-sm text-muted-foreground">Registre receitas e despesas facilmente</p>
     </div>
     <div className="text-center space-y-2">
      <Target className="h-8 w-8 mx-auto text-green-500" />
      <h4 className="font-medium">Metas</h4>
      <p className="text-sm text-muted-foreground">Defina e acompanhe objetivos financeiros</p>
     </div>
     <div className="text-center space-y-2">
      <BarChart3 className="h-8 w-8 mx-auto text-purple-500" />
      <h4 className="font-medium">Relatórios</h4>
      <p className="text-sm text-muted-foreground">Analise seus hábitos financeiros</p>
     </div>
    </div>
   </div>
  ),
 },
 {
  id: 2,
  title: "Categorias Padrão",
  description: "Suas categorias foram criadas automaticamente.",
  icon: CheckCircle,
  content: (
   <div className="space-y-4">
    <p className="text-muted-foreground">
     Criamos algumas categorias padrão para você começar. Você pode personalizá-las ou criar novas a qualquer
     momento.
    </p>

    <div className="space-y-4">
     <div>
      <h4 className="font-medium text-green-600 mb-2">Categorias de Receita</h4>
      <div className="flex flex-wrap gap-2">
       <Badge variant="outline" className="bg-green-50">
        Salário
       </Badge>
       <Badge variant="outline" className="bg-green-50">
        Freelance
       </Badge>
       <Badge variant="outline" className="bg-green-50">
        Investimentos
       </Badge>
       <Badge variant="outline" className="bg-green-50">
        Outros
       </Badge>
      </div>
     </div>

     <div>
      <h4 className="font-medium text-red-600 mb-2">Categorias de Despesa</h4>
      <div className="flex flex-wrap gap-2">
       <Badge variant="outline" className="bg-red-50">
        Alimentação
       </Badge>
       <Badge variant="outline" className="bg-red-50">
        Transporte
       </Badge>
       <Badge variant="outline" className="bg-red-50">
        Moradia
       </Badge>
       <Badge variant="outline" className="bg-red-50">
        Saúde
       </Badge>
       <Badge variant="outline" className="bg-red-50">
        Educação
       </Badge>
       <Badge variant="outline" className="bg-red-50">
        Lazer
       </Badge>
      </div>
     </div>
    </div>
   </div>
  ),
 },
 {
  id: 3,
  title: "Próximos Passos",
  description: "Agora você está pronto para começar!",
  icon: Target,
  content: (
   <div className="space-y-4">
    <p className="text-muted-foreground">Aqui estão algumas sugestões para você começar a usar o FinanceApp:</p>

    <div className="space-y-3">
     <div className="flex items-start gap-3 p-3 rounded-lg border">
      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
       1
      </div>
      <div>
       <h4 className="font-medium">Adicione sua primeira transação</h4>
       <p className="text-sm text-muted-foreground">Registre uma receita ou despesa recente</p>
      </div>
     </div>

     <div className="flex items-start gap-3 p-3 rounded-lg border">
      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
       2
      </div>
      <div>
       <h4 className="font-medium">Configure suas metas</h4>
       <p className="text-sm text-muted-foreground">Defina objetivos de economia ou redução de gastos</p>
      </div>
     </div>

     <div className="flex items-start gap-3 p-3 rounded-lg border">
      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
       3
      </div>
      <div>
       <h4 className="font-medium">Explore os relatórios</h4>
       <p className="text-sm text-muted-foreground">Analise seus dados conforme adiciona transações</p>
      </div>
     </div>
    </div>
   </div>
  ),
 },
]

export function OnboardingFlow() {
 const [currentStep, setCurrentStep] = useState(1)
 const router = useRouter()

 const handleNext = () => {
  if (currentStep < steps.length) {
   setCurrentStep(currentStep + 1)
  } else {
   router.push("/dashboard")
  }
 }

 const handlePrevious = () => {
  if (currentStep > 1) {
   setCurrentStep(currentStep - 1)
  }
 }

 const handleSkip = () => {
  router.push("/dashboard")
 }

 const currentStepData = steps.find((step) => step.id === currentStep)!
 const progress = (currentStep / steps.length) * 100

 return (
  <div className="max-w-2xl mx-auto p-6 space-y-6">
   {/* Progress */}
   <div className="space-y-2">
    <div className="flex justify-between text-sm">
     <span>
      Passo {currentStep} de {steps.length}
     </span>
     <span>{Math.round(progress)}% completo</span>
    </div>
    <Progress value={progress} className="h-2" />
   </div>

   {/* Step Indicators */}
   <div className="flex justify-center space-x-4">
    {steps.map((step) => (
     <div key={step.id} className="flex items-center">
      {step.id <= currentStep ? (
       <CheckCircle className="h-6 w-6 text-primary" />
      ) : (
       <Circle className="h-6 w-6 text-muted-foreground" />
      )}
     </div>
    ))}
   </div>

   {/* Content */}
   <Card>
    <CardHeader className="text-center">
     <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
      <currentStepData.icon className="h-6 w-6 text-primary" />
     </div>
     <CardTitle>{currentStepData.title}</CardTitle>
     <CardDescription>{currentStepData.description}</CardDescription>
    </CardHeader>
    <CardContent>{currentStepData.content}</CardContent>
   </Card>

   {/* Navigation */}
   <div className="flex justify-between">
    <div className="flex gap-2">
     {currentStep > 1 && (
      <Button variant="outline" onClick={handlePrevious}>
       <ArrowLeft className="mr-2 h-4 w-4" />
       Anterior
      </Button>
     )}
     <Button variant="ghost" onClick={handleSkip}>
      Pular Tutorial
     </Button>
    </div>

    <Button onClick={handleNext}>
     {currentStep === steps.length ? "Começar" : "Próximo"}
     {currentStep < steps.length && <ArrowRight className="ml-2 h-4 w-4" />}
    </Button>
   </div>
  </div>
 )
}
