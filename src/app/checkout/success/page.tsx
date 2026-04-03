import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { clearCart } from "@/lib/cart"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"
import { CheckCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Stripe from "stripe"

async function sendPurchaseConfirmationEmail(to: string, userName: string, courseNames: string[]) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    secure: process.env.EMAIL_SERVER_SECURE === "true",
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })

  const courseList = courseNames.map((course) => `<div style="margin-bottom: 8px;">• ${course}</div>`).join("")

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER,
    to: to,
    subject: "Purchase Confirmation - Thryve.Today",
    html: `
<div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;">
  <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 48px 40px; position: relative;">
    <div style="color: white; font-size: 13px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; opacity: 0.9; margin-bottom: 12px;">Purchase Confirmed</div>
    <div style="color: white; font-size: 24px; font-weight: 600;">Thryve.Today Medical Training</div>
  </div>
  <div style="padding: 48px 40px;">
    <div style="margin-bottom: 30px;">
      <div style="color: #1e293b; font-size: 20px; font-weight: 600; margin-bottom: 16px;">Hello ${userName},</div>
      <div style="color: #475569; font-size: 16px; line-height: 1.6;">
        Thank you for your purchase! Your enrollment is now complete.
      </div>
    </div>

    <div style="background: #f0fdf4; border-radius: 16px; padding: 32px; margin-bottom: 30px;">
      <div style="color: #059669; font-size: 14px; font-weight: 600; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px;">Courses Purchased</div>
      <div style="color: #334155; font-size: 15px; line-height: 1.8;">
        ${courseList}
      </div>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://thryve.today'}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        View My Courses
      </a>
    </div>

    <div style="color: #64748b; font-size: 14px; line-height: 1.6;">
      You can access your courses by logging into your account. If you have any questions, please contact our support team.
    </div>
  </div>
  <div style="padding: 24px; text-align: center; color: #94a3b8; font-size: 14px; border-top: 1px solid #f1f5f9;">
    <p style="margin: 0;">© ${new Date().getFullYear()} Thryve.Today. All rights reserved.</p>
  </div>
</div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

// Update both params and searchParams to be Promises
interface PageProps {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function CheckoutSuccessPage({ params, searchParams }: PageProps) {
  // Await both params and searchParams
  await params
  const resolvedSearchParams = await searchParams

  const session = await getServerSession(authOptions)
  const session_id = resolvedSearchParams.session_id as string | undefined

  if (!session?.user?.id) {
    redirect("/log-in?callbackUrl=/checkout/success")
  }

  if (!session_id) {
    redirect("/cart")
  }

  console.log("Processing checkout success for session:", session_id)
  console.log("User ID:", session.user.id)

  // Verify the Stripe session
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
  })

  let emailSent = false
  let emailError = null
  const purchasedCourses: { id: string; name: string }[] = []

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id)
    console.log("Stripe session payment status:", stripeSession.payment_status)

    if (stripeSession.payment_status !== "paid") {
      throw new Error("Payment not completed")
    }

    // Get course IDs from metadata
    const courseIds = stripeSession.metadata?.courseIds ? JSON.parse(stripeSession.metadata.courseIds) : []
    console.log("Course IDs from metadata:", courseIds)

    // Update enrollment records for each course
    for (const courseId of courseIds) {
      // Find the course to get its price
      const course = await prisma.courses.findUnique({
        where: { id: courseId },
        select: { id: true, name: true, price: true },
      })

      if (!course) {
        console.error(`Course with ID ${courseId} not found`)
        continue
      }

      console.log(`Found course: ${course.name} (${course.id}) - Price: ${course.price}`)

      // Add course to purchased courses list for email
      if (course.name) {
        purchasedCourses.push({ id: courseId, name: course.name })
      }

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
        console.log(`Updating enrollment: ${existingEnrollment.id}`)
        // Update existing enrollment with the specific course price
        await prisma.enrollment.update({
          where: { id: existingEnrollment.id },
          data: {
            paymentStatus: "COMPLETED",
            paymentId: stripeSession.id,
            paymentAmount: course.price, // Use the specific course price
            paymentDate: new Date(),
          },
        })
      } else {
        console.error(`No enrollment found for user ${session.user.id} and course ${courseId}`)
      }
    }

    // Get user details for email
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, name: true },
    })

    console.log("User details for email:", user)

    if (user && user.email) {
      try {
        // Send confirmation email
        const courseNames = purchasedCourses.map((course) => course.name)
        await sendPurchaseConfirmationEmail(user.email, user.name || "", courseNames)
        emailSent = true
      } catch (emailErr) {
        console.error("Error in email sending process:", emailErr)
        emailError = emailErr instanceof Error ? emailErr.message : String(emailErr)
      }
    }

    // Clear the cart after successful payment
    await clearCart()
  } catch (error) {
    console.error("Error processing successful checkout:", error)
    // We'll still show the success page, but log the error
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md relative">
        {/* Decorative elements */}
        <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 dark:opacity-10 blur-xl animate-pulse"></div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-tr from-blue-400 to-teal-500 rounded-full opacity-20 dark:opacity-10 blur-xl animate-pulse delay-700"></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Success card content */}
          <div className="p-8">
            {/* Success icon with animated background */}
            <div className="mb-8 relative">
              <div
                className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-10 dark:opacity-20 animate-ping"
                style={{ animationDuration: "3s" }}
              ></div>
              <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-500 p-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            </div>
            {/* Text content */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500 bg-clip-text text-transparent">
                Payment Successful!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Thank you for your purchase.</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Your courses are now available in your account.
              </p>

              {/* Email notification */}
              <div className="mt-4 flex items-center justify-center text-sm">
                <p className="text-gray-600 dark:text-gray-300">
                  {emailSent
                    ? "We've sent you a email. Please check your inbox."
                    : "A confirmation email will be sent to your registered email address."}
                </p>
              </div>

              {/* Show error message if email failed */}
              {emailError && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  Note: There might be a delay in receiving the email. If you dont receive it, please contact support.
                </p>
              )}
            </div>
            {/* Divider with sparkle */}
            <div className="relative flex items-center justify-center my-8">
              <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex-shrink-0 mx-2 p-1 bg-gray-50 dark:bg-gray-800 rounded-full">
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
              <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
            </div>
            {/* Action buttons */}
            <div className="space-y-4">
              <Link href="/dashboard" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 border-0 text-white font-medium py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg">
                  Go to My Courses
                </Button>
              </Link>
              <Link href="/courses" className="block">
                <Button
                  variant="outline"
                  className="w-full border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 font-medium py-2.5 rounded-xl transition-all duration-200"
                >
                  Browse More Courses
                </Button>
              </Link>
            </div>
          </div>
          {/* Bottom decoration */}
          <div className="h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>
        </div>
      </div>
    </div>
  )
}
