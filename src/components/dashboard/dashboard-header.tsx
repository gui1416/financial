"use client"

import { Button } from "@/components/ui/button"
import { Plus, PanelLeft } from "lucide-react"
import { useState } from "react"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"
import { ExportData } from "@/components/dashboard/export-data"
import { useSidebar } from "./dashboard-shell"

export function DashboardHeader() {
 const [isDialogOpen, setIsDialogOpen] = useState(false)
 const { isCollapsed, setIsCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, isMobile } = useSidebar();

 const handleTransactionSaved = () => {
  setIsDialogOpen(false)
  window.location.reload()
 }

 const toggleSidebar = () => {
  if (isMobile) {
   setIsMobileMenuOpen(!isMobileMenuOpen);
  } else {
   setIsCollapsed(!isCollapsed);
  }
 }

 return (
  <>
   <div className="flex h-16 items-center justify-between mb-6">
    <Button
     variant="ghost"
     size="sm"
     className="h-9 w-9 p-0"
     onClick={toggleSidebar}
    >
     <span className="sr-only">Alternar Menu</span>
     <PanelLeft className="h-4 w-4" />
    </Button>

    <div className="flex items-center space-x-4">
     <ExportData />
     <Button size="sm" className="gap-2" onClick={() => setIsDialogOpen(true)}>
      <Plus className="h-4 w-4" />
      Nova Transação
     </Button>
    </div>
   </div>

   <TransactionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSaved={handleTransactionSaved} />
  </>
 )
}