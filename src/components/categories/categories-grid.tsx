"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Plus } from "lucide-react"
import { CategoryDialog } from "./category-dialog"
import { DeleteCategoryDialog } from "./delete-category-dialog"
import { getIconComponent } from "@/lib/icons"

interface Category {
 id: string
 name: string
 color: string
 icon: string
 type: "income" | "expense"
 created_at: string
 transactions_count?: number
}

export function CategoriesGrid() {
 const [categories, setCategories] = useState<Category[]>([])
 const [isLoading, setIsLoading] = useState(true)
 const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
 const [isDialogOpen, setIsDialogOpen] = useState(false)
 const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
 const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

 const fetchCategories = async () => {
  setIsLoading(true);
  const supabase = createClient()
  const {
   data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
   setIsLoading(false);
   return;
  };

  // Chamar a função RPC para obter categorias com contagem de transações
  const { data, error } = await supabase.rpc('get_categories_with_transaction_count');

  if (error) {
   console.error("Error fetching categories with counts:", error);
  } else if (data) {
   setCategories(data);
  }

  setIsLoading(false)
 }

 useEffect(() => {
  fetchCategories()
 }, [])

 const handleEdit = (category: Category) => {
  setSelectedCategory(category)
  setIsDialogOpen(true)
 }

 const handleDelete = (category: Category) => {
  setCategoryToDelete(category)
  setIsDeleteDialogOpen(true)
 }

 const handleCategorySaved = () => {
  fetchCategories()
  setIsDialogOpen(false)
  setSelectedCategory(null)
 }

 const handleCategoryDeleted = () => {
  fetchCategories()
  setIsDeleteDialogOpen(false)
  setCategoryToDelete(null)
 }

 const incomeCategories = categories.filter((cat) => cat.type === "income")
 const expenseCategories = categories.filter((cat) => cat.type === "expense")

 if (isLoading) {
  return (
   <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
     {Array.from({ length: 8 }).map((_, i) => (
      <Card key={i}>
       <CardContent className="p-6">
        <div className="space-y-3">
         <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
         <div className="h-4 bg-muted animate-pulse rounded" />
         <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
        </div>
       </CardContent>
      </Card>
     ))}
    </div>
   </div>
  )
 }

 const CategoryCard = ({ category }: { category: Category }) => {
  const IconComponent = getIconComponent(category.icon)

  return (
   <Card className="group hover:shadow-md transition-shadow">
    <CardContent className="p-6">
     <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
       <div
        className="h-10 w-10 rounded-full flex items-center justify-center text-white"
        style={{ backgroundColor: category.color }}
       >
        <IconComponent className="h-5 w-5" />
       </div>
       <div>
        <h3 className="font-medium">{category.name}</h3>
        <p className="text-sm text-muted-foreground">{category.transactions_count || 0} transações</p>
       </div>
      </div>
      <DropdownMenu>
       <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
         <MoreHorizontal className="h-4 w-4" />
        </Button>
       </DropdownMenuTrigger>
       <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleEdit(category)}>
         <Edit className="mr-2 h-4 w-4" />
         Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDelete(category)} className="text-destructive">
         <Trash2 className="mr-2 h-4 w-4" />
         Excluir
        </DropdownMenuItem>
       </DropdownMenuContent>
      </DropdownMenu>
     </div>
     <div className="mt-3">
      <Badge variant={category.type === "income" ? "default" : "secondary"}>
       {category.type === "income" ? "Receita" : "Despesa"}
      </Badge>
     </div>
    </CardContent>
   </Card>
  )
 }

 return (
  <>
   <div className="space-y-6">
    <div className="flex items-center justify-between">
     <div>
      <h3 className="text-lg font-medium">Categorias de Receita</h3>
      <p className="text-sm text-muted-foreground">Gerencie suas categorias de receita</p>
     </div>
     <Button
      onClick={() => {
       setSelectedCategory({ type: "income" } as Category)
       setIsDialogOpen(true)
      }}
      className="gap-2"
     >
      <Plus className="h-4 w-4" />
      Nova Receita
     </Button>
    </div>

    {incomeCategories.length === 0 ? (
     <Card>
      <CardContent className="p-6 text-center">
       <p className="text-muted-foreground">Nenhuma categoria de receita encontrada</p>
       <Button
        onClick={() => {
         setSelectedCategory({ type: "income" } as Category)
         setIsDialogOpen(true)
        }}
        className="mt-4 gap-2"
       >
        <Plus className="h-4 w-4" />
        Criar primeira categoria de receita
       </Button>
      </CardContent>
     </Card>
    ) : (
     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {incomeCategories.map((category) => (
       <CategoryCard key={category.id} category={category} />
      ))}
     </div>
    )}

    <div className="flex items-center justify-between">
     <div>
      <h3 className="text-lg font-medium">Categorias de Despesa</h3>
      <p className="text-sm text-muted-foreground">Gerencie suas categorias de despesa</p>
     </div>
     <Button
      onClick={() => {
       setSelectedCategory({ type: "expense" } as Category)
       setIsDialogOpen(true)
      }}
      variant="outline"
      className="gap-2"
     >
      <Plus className="h-4 w-4" />
      Nova Despesa
     </Button>
    </div>

    {expenseCategories.length === 0 ? (
     <Card>
      <CardContent className="p-6 text-center">
       <p className="text-muted-foreground">Nenhuma categoria de despesa encontrada</p>
       <Button
        onClick={() => {
         setSelectedCategory({ type: "expense" } as Category)
         setIsDialogOpen(true)
        }}
        variant="outline"
        className="mt-4 gap-2"
       >
        <Plus className="h-4 w-4" />
        Criar primeira categoria de despesa
       </Button>
      </CardContent>
     </Card>
    ) : (
     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {expenseCategories.map((category) => (
       <CategoryCard key={category.id} category={category} />
      ))}
     </div>
    )}
   </div>

   <CategoryDialog
    open={isDialogOpen}
    onOpenChange={setIsDialogOpen}
    category={selectedCategory}
    onSaved={handleCategorySaved}
   />

   <DeleteCategoryDialog
    open={isDeleteDialogOpen}
    onOpenChange={setIsDeleteDialogOpen}
    category={categoryToDelete}
    onDeleted={handleCategoryDeleted}
   />
  </>
 )
}