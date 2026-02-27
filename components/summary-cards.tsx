"use client"

import { DollarSign, TrendingUp, Wallet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { DashboardSummary } from "@/lib/types"
import type { LucideIcon } from "lucide-react"

// ─── Reusable stat card ──────────────────────────────────────────

interface StatCardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

function StatCard({ title, value, change, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            <span className="text-2xl font-bold text-card-foreground tracking-tight">
              {value}
            </span>
            <span className="text-xs text-muted-foreground mt-1">{change}</span>
          </div>
          <div className={`flex items-center justify-center size-10 rounded-lg ${iconBg}`}>
            <Icon className={`size-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Summary cards (receives data via props) ─────────────────────

interface SummaryCardsProps {
  data: DashboardSummary
}

export function SummaryCards({ data }: SummaryCardsProps) {
  const cards: StatCardProps[] = [
    {
      title: "Total Expenses",
      value: `$${data.totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      change: `+${data.expenseChangePercent}% from last month`,
      icon: DollarSign,
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
    },
    {
      title: "Total Income",
      value: `$${data.totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      change: `+${data.incomeChangePercent}% from last month`,
      icon: TrendingUp,
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
    {
      title: "Remaining Balance",
      value: `$${data.remainingBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      change: `${data.savingsPercent}% of income saved`,
      icon: Wallet,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  )
}
