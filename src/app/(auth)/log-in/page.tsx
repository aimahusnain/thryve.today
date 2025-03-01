import { LoginForm } from "@/components/authentication/login-form";
import Navbar from "@/components/header";

export default function LoginPage() {
  return (
<>
<Navbar />
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
</>    
  )
}