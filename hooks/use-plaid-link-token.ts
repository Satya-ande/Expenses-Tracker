/**
 * Fetches Plaid Link token from Track A's API.
 * Returns null until /api/plaid/link-token exists.
 */
import useSWR from "swr"

async function fetcher(url: string): Promise<string | null> {
  const res = await fetch(url)
  if (!res.ok) return null
  const json = await res.json()
  return (json as { linkToken?: string }).linkToken ?? null
}

export function usePlaidLinkToken() {
  const { data, error, isLoading } = useSWR<string | null>(
    "/api/plaid/link-token",
    fetcher,
    { revalidateOnFocus: false }
  )
  return {
    linkToken: data ?? null,
    isLoading,
    error,
  }
}
