"use client"

import { useState } from "react"
import { Eye, EyeOff, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggler";


export default function SecuritySettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("••••••••••••")
  const [newPassword, setNewPassword] = useState("")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-[100px] p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-xl font-semibold">Security</h1>
          <p className="text-sm text-muted-foreground">Manage your account security and devices.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-sm font-medium">Password</h2>
            <p className="text-sm text-muted-foreground">Set a password to protect your account.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-sm text-muted-foreground">
                Current password
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pr-10 border-zinc-800"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-green-500">
                <Check className="h-3.5 w-3.5" />
                <span>Very secure</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm text-muted-foreground">
                New password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border-zinc-800"
              />
            </div>

            <Button variant="outline" className="border-zinc-800">
              Save new password
            </Button>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium">Two-step verification</h2>
              <p className="text-sm text-muted-foreground">
                We recommend requiring a verification code in addition to your password.
              </p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium">Light/Dark Mode</h2>
              <p className="text-sm text-muted-foreground">We recommend to use Dark Mode.</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}

