"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

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
 }

 const hasActiveFilters = Object.values(filters).some((value) => value !== "" && value !== "all")

 return (
  <Card>
   <CardContent className="pt-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
     <div className="relative lg:col-span-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
       placeholder="Buscar transações..."
       value={filters.search}
       onChange={(e) => handleFilterChange("search", e.target.value)}
       className="pl-10 w-full"
      />
     </div>
     <div className="grid grid-cols-2 gap-4">
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
     <div className="grid grid-cols-2 gap-4">
      <Input
       type="date"
       value={filters.dateFrom}
       onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
      />
      <Input
       type="date"
       value={filters.dateTo}
       onChange={(e) => handleFilterChange("dateTo", e.target.value)}
      />
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