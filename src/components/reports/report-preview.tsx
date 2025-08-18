"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar, TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface ReportData {
 reportType: string
 period: { startDate: string; endDate: string }
 summary: { totalIncome: number; totalExpenses: number; balance: number }
 transactions: any[]
 categoryBreakdown: { category: string; amount: number }[]
 generatedAt: string
}

interface ReportPreviewProps {
 data: ReportData
}

export default function ReportPreview({ data }: ReportPreviewProps) {
 const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("pt-BR", {
   style: "currency",
   currency: "BRL",
  }).format(amount)
 }

 const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR")
 }

 const getReportTypeName = (type: string) => {
  switch (type) {
   case "monthly":
    return "Relatório Mensal"
   case "yearly":
    return "Relatório Anual"
   case "custom":
    return "Relatório Personalizado"
   default:
    return "Relatório"
  }
 }

 const downloadPDF = () => {
  // Create a simple HTML content for PDF generation
  const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${getReportTypeName(data.reportType)}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #10B981; padding-bottom: 20px; }
            .summary { display: flex; justify-content: space-around; margin: 30px 0; }
            .summary-item { text-align: center; }
            .summary-value { font-size: 24px; font-weight: bold; }
            .income { color: #10B981; }
            .expense { color: #EF4444; }
            .balance { color: ${data.summary.balance >= 0 ? "#10B981" : "#EF4444"}; }
            .section { margin: 30px 0; }
            .section h3 { border-bottom: 1px solid #ddd; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f8f9fa; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FinanceFlow</h1>
            <h2>${getReportTypeName(data.reportType)}</h2>
            <p>Período: ${formatDate(data.period.startDate)} - ${formatDate(data.period.endDate)}</p>
          </div>

          <div class="summary">
            <div class="summary-item">
              <div class="summary-value income">${formatCurrency(data.summary.totalIncome)}</div>
              <div>Total de Receitas</div>
            </div>
            <div class="summary-item">
              <div class="summary-value expense">${formatCurrency(data.summary.totalExpenses)}</div>
              <div>Total de Despesas</div>
            </div>
            <div class="summary-item">
              <div class="summary-value balance">${formatCurrency(data.summary.balance)}</div>
              <div>Saldo</div>
            </div>
          </div>

          <div class="section">
            <h3>Gastos por Categoria</h3>
            <table>
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>% do Total</th>
                </tr>
              </thead>
              <tbody>
                ${data.categoryBreakdown
    .map(
     (item) => `
                  <tr>
                    <td>${item.category}</td>
                    <td>${formatCurrency(item.amount)}</td>
                    <td>${((item.amount / data.summary.totalExpenses) * 100).toFixed(1)}%</td>
                  </tr>
                `,
    )
    .join("")}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h3>Transações (${data.transactions.length})</h3>
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                ${data.transactions
    .slice(0, 50) // Limit to first 50 transactions
    .map(
     (transaction) => `
                  <tr>
                    <td>${formatDate(transaction.date)}</td>
                    <td>${transaction.title}</td>
                    <td>${transaction.category?.name || "Sem categoria"}</td>
                    <td>${transaction.type === "income" ? "Receita" : "Despesa"}</td>
                    <td class="${transaction.type === "income" ? "income" : "expense"}">
                      ${transaction.type === "income" ? "+" : "-"}${formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                `,
    )
    .join("")}
              </tbody>
            </table>
            ${data.transactions.length > 50 ? `<p><em>Mostrando apenas as primeiras 50 transações de ${data.transactions.length} total.</em></p>` : ""}
          </div>

          <div class="footer">
            <p>Relatório gerado em ${new Date(data.generatedAt).toLocaleString("pt-BR")}</p>
            <p>FinanceFlow - Gestão Financeira Inteligente</p>
          </div>
        </body>
      </html>
    `

  // Create blob and download
  const blob = new Blob([htmlContent], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `relatorio-financeiro-${data.period.startDate}-${data.period.endDate}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
 }

 return (
  <div className="space-y-6">
   {/* Report Header */}
   <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
    <CardHeader>
     <div className="flex items-center justify-between">
      <div>
       <CardTitle className="text-white text-2xl">{getReportTypeName(data.reportType)}</CardTitle>
       <div className="flex items-center space-x-2 text-slate-400 mt-2">
        <Calendar className="h-4 w-4" />
        <span>
         {formatDate(data.period.startDate)} - {formatDate(data.period.endDate)}
        </span>
       </div>
      </div>
      <Button onClick={downloadPDF} className="bg-emerald-600 hover:bg-emerald-700 text-white">
       <Download className="h-4 w-4 mr-2" />
       Baixar PDF
      </Button>
     </div>
    </CardHeader>
   </Card>

   {/* Summary Cards */}
   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
     <CardContent className="p-6">
      <div className="flex items-center space-x-4">
       <div className="p-3 bg-emerald-500/20 rounded-lg">
        <TrendingUp className="h-6 w-6 text-emerald-400" />
       </div>
       <div>
        <p className="text-slate-400 text-sm">Total de Receitas</p>
        <p className="text-2xl font-bold text-emerald-400">{formatCurrency(data.summary.totalIncome)}</p>
       </div>
      </div>
     </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
     <CardContent className="p-6">
      <div className="flex items-center space-x-4">
       <div className="p-3 bg-red-500/20 rounded-lg">
        <TrendingDown className="h-6 w-6 text-red-400" />
       </div>
       <div>
        <p className="text-slate-400 text-sm">Total de Despesas</p>
        <p className="text-2xl font-bold text-red-400">{formatCurrency(data.summary.totalExpenses)}</p>
       </div>
      </div>
     </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
     <CardContent className="p-6">
      <div className="flex items-center space-x-4">
       <div className={`p-3 rounded-lg ${data.summary.balance >= 0 ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
        <DollarSign className={`h-6 w-6 ${data.summary.balance >= 0 ? "text-emerald-400" : "text-red-400"}`} />
       </div>
       <div>
        <p className="text-slate-400 text-sm">Saldo</p>
        <p className={`text-2xl font-bold ${data.summary.balance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
         {formatCurrency(data.summary.balance)}
        </p>
       </div>
      </div>
     </CardContent>
    </Card>
   </div>

   {/* Category Breakdown */}
   {data.categoryBreakdown.length > 0 && (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
     <CardHeader>
      <CardTitle className="text-white">Gastos por Categoria</CardTitle>
     </CardHeader>
     <CardContent>
      <div className="space-y-4">
       {data.categoryBreakdown.map((item, index) => {
        const percentage = (item.amount / data.summary.totalExpenses) * 100
        return (
         <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
          <div className="flex items-center space-x-3">
           <div className="w-4 h-4 bg-emerald-500 rounded-full" />
           <span className="text-white font-medium">{item.category}</span>
          </div>
          <div className="text-right">
           <div className="text-white font-semibold">{formatCurrency(item.amount)}</div>
           <div className="text-slate-400 text-sm">{percentage.toFixed(1)}%</div>
          </div>
         </div>
        )
       })}
      </div>
     </CardContent>
    </Card>
   )}

   {/* Transactions Summary */}
   <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
    <CardHeader>
     <CardTitle className="text-white">Resumo das Transações</CardTitle>
    </CardHeader>
    <CardContent>
     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div>
       <div className="text-2xl font-bold text-white">{data.transactions.length}</div>
       <div className="text-slate-400 text-sm">Total de Transações</div>
      </div>
      <div>
       <div className="text-2xl font-bold text-emerald-400">
        {data.transactions.filter((t) => t.type === "income").length}
       </div>
       <div className="text-slate-400 text-sm">Receitas</div>
      </div>
      <div>
       <div className="text-2xl font-bold text-red-400">
        {data.transactions.filter((t) => t.type === "expense").length}
       </div>
       <div className="text-slate-400 text-sm">Despesas</div>
      </div>
      <div>
       <div className="text-2xl font-bold text-slate-300">
        {new Set(data.transactions.map((t) => t.category?.name || "Sem categoria")).size}
       </div>
       <div className="text-slate-400 text-sm">Categorias</div>
      </div>
     </div>
    </CardContent>
   </Card>
  </div>
 )
}
