"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { createClient } from "@/lib/supabase/client"
import { useQuery } from "@tanstack/react-query"

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

const fetchChartData = async (): Promise<ChartData[]> => {
 const supabase = createClient();
 const { data: { user } } = await supabase.auth.getUser();

 if (!user) throw new Error("Usuário não autenticado");

 const endDate = new Date();
 const startDate = new Date();
 startDate.setDate(startDate.getDate() - 30);

 const { data: transactions, error } = await supabase
  .from("transactions")
  .select("amount, type, date")
  .eq("user_id", user.id)
  .gte("date", startDate.toISOString().split("T")[0])
  .lte("date", endDate.toISOString().split("T")[0])
  .order("date", { ascending: true });

 if (error) throw error;

 const groupedData: { [key: string]: { income: number; expenses: number } } = {};

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
  date: new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
  income: values.income,
  expenses: values.expenses,
 }));
}

export function TransactionsChart() {
 const { data = [], isLoading } = useQuery({
  queryKey: ['transactionsChartData'],
  queryFn: fetchChartData
 });

 if (isLoading) {
  return (
   <Card>
    <CardHeader>
     <CardTitle>Fluxo de Caixa</CardTitle>
     <CardDescription>Receitas e gastos dos últimos 30 dias</CardDescription>
    </CardHeader>
    <CardContent>
     <div className="h-[300px] bg-muted animate-pulse rounded" />
    </CardContent>
   </Card>
  )
 }

 return (
  <Card>
   <CardHeader>
    <CardTitle>Fluxo de Caixa</CardTitle>
    <CardDescription>Receitas e gastos dos últimos 30 dias</CardDescription>
   </CardHeader>
   <CardContent>
    <ChartContainer config={chartConfig} className="h-[300px]">
     <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
       <XAxis dataKey="date" />
       <YAxis />
       <ChartTooltip content={<ChartTooltipContent />} />
       <Area
        type="monotone"
        dataKey="income"
        stackId="1"
        stroke="var(--color-income)"
        fill="var(--color-income)"
        fillOpacity={0.6}
       />
       <Area
        type="monotone"
        dataKey="expenses"
        stackId="2"
        stroke="var(--color-expenses)"
        fill="var(--color-expenses)"
        fillOpacity={0.6}
       />
      </AreaChart>
     </ResponsiveContainer>
    </ChartContainer>
   </CardContent>
  </Card>
 )
}