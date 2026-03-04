"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  List,
  BarChart3,
  Settings,
  Wallet,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserButtonOrFallback } from "@/components/user-button-fallback"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const mobileNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Add Expense", href: "/dashboard/add", icon: PlusCircle },
  { label: "All Expenses", href: "/dashboard/expenses", icon: List },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function TopNavbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const pageTitle = (() => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname === "/dashboard/add") return "Add Expense"
    if (pathname === "/dashboard/expenses") return "All Expenses"
    if (pathname === "/dashboard/reports") return "Reports"
    if (pathname === "/dashboard/settings") return "Settings"
    return "Dashboard"
  })()

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
          <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="size-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 size-2 bg-destructive rounded-full" />
          </Button>

          <UserButtonOrFallback />
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/20"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="absolute top-16 left-0 right-0 bg-card border-b border-border shadow-lg">
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
              <div className="flex items-center justify-center size-8 rounded-lg bg-primary">
                <Wallet className="size-4 text-primary-foreground" />
              </div>
              <span className="text-base font-semibold text-foreground tracking-tight">
                ExpenseFlow
              </span>
            </div>
            <ul className="flex flex-col py-2">
              {mobileNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href))
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-accent text-primary"
                          : "text-foreground/70 hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <item.icon className="size-[18px]" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      )}
    </>
  )
}
