import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  // Protect this page - redirect to login if not authenticated
  if (!session) {
    redirect("/log-in")
  }

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Welcome, {session?.user?.name}!</h2>
        <p>You&apos;ve successfully logged in with Google.</p>
        <div className="mt-4">
          <h3 className="text-lg font-medium">Your Profile:</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <strong>Name:</strong> {session?.user?.name}
            </li>
            <li>
              <strong>Email:</strong> {session?.user?.email}
            </li>
            {/* <li>
              <strong>Role:</strong> {session?.user?.role || "User"}
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  )
}

