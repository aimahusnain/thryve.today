import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { clearCart } from "@/lib/cart"
import { prisma } from "@/lib/prisma"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Stripe from "stripe"

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/log-in?callbackUrl=/checkout/success")
  }

  const { session_id } = searchParams

  if (!session_id) {
    redirect("/cart")
  }

  // Verify the Stripe session
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
  })

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id)

    if (stripeSession.payment_status !== "paid") {
      throw new Error("Payment not completed")
    }

    // Get course IDs from metadata
    const courseIds = stripeSession.metadata?.courseIds ? JSON.parse(stripeSession.metadata.courseIds) : []

    // Create enrollment records for each course
    for (const courseId of courseIds) {
      // Check if enrollment already exists
      const existingEnrollment = await prisma.enrollment.findFirst({
        where: {
          email: session.user.email!,
          paymentId: courseId,
          paymentStatus: "COMPLETED",
        },
      })

      if (!existingEnrollment) {
        await prisma.enrollment.create({
          data: {
            studentName: session.user.name || "Unknown",
            dateOfBirth: "", // These fields would need to be collected elsewhere
            address: "",
            cityStateZip: "",
            phoneHome: "",
            phoneCell: "",
            email: session.user.email!,
            socialSecurity: "",
            stateId: "",
            emergencyContact: "",
            emergencyRelationship: "",
            emergencyPhone: "",
            studentSignature: session.user.name || "Electronic Signature",
            studentSignatureDate: new Date(),
            directorSignature: "System Enrollment",
            directorSignatureDate: new Date(),
            paymentStatus: "COMPLETED",
            paymentId: courseId, // Store the course ID in the paymentId field
            paymentAmount: stripeSession.amount_total ? stripeSession.amount_total / 100 : 0,
            paymentDate: new Date(),
          },
        })
      }
    }

    // Clear the cart after successful payment
    await clearCart()
  } catch (error) {
    console.error("Error processing successful checkout:", error)
    // We'll still show the success page, but log the error
  }

  return (
    <div className="container max-w-md mx-auto py-20 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your courses are now available in your account.
        </p>
        <div className="space-y-4">
          <Link href="/dashboard">
            <Button className="w-full">Go to My Courses</Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline" className="w-full">
              Browse More Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}