"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useEffect, useState } from "react"

interface MonthlyChartProps {
 userId: string
}

interface MonthlyData {
 month: string
 income: number
 expenses: number
}

export default function MonthlyChart({ userId }: MonthlyChartProps) {
 const [data, setData] = useState<MonthlyData[]>([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {
  // Generate last 6 months data
  const months = []
  const currentDate = new Date()

  for (let i = 5; i >= 0; i--) {
   const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
   const monthName = date.toLocaleDateString("pt-BR", { month: "short" })

   // Mock data for now - in real app, this would fetch from API
   months.push({
    month: monthName,
    income: Math.random() * 5000 + 2000,
    expenses: Math.random() * 4000 + 1500,
   })
  }

  setData(months)
  setLoading(false)
 }, [userId])

 const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("pt-BR", {
   style: "currency",
   currency: "BRL",
  }).format(amount)
 }

 const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
   return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
     <p className="text-white font-medium mb-2">{label}</p>
     {payload.map((entry: any, index: number) => (
      <p key={index} style={{ color: entry.color }}>
       {entry.name}: {formatCurrency(entry.value)}
      </p>
     ))}
    </div>
   )
  }
  return null
 }

 if (loading) {
  return (
   <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
    <CardHeader>
     <CardTitle className="text-white">Comparativo Mensal</CardTitle>
    </CardHeader>
    <CardContent>
     <div className="flex items-center justify-center h-64 text-slate-400">Carregando...</div>
    </CardContent>
   </Card>
  )
 }

 return (
  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
   <CardHeader>
    <CardTitle className="text-white">Comparativo Mensal</CardTitle>
   </CardHeader>
   <CardContent>
    <ResponsiveContainer width="100%" height={300}>
     <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      <XAxis dataKey="month" stroke="#9CA3AF" />
      <YAxis stroke="#9CA3AF" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Bar dataKey="income" fill="#10B981" name="Receitas" radius={[4, 4, 0, 0]} />
      <Bar dataKey="expenses" fill="#EF4444" name="Despesas" radius={[4, 4, 0, 0]} />
     </BarChart>
    </ResponsiveContainer>
   </CardContent>
  </Card>
 )
}
