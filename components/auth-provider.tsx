"use client"

import { ClerkProvider } from "@clerk/nextjs"

const hasValidClerkKey =
  typeof process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === "string" &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_") &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_placeholder"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (hasValidClerkKey) {
    return <ClerkProvider>{children}</ClerkProvider>
  }
  return <>{children}</>
}
