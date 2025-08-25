"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/theme-toggle"
import { useForm, ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
 fullName: z.string().min(3, { message: "O nome completo é obrigatório." }),
 email: z.string().email({ message: "Por favor, insira um email válido." }),
 password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
 repeatPassword: z.string()
}).refine(data => data.password === data.repeatPassword, {
 message: "As senhas não coincidem",
 path: ["repeatPassword"],
});

type SignUpFormValues = z.infer<typeof formSchema>;

export default function SignUpPage() {
 const router = useRouter()
 const form = useForm<SignUpFormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
   fullName: "",
   email: "",
   password: "",
   repeatPassword: ""
  }
 });

 const { formState: { isSubmitting } } = form;

 const handleSignUp = async (values: SignUpFormValues) => {
  const supabase = createClient()

  try {
   const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
     emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
     data: {
      full_name: values.fullName,
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
   toast.error("Erro ao criar conta", {
    description: errorMessage,
   })
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
       <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignUp)}>
         <div className="flex flex-col gap-4">
          <FormField
           control={form.control}
           name="fullName"
           render={({ field }: { field: ControllerRenderProps<SignUpFormValues, "fullName"> }) => (
            <FormItem>
             <FormLabel>Nome completo</FormLabel>
             <FormControl>
              <Input placeholder="Seu nome completo" {...field} />
             </FormControl>
             <FormMessage />
            </FormItem>
           )}
          />
          <FormField
           control={form.control}
           name="email"
           render={({ field }: { field: ControllerRenderProps<SignUpFormValues, "email"> }) => (
            <FormItem>
             <FormLabel>Email</FormLabel>
             <FormControl>
              <Input type="email" placeholder="seu@email.com" {...field} />
             </FormControl>
             <FormMessage />
            </FormItem>
           )}
          />
          <FormField
           control={form.control}
           name="password"
           render={({ field }: { field: ControllerRenderProps<SignUpFormValues, "password"> }) => (
            <FormItem>
             <FormLabel>Senha</FormLabel>
             <FormControl>
              <Input type="password" {...field} />
             </FormControl>
             <FormMessage />
            </FormItem>
           )}
          />
          <FormField
           control={form.control}
           name="repeatPassword"
           render={({ field }: { field: ControllerRenderProps<SignUpFormValues, "repeatPassword"> }) => (
            <FormItem>
             <FormLabel>Confirmar senha</FormLabel>
             <FormControl>
              <Input type="password" {...field} />
             </FormControl>
             <FormMessage />
            </FormItem>
           )}
          />

          <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
           {isSubmitting ? "Criando conta..." : "Criar conta"}
          </Button>
         </div>
         <div className="mt-4 text-center text-sm">
          Já tem uma conta?{" "}
          <Link href="/auth/login" className="underline underline-offset-4">
           Entrar
          </Link>
         </div>
        </form>
       </Form>
      </CardContent>
     </Card>
    </div>
   </div>
  </div>
 )
}