import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export const config = {
  runtime: "nodejs",
  regions: ["iad1"], // Use the region closest to your database
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const enrollment = await prisma.enrollment.create({
      data: {
        ...data,
      },
    })

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Enrollment Fee",
            },
            unit_amount: 5000, // $50.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      metadata: {
        enrollmentId: enrollment.id,
      },
    })

    return NextResponse.json(
      {
        message: "Enrollment submitted successfully",
        enrollment,
        checkoutUrl: session.url,
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      },
    )
  } catch (error) {
    console.error("Error submitting enrollment:", error)
    return NextResponse.json({ message: error }, { status: 500 })
  }
}

