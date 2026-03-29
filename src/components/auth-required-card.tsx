"use client"

import { useRouter } from "next/navigation"
import { LockKeyhole, LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function AuthRequiredCard() {
  const router = useRouter()

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-border shadow-lg animate-in fade-in-50 zoom-in-95 duration-300">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
            <LockKeyhole className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Authentication Required</CardTitle>
          <CardDescription className="text-muted-foreground">
            You need to be logged in to submit this enrollment form
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div
            className={cn(
              "p-4 rounded-lg border bg-card text-card-foreground shadow-sm",
              "dark:bg-muted/30 dark:border-muted",
            )}
          >
            <p className="text-sm leading-relaxed">
              To ensure the security of your information and complete the enrollment process, please log in to your
              account or create a new one if you don&apos;t have one yet.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button onClick={() => router.push("/login")} className="w-full" size="lg">
            <LogIn className="mr-2 h-4 w-4" />
            Log In
          </Button>
          <Button onClick={() => router.push("/signup")} variant="outline" className="w-full" size="lg">
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

