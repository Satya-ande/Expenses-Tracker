import type {
  AuthRequest,
  AuthResponse,
  DashboardSummary,
  Expense,
  ExpenseCreateRequest,
  ExpenseUpdateRequest,
  MonthlyExpense,
  CategoryExpense,
  WeeklyExpense,
  UserSettings,
} from "./types"

// ─── Base Configuration ──────────────────────────────────────────
// Point this to your Spring Boot backend URL.
// In production, set NEXT_PUBLIC_API_BASE_URL in your environment.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api"

// ─── HTTP helper ─────────────────────────────────────────────────

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) ?? {}),
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(
      (body as { message?: string }).message ?? res.statusText,
      res.status
    )
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T

  return res.json() as Promise<T>
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

// ─── Auth ────────────────────────────────────────────────────────

export const authApi = {
  login: (data: AuthRequest) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: AuthRequest & { name: string }) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () => {
    if (typeof window !== "undefined") localStorage.removeItem("token")
  },
}

// ─── Dashboard ───────────────────────────────────────────────────

export const dashboardApi = {
  getSummary: () => request<DashboardSummary>("/dashboard/summary"),
  getMonthlyExpenses: () =>
    request<MonthlyExpense[]>("/dashboard/monthly-expenses"),
  getCategoryExpenses: () =>
    request<CategoryExpense[]>("/dashboard/category-expenses"),
  getWeeklyExpenses: () =>
    request<WeeklyExpense[]>("/dashboard/weekly-expenses"),
}

// ─── Expenses ────────────────────────────────────────────────────

export const expensesApi = {
  getAll: (params?: { search?: string; category?: string; dateRange?: string }) => {
    const query = new URLSearchParams()
    if (params?.search) query.set("search", params.search)
    if (params?.category && params.category !== "all")
      query.set("category", params.category)
    if (params?.dateRange && params.dateRange !== "all")
      query.set("dateRange", params.dateRange)
    const qs = query.toString()
    return request<Expense[]>(`/expenses${qs ? `?${qs}` : ""}`)
  },

  getById: (id: number) => request<Expense>(`/expenses/${id}`),

  create: (data: ExpenseCreateRequest) =>
    request<Expense>("/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: ExpenseUpdateRequest) =>
    request<Expense>(`/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`/expenses/${id}`, { method: "DELETE" }),

  getRecent: (limit = 7) =>
    request<Expense[]>(`/expenses/recent?limit=${limit}`),

  getTopByAmount: (limit = 5) =>
    request<Expense[]>(`/expenses/top?limit=${limit}`),
}

// ─── Settings ────────────────────────────────────────────────────

export const settingsApi = {
  get: () => request<UserSettings>("/settings"),
  update: (data: Partial<UserSettings>) =>
    request<UserSettings>("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteAccount: () =>
    request<void>("/settings/account", { method: "DELETE" }),
}

// ─── SWR Fetcher ─────────────────────────────────────────────────
// Use as the default fetcher for SWR: <SWRConfig value={{ fetcher }}>
export const fetcher = <T,>(url: string) => request<T>(url)
