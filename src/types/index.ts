// src/types/index.ts

export interface Category {
 id: string;
 name: string;
 color: string;
 icon: string;
 type: "income" | "expense";
 created_at: string;
 transactions_count?: number;
 _count?: {
  transactions: number;
 };
}

export interface Transaction {
 id: string;
 title: string;
 description: string | null;
 amount: number;
 type: "income" | "expense";
 date: string;
 created_at: string;
 categories: {
  id: string;
  name: string;
  color: string;
 }[] | null;
}