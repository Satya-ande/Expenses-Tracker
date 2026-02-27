"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import type { Expense } from "@/lib/types"
import { CATEGORY_BADGE_CLASSES } from "@/lib/types"

interface RecentTransactionsProps {
  expenses: Expense[]
}

export function RecentTransactions({ expenses }: RecentTransactionsProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-card-foreground">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right pr-6">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="pl-6 font-medium text-card-foreground">
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
                <TableCell className="text-muted-foreground">
                  {format(parseISO(expense.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right pr-6 font-semibold text-card-foreground tabular-nums">
                  ${expense.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
