import { Suspense } from "react"
import { VerifyOtpForm } from "@/components/authentication/verify-otp-form"

export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<VerifyOtpFallback />}>
          <VerifyOtpForm />
        </Suspense>
      </div>
    </div>
  )
}

function VerifyOtpFallback() {
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
          <div className="h-5 w-12 animate-pulse rounded bg-muted"></div>
          <div className="h-12 w-full flex justify-center animate-pulse rounded bg-muted"></div>
        </div>
        <div className="h-10 w-full animate-pulse rounded bg-muted"></div>
      </div>
      <div className="h-5 w-48 mx-auto animate-pulse rounded bg-muted"></div>
    </div>
  )
}
