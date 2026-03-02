import { SignUp } from "@clerk/nextjs"
import Link from "next/link"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

const hasClerk =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_") &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_placeholder"

export default function SignUpPage() {
  if (!hasClerk) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 gap-4">
        <Wallet className="size-12 text-primary" />
        <h1 className="text-xl font-semibold">Clerk not configured</h1>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to .env.local to enable auth.
        </p>
        <Button asChild>
          <Link href="/sign-in">Go to Sign In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg border border-border",
          },
        }}
        fallbackRedirectUrl="/dashboard"
        signInUrl="/sign-in"
      />
    </div>
  )
}
