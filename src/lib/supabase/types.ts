export interface UserProfile {
 id: string
 email: string
 full_name?: string
 company_name?: string
 created_at: string
 updated_at: string
}

export interface Category {
 id: string
 user_id: string
 name: string
 color: string
 icon: string
 created_at: string
 updated_at: string
}

export interface Transaction {
 id: string
 user_id: string
 category_id?: string
 title: string
 description?: string
 amount: number
 type: "income" | "expense"
 date: string
 created_at: string
 updated_at: string
 category?: Category
}

export interface Budget {
 id: string
 user_id: string
 category_id?: string
 name: string
 amount: number
 period: "monthly" | "yearly"
 start_date: string
 end_date: string
 created_at: string
 updated_at: string
 category?: Category
}

export interface FinancialSummary {
 totalIncome: number
 totalExpenses: number
 balance: number
 monthlyIncome: number
 monthlyExpenses: number
 monthlyBalance: number
}
