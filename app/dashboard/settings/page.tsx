"use client"

import { useState, useEffect } from "react"
import { useSWRConfig } from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSettings } from "@/hooks/use-expenses"
import { settingsApi } from "@/lib/api"
import { PlaidLinkButton } from "@/components/plaid-link-button"

export default function SettingsPage() {
  const { mutate } = useSWRConfig()
  const { data: settings } = useSettings()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currency, setCurrency] = useState("inr")
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [budgetAlerts, setBudgetAlerts] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Sync form state with SWR data
  useEffect(() => {
    if (settings) {
      setName(settings.name)
      setEmail(settings.email)
      setCurrency(settings.currency)
      setEmailNotifs(settings.emailNotifications)
      setBudgetAlerts(settings.budgetAlerts)
    }
  }, [settings])

  async function handleSave() {
    setSaving(true)
    try {
      // Replace with real API call once Spring Boot is running:
      await settingsApi.update({
        name,
        email,
        currency,
        emailNotifications: emailNotifs,
        budgetAlerts,
      })

      await mutate("settings")
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // Handle error
    } finally {
      setSaving(false)
    }
  }

  if (!settings) return null

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Profile */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">Profile</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-email">Email</Label>
            <Input
              id="settings-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button className="self-end" onClick={handleSave} disabled={saving}>
            {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Bank Connections */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Bank Connections
          </CardTitle>
          <CardDescription>
            Connect your bank to automatically sync transactions (Track A backend)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlaidLinkButton />
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Preferences
          </CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label>Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
                <SelectItem value="gbp">GBP</SelectItem>
                <SelectItem value="inr">INR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-card-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground">
                Receive weekly expense summaries
              </p>
            </div>
            <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-card-foreground">Budget Alerts</p>
              <p className="text-xs text-muted-foreground">
                Get notified when spending exceeds budget
              </p>
            </div>
            <Switch checked={budgetAlerts} onCheckedChange={setBudgetAlerts} />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="shadow-sm border-destructive/30">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" size="sm">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
