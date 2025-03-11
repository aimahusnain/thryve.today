import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { clearCart } from "@/lib/cart"
import { prisma } from "@/lib/prisma"
import { CheckCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Stripe from "stripe"

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }> | { session_id?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/log-in?callbackUrl=/checkout/success")
  }

  // Await searchParams if it's a Promise
  const params = searchParams instanceof Promise ? await searchParams : searchParams
  const session_id = params.session_id

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

    // Update enrollment records for each course
    for (const courseId of courseIds) {
      // Find existing enrollment using user ID and course ID
      const existingEnrollment = await prisma.enrollment.findFirst({
        where: {
          userId: session.user.id,
          courseId: courseId,
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      if (existingEnrollment) {
        // Update existing enrollment
        await prisma.enrollment.update({
          where: { id: existingEnrollment.id },
          data: {
            paymentStatus: "COMPLETED",
            paymentId: stripeSession.id,
            paymentAmount: stripeSession.amount_total ? stripeSession.amount_total / 100 : undefined,
            paymentDate: new Date(),
          },
        })
      } else {
        console.error(`No enrollment found for user ${session.user.id} and course ${courseId}`)
      }
    }

    // Clear the cart after successful payment
    await clearCart()
  } catch (error) {
    console.error("Error processing successful checkout:", error)
    // We'll still show the success page, but log the error
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 mt-[70px]">
      <div className="w-full max-w-md relative">
        {/* Decorative elements */}
        <div className="absolute -top-6 -left-6 w-16 h-16 bg-green-400 rounded-full opacity-20 dark:opacity-10 blur-xl animate-pulse"></div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-green-500 rounded-full opacity-20 dark:opacity-10 blur-xl animate-pulse delay-700"></div>

        <div className="relative bg-white dark:bg-black rounded-2xl shadow-xl overflow-hidden">
          {/* Success card content */}
          <div className="p-8">
            {/* Success icon with animated background */}
            <div className="mb-8 relative">
              <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-green-500 p-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Text content */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2 text-green-600 dark:text-green-500">
                Payment Successful!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Thank you for your purchase.</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Your courses are now available in your account.
              </p>
            </div>

            {/* Divider with sparkle */}
            <div className="relative flex items-center justify-center my-8">
              <div className="flex-grow h-px bg-green-100 dark:bg-green-900"></div>
              <div className="flex-shrink-0 mx-2 p-1 bg-green-50 dark:bg-green-900 rounded-full">
                <Sparkles className="h-4 w-4 text-green-400" />
              </div>
              <div className="flex-grow h-px bg-green-100 dark:bg-green-900"></div>
            </div>

            {/* Action buttons */}
            <div className="space-y-4">
              <Link href="/dashboard" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 border-0 text-white font-medium py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg">
                  Go to My Courses
                </Button>
              </Link>
              <Link href="/courses" className="block">
                <Button
                  variant="outline"
                  className="w-full border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 bg-transparent hover:bg-green-50 dark:hover:bg-green-900 font-medium py-2.5 rounded-xl transition-all duration-200"
                >
                  Browse More Courses
                </Button>
              </Link>
            </div>
          </div>

          {/* Bottom decoration */}
          <div className="h-1.5 bg-green-500"></div>
        </div>
      </div>
    </div>
  )
}