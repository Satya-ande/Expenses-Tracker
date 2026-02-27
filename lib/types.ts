// ─── Domain Models (mirrors Spring Boot DTOs) ────────────────────

export interface Expense {
  id: number
  title: string
  amount: number
  category: string
  date: string // ISO date string (yyyy-MM-dd)
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface ExpenseCreateRequest {
  title: string
  amount: number
  category: string
  date: string
  notes?: string
}

export interface ExpenseUpdateRequest {
  title?: string
  amount?: number
  category?: string
  date?: string
  notes?: string
}

export interface User {
  id: number
  name: string
  email: string
  avatarUrl?: string
}

export interface AuthRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface DashboardSummary {
  totalExpenses: number
  totalIncome: number
  remainingBalance: number
  expenseChangePercent: number
  incomeChangePercent: number
  savingsPercent: number
}

export interface MonthlyExpense {
  month: string
  amount: number
}

export interface CategoryExpense {
  name: string
  value: number
  fill: string
}

export interface WeeklyExpense {
  day: string
  amount: number
}

export interface UserSettings {
  name: string
  email: string
  currency: string
  emailNotifications: boolean
  budgetAlerts: boolean
}

// ─── API response wrapper (matches Spring Boot ResponseEntity pattern) ────

export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface PagedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
}

// ─── Category constants ──────────────────────────────────────────

export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Other",
] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining": "var(--color-chart-1)",
  Transportation: "var(--color-chart-2)",
  Entertainment: "var(--color-chart-3)",
  "Bills & Utilities": "var(--color-chart-4)",
  Shopping: "var(--color-chart-5)",
  Healthcare: "var(--color-success)",
  Education: "var(--color-primary)",
  Travel: "var(--color-warning)",
  Other: "var(--color-muted-foreground)",
}

export const CATEGORY_BADGE_CLASSES: Record<string, string> = {
  "Food & Dining": "bg-chart-1/15 text-chart-1",
  Transportation: "bg-chart-2/15 text-chart-2",
  Entertainment: "bg-chart-3/15 text-chart-3",
  "Bills & Utilities": "bg-chart-4/15 text-chart-4",
  Shopping: "bg-chart-5/15 text-chart-5",
  Healthcare: "bg-success/15 text-success",
  Education: "bg-primary/15 text-primary",
  Travel: "bg-warning/15 text-warning",
  Other: "bg-muted text-muted-foreground",
}
