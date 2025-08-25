"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Download, Loader2, FileText, FileSpreadsheet } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface ExportData {
  transactions?: Transaction[];
  categories?: Category[];
}

interface Transaction {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  type: "income" | "expense";
  date: string;
  created_at: string;
  categories: {
    name: string;
    type: "income" | "expense";
    color: string;
    icon: string;
  }[];
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: "income" | "expense";
  created_at: string;
  user_id: string;
}


export function ExportData() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [format, setFormat] = useState<"csv" | "json">("csv")
  const [dateRange, setDateRange] = useState<"all" | "30" | "90" | "365">("all")
  const [includeCategories, setIncludeCategories] = useState(true)
  const [includeTransactions, setIncludeTransactions] = useState(true)
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const handleExport = async () => {
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      let dateFilter = ""
      if (dateRange !== "all") {
        const daysAgo = new Date()
        daysAgo.setDate(daysAgo.getDate() - Number.parseInt(dateRange))
        dateFilter = daysAgo.toISOString().split("T")[0]
      }

      const exportData: ExportData = {}

      if (includeTransactions) {
        let query = supabase
          .from("transactions")
          .select(`
            id,
            title,
            description,
            amount,
            type,
            date,
            created_at,
            categories (
              name,
              type,
              color,
              icon
            )
          `)
          .eq("user_id", user.id)
          .order("date", { ascending: false })

        if (dateFilter) {
          query = query.gte("date", dateFilter)
        }

        const { data: transactions, error: transactionsError } = await query

        if (transactionsError) throw transactionsError
        exportData.transactions = transactions
      }

      if (includeCategories) {
        const { data: categories, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .eq("user_id", user.id)
          .order("name")

        if (categoriesError) throw categoriesError
        exportData.categories = categories
      }

      if (format === "json") {
        downloadJSON(exportData)
      } else {
        downloadCSV(exportData)
      }

      toast.success("Dados exportados", {
        description: "Seus dados foram exportados com sucesso.",
      })

      setOpen(false)
    } catch {
      toast.error("Erro na exportação", {
        description: "Não foi possível exportar os dados. Tente novamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadJSON = (data: ExportData) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `financeapp-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadCSV = (data: ExportData) => {
    if (data.transactions) {
      const csvContent = convertToCSV(data.transactions)
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `financeapp-transactions-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const convertToCSV = (transactions: Transaction[]) => {
    const headers = ["Data", "Título", "Descrição", "Valor", "Tipo", "Categoria"]
    const rows = transactions.map((t) => [
      t.date,
      t.title,
      t.description || "",
      t.amount,
      t.type === "income" ? "Receita" : "Despesa",
      t.categories && t.categories.length > 0 ? t.categories[0].name : "Sem categoria",
    ])

    return [headers, ...rows].map((row) => row.map((field) => `"${String(field)}"`).join(",")).join("\n")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Exportar Dados
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exportar Dados</DialogTitle>
          <DialogDescription>Baixe seus dados financeiros para backup ou análise externa.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Formato do Arquivo</Label>
            <Select value={format} onValueChange={(value: "csv" | "json") => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    CSV (Excel)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    JSON
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Período</Label>
            <Select value={dateRange} onValueChange={(value: "all" | "30" | "90" | "365") => setDateRange(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os dados</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="365">Último ano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Dados para Exportar</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="transactions" checked={includeTransactions} onCheckedChange={(checked) => setIncludeTransactions(Boolean(checked))} />
                <Label htmlFor="transactions">Transações</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="categories" checked={includeCategories} onCheckedChange={(checked) => setIncludeCategories(Boolean(checked))} />
                <Label htmlFor="categories">Categorias</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={loading || (!includeTransactions && !includeCategories)}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Exportar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}