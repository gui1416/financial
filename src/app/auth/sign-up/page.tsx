"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SignUpPage() {
 const [email, setEmail] = useState("")
 const [password, setPassword] = useState("")
 const [fullName, setFullName] = useState("")
 const [repeatPassword, setRepeatPassword] = useState("")
 const [error, setError] = useState<string | null>(null)
 const [isLoading, setIsLoading] = useState(false)
 const router = useRouter()

 const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault()
  const supabase = createClient()
  setIsLoading(true)
  setError(null)

  if (password !== repeatPassword) {
   const errorMessage = "As senhas não coincidem"
   setError(errorMessage)
   toast.error("Erro na validação", {
    description: errorMessage,
   })
   setIsLoading(false)
   return
  }

  if (password.length < 6) {
   const errorMessage = "A senha deve ter pelo menos 6 caracteres"
   setError(errorMessage)
   toast.error("Erro na validação", {
    description: errorMessage,
   })
   setIsLoading(false)
   return
  }

  try {
   const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
     emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
     data: {
      full_name: fullName,
     },
    },
   })
   if (error) throw error

   toast.success("Conta criada com sucesso!", {
    description: "Verifique seu email para confirmar a conta.",
   })

   router.push("/auth/sign-up-success")
  } catch (error: unknown) {
   const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro"
   setError(errorMessage)

   toast.error("Erro ao criar conta", {
    description: errorMessage,
   })
  } finally {
   setIsLoading(false)
  }
 }

 return (
  <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
   <div className="absolute top-4 right-4">
    <ThemeToggle />
   </div>

   <div className="w-full max-w-sm">
    <div className="flex flex-col gap-6">
     <div className="text-center">
      <h1 className="text-2xl font-bold text-foreground">FinanceApp</h1>
      <p className="text-muted-foreground">Gerencie seus gastos pessoais</p>
     </div>
     <Card>
      <CardHeader>
       <CardTitle className="text-2xl">Criar conta</CardTitle>
       <CardDescription>Preencha os dados para criar sua conta</CardDescription>
      </CardHeader>
      <CardContent>
       <form onSubmit={handleSignUp}>
        <div className="flex flex-col gap-6">
         <div className="grid gap-2">
          <Label htmlFor="fullName">Nome completo</Label>
          <Input
           id="fullName"
           type="text"
           placeholder="Seu nome completo"
           required
           value={fullName}
           onChange={(e) => setFullName(e.target.value)}
          />
         </div>
         <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
           id="email"
           type="email"
           placeholder="seu@email.com"
           required
           value={email}
           onChange={(e) => setEmail(e.target.value)}
          />
         </div>
         <div className="grid gap-2">
          <Label htmlFor="password">Senha</Label>
          <Input
           id="password"
           type="password"
           required
           value={password}
           onChange={(e) => setPassword(e.target.value)}
          />
         </div>
         <div className="grid gap-2">
          <Label htmlFor="repeat-password">Confirmar senha</Label>
          <Input
           id="repeat-password"
           type="password"
           required
           value={repeatPassword}
           onChange={(e) => setRepeatPassword(e.target.value)}
          />
         </div>
         {error && <p className="text-sm text-destructive">{error}</p>}
         <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Criando conta..." : "Criar conta"}
         </Button>
        </div>
        <div className="mt-4 text-center text-sm">
         Já tem uma conta?{" "}
         <Link href="/auth/login" className="underline underline-offset-4">
          Entrar
         </Link>
        </div>
       </form>
      </CardContent>
     </Card>
    </div>
   </div>
  </div>
 )
}
