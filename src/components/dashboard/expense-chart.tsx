"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface ExpenseChartProps {
 data: {
  category: string
  amount: number
  color: string
 }[]
}

export default function ExpenseChart({ data }: ExpenseChartProps) {
 const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("pt-BR", {
   style: "currency",
   currency: "BRL",
  }).format(amount)
 }

 const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
   const data = payload[0].payload
   return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
     <p className="text-white font-medium">{data.category}</p>
     <p className="text-emerald-400">{formatCurrency(data.amount)}</p>
    </div>
   )
  }
  return null
 }

 if (!data || data.length === 0) {
  return (
   <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
    <CardHeader>
     <CardTitle className="text-white">Gastos por Categoria</CardTitle>
    </CardHeader>
    <CardContent>
     <div className="flex items-center justify-center h-64 text-slate-400">Nenhum gasto registrado este mês</div>
    </CardContent>
   </Card>
  )
 }

 return (
  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
   <CardHeader>
    <CardTitle className="text-white">Gastos por Categoria</CardTitle>
   </CardHeader>
   <CardContent>
    <ResponsiveContainer width="100%" height={300}>
     <PieChart>
      <Pie
       data={data}
       cx="50%"
       cy="50%"
       outerRadius={100}
       fill="#8884d8"
       dataKey="amount"
       label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
       labelLine={false}
      >
       {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.color} />
       ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
     </PieChart>
    </ResponsiveContainer>
   </CardContent>
  </Card>
 )
}
