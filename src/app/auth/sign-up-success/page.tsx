import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpSuccessPage() {
 return (
  <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
   <div className="w-full max-w-sm">
    <div className="flex flex-col gap-6">
     <div className="text-center">
      <h1 className="text-2xl font-bold text-foreground">FinanceApp</h1>
     </div>
     <Card>
      <CardHeader>
       <CardTitle className="text-2xl">Obrigado por se cadastrar!</CardTitle>
       <CardDescription>Verifique seu email para confirmar</CardDescription>
      </CardHeader>
      <CardContent>
       <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
         Você se cadastrou com sucesso. Verifique seu email para confirmar sua conta antes de fazer login.
        </p>
        <Button asChild className="w-full">
         <Link href="/auth/login">Voltar para o login</Link>
        </Button>
       </div>
      </CardContent>
     </Card>
    </div>
   </div>
  </div>
 )
}
