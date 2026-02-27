"use client"

import { SummaryCards } from "@/components/summary-cards"
import { MonthlyChart } from "@/components/monthly-chart"
import { CategoryChart } from "@/components/category-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import {
  useDashboardSummary,
  useMonthlyExpenses,
  useCategoryExpenses,
  useRecentExpenses,
} from "@/hooks/use-expenses"

export default function DashboardPage() {
  const { data: summary } = useDashboardSummary()
  const { data: monthlyData } = useMonthlyExpenses()
  const { data: categoryData } = useCategoryExpenses()
  const { data: recentExpenses } = useRecentExpenses(7)

  if (!summary || !monthlyData || !categoryData || !recentExpenses) return null

  return (
    <div className="flex flex-col gap-6">
      <SummaryCards data={summary} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyChart data={monthlyData} />
        <CategoryChart data={categoryData} />
      </div>
      <RecentTransactions expenses={recentExpenses} />
    </div>
  )
}
