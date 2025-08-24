"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download } from "lucide-react"

export function AnalyticsFilters() {
 const [period, setPeriod] = useState("last-3-months")

 const handleExport = () => {
  // TODO: Implement export functionality
  console.log("Exporting data...")
 }

 return (
  <Card>
   <CardContent className="pt-6">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
     <div className="flex gap-2">
      <Select value={period} onValueChange={setPeriod}>
       <SelectTrigger className="w-[180px]">
        <Calendar className="mr-2 h-4 w-4" />
        <SelectValue />
       </SelectTrigger>
       <SelectContent>
        <SelectItem value="last-month">Último mês</SelectItem>
        <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
        <SelectItem value="last-6-months">Últimos 6 meses</SelectItem>
        <SelectItem value="last-year">Último ano</SelectItem>
        <SelectItem value="current-year">Ano atual</SelectItem>
       </SelectContent>
      </Select>
     </div>
     <Button variant="outline" onClick={handleExport} className="gap-2 bg-transparent">
      <Download className="h-4 w-4" />
      Exportar Dados
     </Button>
    </div>
   </CardContent>
  </Card>
 )
}
