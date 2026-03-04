/**
 * Client-side mock store for Track B development.
 * Persists additions/deletions in memory. Replace with API calls when Track A merges.
 */
import type { Expense, ExpenseCreateRequest } from "./types"
import { MOCK_DATA } from "./mock-data"

let additions: Expense[] = []
let nextId = 1000
const deletions = new Set<number>()

function generateId() {
  return nextId++
}

export const mockStore = {
  getAll(): Expense[] {
    const base = MOCK_DATA.expenses.filter((e) => !deletions.has(e.id))
    return [...base, ...additions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  },

  add(payload: ExpenseCreateRequest): Expense {
    const expense: Expense = {
      id: generateId(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    additions.push(expense)
    return expense
  },

  remove(id: number): void {
    const inAdditions = additions.findIndex((e) => e.id === id)
    if (inAdditions >= 0) {
      additions.splice(inAdditions, 1)
    } else {
      deletions.add(id)
    }
  },
}
