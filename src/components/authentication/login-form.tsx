"use client"

import type React from "react"

import { GalleryVerticalEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      if (session?.user?.role === "ADMIN") {
        router.push("/admin-dashboard")
      } else {
        router.push("/dashboard")
      }
    }
  }, [session, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    })

    if (response?.error) {
      toast.error(`Invalid credentials - ${response?.error}`)
      setLoading(false)
      return
    }

    toast.success("Logged in successfully!")

    // Get the session to check user role
    const sessionRes = await fetch("/api/auth/session")
    const sessionData = await sessionRes.json()

    // Redirect based on user role
    if (sessionData?.user?.role === "ADMIN") {
      router.push("/admin-dashboard")
    } else {
      router.push("/dashboard")
    }

    router.refresh()
    setLoading(false)
  }

  const handleGoogleSignIn = () => {
    setLoading(true)
    signIn("google", { redirect: false })
      .then((response) => {
        if (response?.error) {
          toast.error("Failed to sign in with Google")
          setLoading(false)
          return
        }

        // Get the session to check user role
        fetch("/api/auth/session")
          .then((res) => res.json())
          .then((sessionData) => {
            if (sessionData?.user?.role === "ADMIN") {
              router.push("/admin-dashboard")
            } else {
              router.push("/dashboard")
            }
            router.refresh()
          })
          .catch((error) => {
            console.error("Error fetching session:", error)
            // Default redirect if something goes wrong
            router.push("/dashboard")
          })
          .finally(() => {
            setLoading(false)
          })
      })
      .catch((error) => {
        console.error("Google sign-in error:", error)
        toast.error("Failed to sign in with Google")
        setLoading(false)
      })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link href="/" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Thryve.Today</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to Thryve.Today</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" placeholder="name@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input name="password" id="password" type="password" placeholder="Your password here" required />
              <div className="text-right text-sm">
                <Link href="/forgot-password" className="text-muted-foreground hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </Button>
          </div>
        </div>
      </form>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">Or</span>
      </div>
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            fill="currentColor"
          />
        </svg>
        Continue with Google
      </Button>
    </div>
  )
}

