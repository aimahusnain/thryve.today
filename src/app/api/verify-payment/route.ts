import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import Stripe from "stripe"

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
})

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid") {
      // Get the enrollmentId from the session metadata
      const enrollmentId = session.metadata?.enrollmentId

      if (enrollmentId) {
        // Update the enrollment record in the database
        await prisma.enrollment.update({
          where: {
            id: enrollmentId,
          },
          data: {
            paymentStatus: "COMPLETED",
            paymentId: session.id,
            paymentAmount: session.amount_total ? session.amount_total / 100 : null,
            paymentDate: new Date(),
          },
        })
      }

      return NextResponse.json({ verified: true })
    } else {
      return NextResponse.json({ verified: false })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

