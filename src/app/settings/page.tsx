"use client"

import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

export default function DeleteAccount() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/user/delete", {
        method: "POST",
      })

      if (res.ok) {
        // logout and redirect to homepage
        await signOut({ callbackUrl: "/" })
      } else {
        console.error("Failed to delete account")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white p-6">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="w-full max-w-sm bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600"
          >
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white dark:bg-zinc-900 dark:text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black dark:text-white">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-600 dark:text-zinc-400">
              This action cannot be undone. Your account will be permanently
              marked as deleted and you will be signed out.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600"
            >
              {loading ? "Deleting..." : "Yes, delete my account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
