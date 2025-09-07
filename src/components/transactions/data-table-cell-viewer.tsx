"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
 Drawer,
 DrawerClose,
 DrawerContent,
 DrawerDescription,
 DrawerFooter,
 DrawerHeader,
 DrawerTitle,
 DrawerTrigger,
} from "@/components/ui/drawer"
import type { Transaction } from "./columns"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface Category {
 id: string
 name: string
 color: string
 type: "income" | "expense"
}

interface DataTableCelViewerProps {
 transaction: Transaction
 onSaved: () => void;
}

export function DataTableCelViewer({ transaction, onSaved }: DataTableCelViewerProps) {
 const [isOpen, setIsOpen] = React.useState(false)
 const [categories, setCategories] = React.useState<Category[]>([])
 const [isLoading, setIsLoading] = React.useState(false)
 const [formData, setFormData] = React.useState({
  title: "",
  description: "",
  amount: "",
  type: "expense" as "income" | "expense",
  categoryId: "",
  date: new Date(),
 })

 const isDesktop = useMediaQuery("(min-width: 768px)")
 const direction = isDesktop ? "right" : "bottom";

 React.useEffect(() => {
  if (isOpen) {
   setFormData({
    title: transaction.title,
    description: transaction.description || "",
    amount: transaction.amount.toString(),
    type: transaction.type,
    categoryId: transaction.categories?.[0]?.id || "",
    date: new Date(transaction.date + 'T00:00:00'),
   })
  }
 }, [transaction, isOpen])

 React.useEffect(() => {
  async function fetchCategories() {
   const supabase = createClient()
   const { data: { user } } = await supabase.auth.getUser()
   if (!user) return

   const { data } = await supabase
    .from("categories")
    .select("id, name, color, type")
    .eq("user_id", user.id)
    .order("name")

   if (data) setCategories(data)
  }

  if (isOpen) {
   fetchCategories()
  }
 }, [isOpen])

 const filteredCategories = categories.filter((category) => category.type === formData.type)

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  const supabase = createClient()
  const transactionData = {
   title: formData.title,
   description: formData.description || null,
   amount: Number.parseFloat(formData.amount),
   type: formData.type,
   category_id: formData.categoryId || null,
   date: format(formData.date, "yyyy-MM-dd"),
  }

  try {
   const { error } = await supabase.from("transactions").update(transactionData).eq("id", transaction.id)
   if (error) throw error

   toast.success("Transação atualizada!", {
    description: "A transação foi atualizada com sucesso.",
   })
   onSaved()
   setIsOpen(false)
  } catch (error) {
   toast.error("Erro ao salvar transação", {
    description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
   })
  } finally {
   setIsLoading(false)
  }
 }

 return (
  <Drawer direction={direction} open={isOpen} onOpenChange={setIsOpen}>
   <DrawerTrigger asChild>
    <Button variant="link" className="text-foreground p-0 h-auto font-medium focus:ring-0 focus:ring-offset-0">
     {transaction.title}
    </Button>
   </DrawerTrigger>
   <DrawerContent className="p-4">
    <DrawerHeader className="gap-1 text-left">
     <DrawerTitle>Editar Transação</DrawerTitle>
     <DrawerDescription>Altere os detalhes da sua transação abaixo.</DrawerDescription>
    </DrawerHeader>

    <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-y-auto px-4">
     <div className="grid gap-4 py-4 flex-1">
      <div className="grid gap-2">
       <Label htmlFor="title-edit">Título</Label>
       <Input id="title-edit" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
      </div>
      <div className="grid gap-2">
       <Label htmlFor="description-edit">Descrição</Label>
       <Textarea id="description-edit" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
      </div>
      <div className="grid gap-2">
       <Label>Tipo</Label>
       <RadioGroup
        value={formData.type}
        onValueChange={(value: "income" | "expense") => setFormData({ ...formData, type: value, categoryId: "" })}
        className="flex gap-6"
       >
        <div className="flex items-center space-x-2"><RadioGroupItem value="income" id="income-edit" /><Label htmlFor="income-edit">Receita</Label></div>
        <div className="flex items-center space-x-2"><RadioGroupItem value="expense" id="expense-edit" /><Label htmlFor="expense-edit">Despesa</Label></div>
       </RadioGroup>
      </div>
      <div className="grid gap-2">
       <Label htmlFor="amount-edit">Valor</Label>
       <Input id="amount-edit" type="number" step="0.01" min="0" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
      </div>
      <div className="grid gap-2">
       <Label htmlFor="category-edit">Categoria</Label>
       <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
        <SelectTrigger id="category-edit"><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
        <SelectContent>
         {filteredCategories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
           <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />{category.name}</div>
          </SelectItem>
         ))}
        </SelectContent>
       </Select>
      </div>
      <div className="grid gap-2">
       <Label htmlFor="date-edit">Data</Label>
       <Popover>
        <PopoverTrigger asChild>
         <Button variant={"outline"} id="date-edit" className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formData.date ? format(formData.date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
         </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.date} onSelect={(date) => date && setFormData({ ...formData, date })} initialFocus locale={ptBR} /></PopoverContent>
       </Popover>
      </div>
     </div>
     <DrawerFooter className="flex-col sm:flex-row gap-2 px-0 pt-4"> {/* ALTERAÇÃO AQUI */}
      <DrawerClose asChild><Button variant="outline" className="w-full">Cancelar</Button></DrawerClose>
      <Button type="submit" disabled={isLoading} className="w-full">
       {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
       Salvar Alterações
      </Button>
     </DrawerFooter>
    </form>
   </DrawerContent>
  </Drawer>
 )
}

function useMediaQuery(query: string) {
 const [value, setValue] = React.useState(false);
 React.useEffect(() => {
  function onChange(event: MediaQueryListEvent) { setValue(event.matches); }
  const result = window.matchMedia(query);
  result.addEventListener("change", onChange);
  setValue(result.matches);
  return () => result.removeEventListener("change", onChange);
 }, [query]);
 return value;
}