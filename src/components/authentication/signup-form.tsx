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

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")
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
    setPasswordError("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const telephone = formData.get("telephone") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          telephone,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      toast.success("Account created successfully!")

      // Sign in the user after successful registration
      const signInResponse = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (signInResponse?.ok) {
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
      } else {
        // If auto sign-in fails, redirect to login page
        router.push("/log-in")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create account")
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-xl font-bold">Create your account</h1>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/log-in" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" placeholder="name@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telephone">Telephone</Label>
              <Input id="telephone" type="tel" name="telephone" placeholder="(123) 456-7890" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input name="password" id="password" type="password" placeholder="Create a password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                name="confirmPassword"
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required
              />
              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

