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

const expenses: Expense[] = [
  { id: 1, title: "Grocery Shopping", amount: 85.5, category: "Food & Dining", date: "2026-02-25", notes: "Weekly groceries" },
  { id: 2, title: "Uber Ride", amount: 24.0, category: "Transportation", date: "2026-02-24" },
  { id: 3, title: "Netflix Subscription", amount: 15.99, category: "Entertainment", date: "2026-02-23" },
  { id: 4, title: "Electricity Bill", amount: 120.0, category: "Bills & Utilities", date: "2026-02-22", notes: "February bill" },
  { id: 5, title: "New Headphones", amount: 79.99, category: "Shopping", date: "2026-02-21" },
  { id: 6, title: "Doctor Visit", amount: 50.0, category: "Healthcare", date: "2026-02-20", notes: "Annual checkup" },
  { id: 7, title: "Online Course", amount: 49.99, category: "Education", date: "2026-02-19" },
  { id: 8, title: "Restaurant Dinner", amount: 62.3, category: "Food & Dining", date: "2026-02-18", notes: "Birthday dinner" },
  { id: 9, title: "Gas Station", amount: 45.0, category: "Transportation", date: "2026-02-17" },
  { id: 10, title: "Movie Tickets", amount: 28.0, category: "Entertainment", date: "2026-02-16" },
  { id: 11, title: "Water Bill", amount: 35.0, category: "Bills & Utilities", date: "2026-02-15" },
  { id: 12, title: "Coffee Shop", amount: 12.5, category: "Food & Dining", date: "2026-02-14" },
  { id: 13, title: "Gym Membership", amount: 40.0, category: "Healthcare", date: "2026-02-13" },
  { id: 14, title: "Weekend Trip", amount: 250.0, category: "Travel", date: "2026-02-12" },
  { id: 15, title: "Phone Case", amount: 19.99, category: "Shopping", date: "2026-02-11" },
]

// ─── Dashboard summary ──────────────────────────────────────────

const summary: DashboardSummary = {
  totalExpenses: 918.26,
  totalIncome: 5240.0,
  remainingBalance: 4321.74,
  expenseChangePercent: 12,
  incomeChangePercent: 4.5,
  savingsPercent: 83,
}

// ─── Chart data ──────────────────────────────────────────────────

const monthlyData: MonthlyExpense[] = [
  { month: "Sep", amount: 1800 },
  { month: "Oct", amount: 2100 },
  { month: "Nov", amount: 1650 },
  { month: "Dec", amount: 2400 },
  { month: "Jan", amount: 1950 },
  { month: "Feb", amount: 918 },
]

const categoryData: CategoryExpense[] = [
  { name: "Food & Dining", value: 160.3, fill: CATEGORY_COLORS["Food & Dining"] },
  { name: "Transportation", value: 69.0, fill: CATEGORY_COLORS["Transportation"] },
  { name: "Entertainment", value: 43.99, fill: CATEGORY_COLORS["Entertainment"] },
  { name: "Bills & Utilities", value: 155.0, fill: CATEGORY_COLORS["Bills & Utilities"] },
  { name: "Shopping", value: 99.98, fill: CATEGORY_COLORS["Shopping"] },
  { name: "Healthcare", value: 90.0, fill: CATEGORY_COLORS["Healthcare"] },
  { name: "Education", value: 49.99, fill: CATEGORY_COLORS["Education"] },
  { name: "Travel", value: 250.0, fill: CATEGORY_COLORS["Travel"] },
]

const weeklyData: WeeklyExpense[] = [
  { day: "Mon", amount: 45 },
  { day: "Tue", amount: 85 },
  { day: "Wed", amount: 62 },
  { day: "Thu", amount: 28 },
  { day: "Fri", amount: 120 },
  { day: "Sat", amount: 250 },
  { day: "Sun", amount: 19 },
]

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
