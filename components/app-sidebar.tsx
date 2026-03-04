"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  PlusCircle,
  List,
  BarChart3,
  Settings,
  Wallet,
} from "lucide-react"
import { UserButtonOrFallback } from "@/components/user-button-fallback"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Add Expense", href: "/dashboard/add", icon: PlusCircle },
  { label: "All Expenses", href: "/dashboard/expenses", icon: List },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-sidebar-border bg-sidebar min-h-screen">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center size-9 rounded-lg bg-primary">
          <Wallet className="size-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground tracking-tight">
          ExpenseFlow
        </span>
      </div>
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
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
      <div className="px-3 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3">
          <UserButtonOrFallback size="sm" />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-sidebar-foreground truncate">
              Account
            </span>
            <span className="text-xs text-muted-foreground truncate">
              Manage profile
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
