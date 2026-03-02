import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  try {
    const { userId } = await auth()
    if (userId) redirect("/dashboard")
  } catch {
    // Clerk not configured - show landing
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        <div className="flex items-center justify-center size-14 rounded-xl bg-primary shadow-lg">
          <Wallet className="size-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            ExpenseFlow
          </h1>
          <p className="text-muted-foreground mt-2">
            Track and manage your expenses with a modern, intuitive dashboard
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
