"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { createBrowserClient } from "@/lib/supabase/client"
import { Loader2, User, Shield, Trash2 } from "lucide-react"
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
 AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SettingsFormProps {
 profile: {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
 } | null
}

export function SettingsForm({ profile }: SettingsFormProps) {
 const [loading, setLoading] = useState(false)
 const [deleteLoading, setDeleteLoading] = useState(false)
 const [fullName, setFullName] = useState(profile?.full_name || "")
 const { toast } = useToast()
 const supabase = createBrowserClient()

 const handleUpdateProfile = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  try {
   const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", profile?.id)

   if (error) throw error

   toast({
    title: "Perfil atualizado",
    description: "Suas informações foram salvas com sucesso.",
   })
  } catch (error) {
   toast({
    title: "Erro ao atualizar",
    description: "Não foi possível salvar as alterações.",
    variant: "destructive",
   })
  } finally {
   setLoading(false)
  }
 }

 const handleDeleteAccount = async () => {
  setDeleteLoading(true)

  try {
   // Primeiro deletar todas as transações do usuário
   await supabase.from("transactions").delete().eq("user_id", profile?.id)

   // Depois deletar todas as categorias do usuário
   await supabase.from("categories").delete().eq("user_id", profile?.id)

   // Por fim, deletar o usuário (o perfil será deletado automaticamente via CASCADE)
   const { error } = await supabase.auth.admin.deleteUser(profile?.id || "")

   if (error) throw error

   toast({
    title: "Conta excluída",
    description: "Sua conta foi excluída permanentemente.",
   })

   // Redirecionar para página inicial
   window.location.href = "/"
  } catch (error) {
   toast({
    title: "Erro ao excluir conta",
    description: "Não foi possível excluir sua conta. Tente novamente.",
    variant: "destructive",
   })
  } finally {
   setDeleteLoading(false)
  }
 }

 return (
  <div className="space-y-6">
   {/* Informações Pessoais */}
   <Card>
    <CardHeader>
     <CardTitle className="flex items-center gap-2">
      <User className="h-5 w-5" />
      Informações Pessoais
     </CardTitle>
     <CardDescription>Atualize suas informações pessoais aqui.</CardDescription>
    </CardHeader>
    <CardContent>
     <form onSubmit={handleUpdateProfile} className="space-y-4">
      <div className="space-y-2">
       <Label htmlFor="email">Email</Label>
       <Input id="email" type="email" value={profile?.email || ""} disabled className="bg-muted" />
       <p className="text-sm text-muted-foreground">O email não pode ser alterado.</p>
      </div>

      <div className="space-y-2">
       <Label htmlFor="fullName">Nome Completo</Label>
       <Input
        id="fullName"
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Digite seu nome completo"
       />
      </div>

      <Button type="submit" disabled={loading}>
       {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
       Salvar Alterações
      </Button>
     </form>
    </CardContent>
   </Card>

   {/* Segurança */}
   <Card>
    <CardHeader>
     <CardTitle className="flex items-center gap-2">
      <Shield className="h-5 w-5" />
      Segurança
     </CardTitle>
     <CardDescription>Gerencie a segurança da sua conta.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
     <div className="flex items-center justify-between">
      <div>
       <p className="font-medium">Alterar Senha</p>
       <p className="text-sm text-muted-foreground">Atualize sua senha para manter sua conta segura.</p>
      </div>
      <Button
       variant="outline"
       onClick={() => {
        // Implementar mudança de senha via Supabase
        toast({
         title: "Em desenvolvimento",
         description: "Esta funcionalidade será implementada em breve.",
        })
       }}
      >
       Alterar Senha
      </Button>
     </div>
    </CardContent>
   </Card>

   {/* Zona de Perigo */}
   <Card className="border-destructive">
    <CardHeader>
     <CardTitle className="flex items-center gap-2 text-destructive">
      <Trash2 className="h-5 w-5" />
      Zona de Perigo
     </CardTitle>
     <CardDescription>Ações irreversíveis para sua conta.</CardDescription>
    </CardHeader>
    <CardContent>
     <div className="flex items-center justify-between">
      <div>
       <p className="font-medium">Excluir Conta</p>
       <p className="text-sm text-muted-foreground">
        Exclua permanentemente sua conta e todos os dados associados.
       </p>
      </div>

      <AlertDialog>
       <AlertDialogTrigger asChild>
        <Button variant="destructive">Excluir Conta</Button>
       </AlertDialogTrigger>
       <AlertDialogContent>
        <AlertDialogHeader>
         <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
         <AlertDialogDescription>
          Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá todos os seus
          dados de nossos servidores, incluindo:
          <br />• Todas as suas transações
          <br />• Todas as suas categorias personalizadas
          <br />• Seu perfil e configurações
         </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
         <AlertDialogCancel>Cancelar</AlertDialogCancel>
         <AlertDialogAction
          onClick={handleDeleteAccount}
          disabled={deleteLoading}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
         >
          {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sim, excluir conta
         </AlertDialogAction>
        </AlertDialogFooter>
       </AlertDialogContent>
      </AlertDialog>
     </div>
    </CardContent>
   </Card>
  </div>
 )
}
