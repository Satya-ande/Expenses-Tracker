"use client"

import { useState, useMemo } from "react"
import { Search, Pencil, Trash2 } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useExpenses } from "@/hooks/use-expenses"
import { useExpenseMutations } from "@/hooks/use-expense-mutations"
import { CATEGORIES, CATEGORY_BADGE_CLASSES } from "@/lib/types"
import type { Expense } from "@/lib/types"

export function ExpensesTable() {
  const { deleteExpense } = useExpenseMutations()
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const { data: expenseList = [] } = useExpenses({
    search,
    category: categoryFilter,
    dateRange: dateFilter,
  })

  // Client-side filtering as a fallback (when using mock data).
  // Spring Boot will handle server-side filtering when USE_API=true.
  const filtered = useMemo(() => {
    return expenseList.filter((expense) => {
      const matchesSearch =
        !search ||
        expense.title.toLowerCase().includes(search.toLowerCase()) ||
        expense.category.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        categoryFilter === "all" || expense.category === categoryFilter

      let matchesDate = true
      if (dateFilter === "week") {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        matchesDate = new Date(expense.date) >= weekAgo
      } else if (dateFilter === "month") {
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        matchesDate = new Date(expense.date) >= monthAgo
      }

      return matchesSearch && matchesCategory && matchesDate
    })
  }, [expenseList, search, categoryFilter, dateFilter])

  async function handleDelete(expense: Expense) {
    try {
      await deleteExpense(expense.id)
    } catch {
      // Handle error — e.g., show a toast
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            All Expenses
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {filtered.length} expense{filtered.length !== 1 ? "s" : ""} found
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="pl-4">Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    No expenses found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="pl-4 font-medium text-card-foreground">
                      {expense.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`font-normal ${CATEGORY_BADGE_CLASSES[expense.category] ?? CATEGORY_BADGE_CLASSES.Other}`}
                      >
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-card-foreground tabular-nums">
                      ${expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(parseISO(expense.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label={`Edit ${expense.title}`}
                        >
                          <Pencil className="size-3.5 text-muted-foreground" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              aria-label={`Delete ${expense.title}`}
                            >
                              <Trash2 className="size-3.5 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &ldquo;{expense.title}&rdquo;?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(expense)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
