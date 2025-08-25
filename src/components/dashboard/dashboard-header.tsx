"use client"

import { Button } from "@/components/ui/button"
import { Plus, PanelLeft } from "lucide-react" // Usamos apenas o ícone PanelLeft
import { useState } from "react"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"
import { ExportData } from "@/components/dashboard/export-data"
import { useSidebar } from "./dashboard-shell"

export function DashboardHeader() {
 const [isDialogOpen, setIsDialogOpen] = useState(false)
 // Pegamos todos os estados e funções do contexto
 const { isCollapsed, setIsCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, isMobile } = useSidebar();

 const handleTransactionSaved = () => {
  setIsDialogOpen(false)
  window.location.reload()
 }

 // Função unificada para controlar a sidebar
 const toggleSidebar = () => {
  if (isMobile) {
   setIsMobileMenuOpen(!isMobileMenuOpen);
  } else {
   setIsCollapsed(!isCollapsed);
  }
 }

 return (
  <>
   <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="flex h-16 items-center px-4 md:px-8">
     {/* Botão unificado com o ícone PanelLeft */}
     <Button
      variant="ghost"
      size="sm"
      className="mr-4 h-9 w-9 p-0" // Visível em todas as telas
      onClick={toggleSidebar}
     >
      <span className="sr-only">Alternar Menu</span>
      <PanelLeft className="h-4 w-4" />
     </Button>

     <div className="ml-auto flex items-center space-x-4">
      <ExportData />
      <Button size="sm" className="gap-2" onClick={() => setIsDialogOpen(true)}>
       <Plus className="h-4 w-4" />
       Nova Transação
      </Button>
     </div>
    </div>
   </div>

   <TransactionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSaved={handleTransactionSaved} />
  </>
 )
}