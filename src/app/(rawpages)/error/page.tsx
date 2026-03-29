import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold">Authentication Error</h1>
        <p className="mb-4 text-muted-foreground">There was an error signing in. Please try again.</p>
        <Button asChild>
          <Link href="/log-in">Back to Login</Link>
        </Button>
      </div>
    </div>
  )
}