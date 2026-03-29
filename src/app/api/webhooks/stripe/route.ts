import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"
import { headers } from "next/headers"

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature") as string

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
  })

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    // Extract user and course information from metadata
    const userId = session.metadata?.userId
    const courseIds = session.metadata?.courseIds ? JSON.parse(session.metadata.courseIds) : []

    if (!userId || courseIds.length === 0) {
      console.error("Missing user ID or course IDs in session metadata")
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
    }

    try {
      // Update enrollment records for each course
      for (const courseId of courseIds) {
        // Find the course to get its price
        const course = await prisma.courses.findUnique({
          where: { id: courseId },
        })

        if (!course) {
          console.error(`Course with ID ${courseId} not found`)
          continue
        }

        // Find existing enrollment using user ID and course ID
        const existingEnrollment = await prisma.enrollment.findFirst({
          where: {
            userId: userId,
            courseId: courseId,
          },
          orderBy: {
            createdAt: "desc",
          },
        })

        if (existingEnrollment) {
          // Update existing enrollment with the specific course price
          await prisma.enrollment.update({
            where: { id: existingEnrollment.id },
            data: {
              paymentStatus: "COMPLETED",
              paymentId: session.id,
              paymentAmount: course.price, // Use the specific course price
              paymentDate: new Date(),
            },
          })
        } else {
          console.error(`No enrollment found for user ${userId} and course ${courseId}`)
        }
      }

      // Clear the user's cart after successful payment
      const cart = await prisma.cart.findUnique({
        where: { userId },
      })

      if (cart) {
        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id },
        })
      }

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Error processing webhook:", error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to process webhook" },
        { status: 500 },
      )
    }
  }

  return NextResponse.json({ received: true })
}

