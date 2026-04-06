"use client"

import { useState } from "react"
import { CalendarIcon, Check, Receipt } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useExpenseMutations } from "@/hooks/use-expense-mutations"
import { ReceiptUpload } from "@/components/receipt-upload"
import { CATEGORIES } from "@/lib/types"
import { useSettings } from "@/hooks/use-expenses"
import type { ExpenseCreateRequest } from "@/lib/types"

type FormErrors = {
  title?: string
  amount?: string
  category?: string
  date?: string
}

export function AddExpenseForm() {
  const { addExpense } = useExpenseMutations()
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE")
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState<Date>()
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { data: settings } = useSettings()
  const currency = settings?.currency || "inr"

  function resetForm() {
    setTitle("")
    setAmount("")
    setCategory("")
    setDate(undefined)
    setNotes("")
    setSubmitted(false)
    setIsLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: FormErrors = {}

    if (!title.trim()) newErrors.title = "Title is required"
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = "Please enter a valid amount"
    if (!category) newErrors.category = "Please select a category"
    if (!date) newErrors.date = "Please select a date"

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsLoading(true)

    const payload: ExpenseCreateRequest = {
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date: format(date!, "yyyy-MM-dd"),
      type,
      notes: notes.trim() || undefined,
    }

    try {
      await addExpense(payload)
      setSubmitted(true)
      setTimeout(resetForm, 2000)
    } catch {
      setErrors({ title: "Failed to add expense. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            New {type === "INCOME" ? "Income" : "Expense"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <div className="size-12 rounded-full bg-success/10 flex items-center justify-center">
                <Check className="size-6 text-success" />
              </div>
              <p className="text-base font-medium text-card-foreground">
                Expense added successfully!
              </p>
              <p className="text-sm text-muted-foreground">
                Your expense has been recorded.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Tabs value={type} onValueChange={(v) => { setType(v as "EXPENSE" | "INCOME"); setCategory(""); }} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="EXPENSE">Expense</TabsTrigger>
                  <TabsTrigger value="INCOME">Income</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-col gap-2">
                <Label className="flex items-center gap-2">
                  <Receipt className="size-4" />
                  Upload Receipt (optional)
                </Label>
                <ReceiptUpload
                  onExtract={(data) => {
                    if (data.merchant) setTitle(data.merchant)
                    if (data.amount && data.amount > 0) setAmount(String(data.amount))
                    if (data.category) setCategory(data.category)
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Expense Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Grocery Shopping"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }))
                  }}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="amount">Amount ({currency.toUpperCase()})</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value)
                      if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }))
                    }}
                    className={errors.amount ? "border-destructive" : ""}
                  />
                  {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Category</Label>
                  <Select
                    value={category}
                    onValueChange={(val) => {
                      setCategory(val)
                      if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }))
                    }}
                  >
                    <SelectTrigger
                      className={cn("w-full", errors.category && "border-destructive")}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {(type === "INCOME" ? ['Salary', 'Bonus', 'Side Hustle', 'Other'] : CATEGORIES.filter(c => !['Salary', 'Bonus', 'Side Hustle'].includes(c))).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        errors.date && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => {
                        setDate(d)
                        if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }))
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto sm:self-end mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : `Save ${type === "INCOME" ? "Income" : "Expense"}`}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
