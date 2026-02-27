import useSWR from "swr"
import { dashboardApi, expensesApi, settingsApi } from "@/lib/api"
import { MOCK_DATA } from "@/lib/mock-data"
import type {
  DashboardSummary,
  MonthlyExpense,
  CategoryExpense,
  WeeklyExpense,
  Expense,
  UserSettings,
} from "@/lib/types"

// ─── Feature flag ────────────────────────────────────────────────
// Set to true once the Spring Boot backend is running.
const USE_API = process.env.NEXT_PUBLIC_USE_API === "true"

// ─── Helpers ─────────────────────────────────────────────────────

function useMockOrApi<T>(
  key: string | null,
  apiFn: () => Promise<T>,
  mockData: T
) {
  return useSWR<T>(key, USE_API ? () => apiFn() : () => Promise.resolve(mockData), {
    revalidateOnFocus: false,
    fallbackData: mockData,
  })
}

// ─── Dashboard hooks ─────────────────────────────────────────────

export function useDashboardSummary() {
  return useMockOrApi<DashboardSummary>(
    "dashboard-summary",
    dashboardApi.getSummary,
    MOCK_DATA.summary
  )
}

export function useMonthlyExpenses() {
  return useMockOrApi<MonthlyExpense[]>(
    "monthly-expenses",
    dashboardApi.getMonthlyExpenses,
    MOCK_DATA.monthlyData
  )
}

export function useCategoryExpenses() {
  return useMockOrApi<CategoryExpense[]>(
    "category-expenses",
    dashboardApi.getCategoryExpenses,
    MOCK_DATA.categoryData
  )
}

export function useWeeklyExpenses() {
  return useMockOrApi<WeeklyExpense[]>(
    "weekly-expenses",
    dashboardApi.getWeeklyExpenses,
    MOCK_DATA.weeklyData
  )
}

// ─── Expenses hooks ──────────────────────────────────────────────

export function useExpenses(params?: {
  search?: string
  category?: string
  dateRange?: string
}) {
  const key = params
    ? `expenses?${new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).filter(([, v]) => v && v !== "all")
        )
      ).toString()}`
    : "expenses"

  return useMockOrApi<Expense[]>(
    key,
    () => expensesApi.getAll(params),
    MOCK_DATA.expenses
  )
}

export function useRecentExpenses(limit = 7) {
  return useMockOrApi<Expense[]>(
    `expenses-recent-${limit}`,
    () => expensesApi.getRecent(limit),
    MOCK_DATA.expenses.slice(0, limit)
  )
}

export function useTopExpenses(limit = 5) {
  return useMockOrApi<Expense[]>(
    `expenses-top-${limit}`,
    () => expensesApi.getTopByAmount(limit),
    [...MOCK_DATA.expenses].sort((a, b) => b.amount - a.amount).slice(0, limit)
  )
}

// ─── Settings hook ───────────────────────────────────────────────

export function useSettings() {
  return useMockOrApi<UserSettings>(
    "settings",
    settingsApi.get,
    MOCK_DATA.settings
  )
}
