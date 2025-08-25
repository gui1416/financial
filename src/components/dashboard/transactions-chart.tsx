"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { createClient } from "@/lib/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { useIsMobile } from "@/hooks/use-mobile"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChartData {
 date: string
 income: number
 expenses: number
}

const chartConfig = {
 income: {
  label: "Receitas",
  color: "hsl(var(--chart-1))",
 },
 expenses: {
  label: "Gastos",
  color: "hsl(var(--chart-2))",
 },
}

const fetchChartData = async (period: number): Promise<ChartData[]> => {
 const supabase = createClient();
 const { data: { user } } = await supabase.auth.getUser();

 if (!user) throw new Error("Usuário não autenticado");

 const endDate = new Date();
 const startDate = new Date();
 startDate.setDate(startDate.getDate() - period);

 const { data: transactions, error } = await supabase
  .from("transactions")
  .select("amount, type, date")
  .eq("user_id", user.id)
  .gte("date", startDate.toISOString().split("T")[0])
  .lte("date", endDate.toISOString().split("T")[0])
  .order("date", { ascending: true });

 if (error) throw error;

 const groupedData: { [key: string]: { income: number; expenses: number } } = {};

 for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
  const dateKey = d.toISOString().split("T")[0];
  groupedData[dateKey] = { income: 0, expenses: 0 };
 }


 transactions.forEach((transaction) => {
  const date = transaction.date;
  if (!groupedData[date]) {
   groupedData[date] = { income: 0, expenses: 0 };
  }
  if (transaction.type === "income") {
   groupedData[date].income += Number(transaction.amount);
  } else {
   groupedData[date].expenses += Number(transaction.amount);
  }
 });

 return Object.entries(groupedData).map(([date, values]) => ({
  date: new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
  income: values.income,
  expenses: values.expenses,
 }));
}

export function TransactionsChart() {
 const [period, setPeriod] = useState(30);
 const { data = [], isLoading } = useQuery({
  queryKey: ['transactionsChartData', period],
  queryFn: () => fetchChartData(period)
 });
 const isMobile = useIsMobile();

 if (isLoading) {
  return (
   <Card className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <CardHeader>
     <CardTitle>Fluxo de Caixa</CardTitle>
     <CardDescription>Receitas e gastos no período</CardDescription>
    </CardHeader>
    <CardContent>
     <div className="h-[300px] bg-muted animate-pulse rounded" />
    </CardContent>
   </Card>
  )
 }

 return (
  <Card className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
   <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
    <div>
     <CardTitle>Fluxo de Caixa</CardTitle>
     <CardDescription>Receitas e gastos no período selecionado</CardDescription>
    </div>
    <Select value={String(period)} onValueChange={(value) => setPeriod(Number(value))}>
     <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Selecione o período" />
     </SelectTrigger>
     <SelectContent>
      <SelectItem value="7">Últimos 7 dias</SelectItem>
      <SelectItem value="30">Últimos 30 dias</SelectItem>
      <SelectItem value="90">Últimos 90 dias</SelectItem>
     </SelectContent>
    </Select>
   </CardHeader>
   <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
     <ResponsiveContainer>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: isMobile ? 30 : 10 }}>
       <defs>
        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
         <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.8} />
         <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0.1} />
        </linearGradient>
        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
         <stop offset="5%" stopColor="var(--color-expenses)" stopOpacity={0.8} />
         <stop offset="95%" stopColor="var(--color-expenses)" stopOpacity={0.1} />
        </linearGradient>
       </defs>
       <CartesianGrid vertical={false} strokeDasharray="3 3" />
       <XAxis
        dataKey="date"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        angle={isMobile ? -45 : 0}
        textAnchor={isMobile ? 'end' : 'middle'}
        interval={isMobile ? Math.floor(period / 4) : Math.floor(period / 10)}
        height={isMobile ? 50 : 30}
       />
       <YAxis
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        tickFormatter={(value) => `$${value / 1000}k`}
       />
       <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
       <Area
        type="monotone"
        dataKey="income"
        stackId="1"
        stroke="var(--color-income)"
        strokeWidth={2}
        fill="url(#colorIncome)"
       />
       <Area
        type="monotone"
        dataKey="expenses"
        stackId="1"
        stroke="var(--color-expenses)"
        strokeWidth={2}
        fill="url(#colorExpenses)"
       />
      </AreaChart>
     </ResponsiveContainer>
    </ChartContainer>
   </CardContent>
  </Card>
 )
}