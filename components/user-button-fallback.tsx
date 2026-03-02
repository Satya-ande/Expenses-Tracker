"use client"

import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"

const hasClerk =
  typeof process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === "string" &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_") &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_placeholder"

export function UserButtonOrFallback({ size = "md" }: { size?: "sm" | "md" }) {
  const boxSize = size === "sm" ? "size-8" : "size-9"

  if (hasClerk) {
    return (
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: boxSize,
          },
        }}
      />
    )
  }

  return (
    <Button variant="ghost" size="icon" className={boxSize} asChild>
      <Link href="/dashboard/settings" aria-label="Account">
        <div className={`${boxSize} rounded-full bg-primary/10 flex items-center justify-center`}>
          <User className="size-4 text-primary" />
        </div>
      </Link>
    </Button>
  )
}
