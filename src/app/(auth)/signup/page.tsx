import { SignUpForm } from "@/components/authentication/signup-form"
import Navbar from "@/components/header";

export default function SignUpPage() {
  return (
    <>
<Navbar />    
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
    </>
  )
}