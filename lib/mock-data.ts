import type {
  Expense,
  DashboardSummary,
  MonthlyExpense,
  CategoryExpense,
  WeeklyExpense,
  UserSettings,
} from "./types"
import { CATEGORY_COLORS } from "./types"

// ─── Mock expenses ───────────────────────────────────────────────

const expenses: Expense[] = []

// ─── Dashboard summary ──────────────────────────────────────────

const summary: DashboardSummary = {
  totalExpenses: 0,
  totalIncome: 0,
  remainingBalance: 0,
  expenseChangePercent: 0,
  incomeChangePercent: 0,
  savingsPercent: 0,
}

// ─── Chart data ──────────────────────────────────────────────────

const monthlyData: MonthlyExpense[] = []

const categoryData: CategoryExpense[] = []

const weeklyData: WeeklyExpense[] = []

// ─── Settings ────────────────────────────────────────────────────

const settings: UserSettings = {
  name: "John Doe",
  email: "john@example.com",
  currency: "usd",
  emailNotifications: true,
  budgetAlerts: true,
}

// ─── Export as one object ────────────────────────────────────────

export const MOCK_DATA = {
  expenses,
  summary,
  monthlyData,
  categoryData,
  weeklyData,
  settings,
}
