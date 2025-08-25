"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"
import { ExportData } from "@/components/dashboard/export-data"
import { ThemeToggle } from "@/components/theme-toggle"

export function DashboardHeader() {
 const [isDialogOpen, setIsDialogOpen] = useState(false)

 const handleTransactionSaved = () => {
  setIsDialogOpen(false)
  window.location.reload()
 }

 return (
  <>
   <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="flex h-16 items-center px-4 md:px-8">
     <div className="ml-auto flex items-center space-x-4">
      <ThemeToggle />
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
