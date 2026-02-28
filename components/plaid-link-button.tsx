"use client"

import { usePlaidLink, PlaidLinkOptions } from "react-plaid-link"
import { Button } from "@/components/ui/button"
import { Building2, Loader2 } from "lucide-react"
import { usePlaidLinkToken } from "@/hooks/use-plaid-link-token"

export function PlaidLinkButton() {
  const { linkToken, isLoading } = usePlaidLinkToken()

  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess: (publicToken, metadata) => {
      // Track A will create /api/plaid/exchange to exchange publicToken
      void publicToken
      void metadata
      console.log("Plaid success - exchange token on backend:", publicToken)
    },
    onExit: (err) => {
      if (err) console.error("Plaid exit:", err)
    },
  }

  const { open, ready } = usePlaidLink(config)

  if (isLoading) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="size-4 mr-2 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (!linkToken) {
    return (
      <Button variant="outline" disabled title="Backend will provide link token">
        <Building2 className="size-4 mr-2" />
        Connect Bank (API pending)
      </Button>
    )
  }

  return (
    <Button variant="outline" onClick={() => open()} disabled={!ready}>
      <Building2 className="size-4 mr-2" />
      Connect Bank Account
    </Button>
  )
}
