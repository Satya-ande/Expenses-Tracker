/**
 * Expense mutations for Track B. Uses mock store when API is disabled.
 * When Track A merges, set NEXT_PUBLIC_USE_API=true and these will use the real API.
 */
import { useSWRConfig } from "swr"
import { expensesApi } from "@/lib/api"
import { mockStore } from "@/lib/mock-store"
import type { ExpenseCreateRequest, Expense } from "@/lib/types"

const USE_API = process.env.NEXT_PUBLIC_USE_API === "true"

function revalidateExpenses(mutate: (key: string | ((k: string) => boolean), data?: unknown, opts?: { revalidate?: boolean }) => Promise<unknown>) {
  return Promise.all([
    mutate((k: string) => typeof k === "string" && k.startsWith("expenses"), undefined, { revalidate: true }),
    mutate("dashboard-summary", undefined, { revalidate: true }),
    mutate("monthly-expenses", undefined, { revalidate: true }),
    mutate("category-expenses", undefined, { revalidate: true }),
    mutate("weekly-expenses", undefined, { revalidate: true }),
  ])
}

export function useExpenseMutations() {
  const { mutate } = useSWRConfig()

  const addExpense = async (payload: ExpenseCreateRequest): Promise<Expense> => {
    if (USE_API) {
      const expense = await expensesApi.create(payload)
      await revalidateExpenses(mutate)
      return expense
    }
    const expense = mockStore.add(payload)
    await revalidateExpenses(mutate)
    return expense
  }

  const deleteExpense = async (id: number): Promise<void> => {
    if (USE_API) {
      await expensesApi.delete(id)
    } else {
      mockStore.remove(id)
    }
    await revalidateExpenses(mutate)
  }

  return { addExpense, deleteExpense }
}
