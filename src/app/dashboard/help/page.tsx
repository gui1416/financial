import { HelpContent } from "@/components/help/help-content"

export default function HelpPage() {
 return (
  <div className="space-y-6">
   <div>
    <h1 className="text-3xl font-bold tracking-tight">Central de Ajuda</h1>
    <p className="text-muted-foreground">
     Aprenda a usar todas as funcionalidades do seu gerenciador financeiro.
    </p>
   </div>
   <HelpContent />
  </div>
 )
}