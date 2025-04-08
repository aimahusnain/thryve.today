import { Suspense } from "react"
import { ResetPasswordForm } from "@/components/authentication/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<ResetPasswordFallback />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}

function ResetPasswordFallback() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md animate-pulse bg-muted"></div>
        <div className="h-7 w-32 animate-pulse rounded bg-muted"></div>
        <div className="h-5 w-48 animate-pulse rounded bg-muted"></div>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-5 w-12 animate-pulse rounded bg-muted"></div>
          <div className="h-10 w-full animate-pulse rounded bg-muted"></div>
        </div>
        <div className="space-y-2">
          <div className="h-5 w-24 animate-pulse rounded bg-muted"></div>
          <div className="h-10 w-full animate-pulse rounded bg-muted"></div>
        </div>
        <div className="space-y-2">
          <div className="h-5 w-32 animate-pulse rounded bg-muted"></div>
          <div className="h-10 w-full animate-pulse rounded bg-muted"></div>
        </div>
        <div className="h-10 w-full animate-pulse rounded bg-muted"></div>
      </div>
    </div>
  )
}
