"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Calendar as CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface Category {
 id: string
 name: string
 color: string
}

export function TransactionsFilters() {
 const [categories, setCategories] = useState<Category[]>([])
 const [filters, setFilters] = useState({
  search: "",
  type: "all",
  categoryId: "all",
  dateFrom: "",
  dateTo: "",
 })
 const [date, setDate] = React.useState<DateRange | undefined>()

 useEffect(() => {
  async function fetchCategories() {
   const supabase = createClient()
   const {
    data: { user },
   } = await supabase.auth.getUser()

   if (!user) return

   const { data } = await supabase.from("categories").select("id, name, color").eq("user_id", user.id).order("name")

   if (data) {
    setCategories(data)
   }
  }

  fetchCategories()
 }, [])

 // Sincroniza o calendário com o estado do filtro
 useEffect(() => {
  handleFilterChange("dateFrom", date?.from ? format(date.from, "yyyy-MM-dd") : "")
  handleFilterChange("dateTo", date?.to ? format(date.to, "yyyy-MM-dd") : "")
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [date]);


 const handleFilterChange = (key: string, value: string) => {
  setFilters((prev) => ({ ...prev, [key]: value }))
 }

 const clearFilters = () => {
  setFilters({
   search: "",
   type: "all",
   categoryId: "all",
   dateFrom: "",
   dateTo: "",
  })
  setDate(undefined);
 }

 const hasActiveFilters = filters.search !== "" || filters.type !== "all" || filters.categoryId !== "all" || filters.dateFrom !== "" || filters.dateTo !== ""

 return (
  <Card>
   <CardContent className="pt-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
     <div className="space-y-2 lg:col-span-1">
      <Label>Busca</Label>
      <div className="relative">
       <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
       <Input
        placeholder="Buscar transações..."
        value={filters.search}
        onChange={(e) => handleFilterChange("search", e.target.value)}
        className="pl-10 w-full"
       />
      </div>
     </div>
     <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
       <Label>Tipo</Label>
       <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
        <SelectTrigger>
         <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
         <SelectItem value="all">Todos</SelectItem>
         <SelectItem value="income">Receitas</SelectItem>
         <SelectItem value="expense">Despesas</SelectItem>
        </SelectContent>
       </Select>
      </div>
      <div className="space-y-2">
       <Label>Categoria</Label>
       <Select value={filters.categoryId} onValueChange={(value) => handleFilterChange("categoryId", value)}>
        <SelectTrigger>
         <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
         <SelectItem value="all">Todas</SelectItem>
         {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
           <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
            {category.name}
           </div>
          </SelectItem>
         ))}
        </SelectContent>
       </Select>
      </div>
     </div>

     <div className="space-y-2">
      <Label>Período</Label>
      <Popover>
       <PopoverTrigger asChild>
        <Button
         id="date"
         variant={"outline"}
         className={cn(
          "w-full justify-start text-left font-normal bg-transparent",
          !date && "text-muted-foreground"
         )}
        >
         <CalendarIcon className="mr-2 h-4 w-4" />
         {date?.from ? (
          date.to ? (
           <>
            {format(date.from, "dd/MM/yy", { locale: ptBR })} -{" "}
            {format(date.to, "dd/MM/yy", { locale: ptBR })}
           </>
          ) : (
           format(date.from, "dd/MM/yyyy", { locale: ptBR })
          )
         ) : (
          <span>Escolha um período</span>
         )}
        </Button>
       </PopoverTrigger>
       <PopoverContent className="w-auto p-0" align="start">
        <Calendar
         initialFocus
         mode="range"
         defaultMonth={date?.from}
         selected={date}
         onSelect={setDate}
         numberOfMonths={1}
         locale={ptBR}
        />
       </PopoverContent>
      </Popover>
     </div>

     {hasActiveFilters && (
      <Button variant="outline" size="sm" onClick={clearFilters} className="gap-2 bg-transparent">
       <X className="h-4 w-4" />
       Limpar Filtros
      </Button>
     )}
    </div>
   </CardContent>
  </Card>
 )
}