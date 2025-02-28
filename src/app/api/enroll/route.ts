import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

// export const maxDuration = 300 // Set max duration to 5 minutes
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const host = request.headers.get("host") || "thryve-today.vercel.app"
    const protocol = host.includes("localhost") ? "http" : "https"
    const baseUrl = `${protocol}://${host}`

    // Create enrollment and Stripe session in parallel
    const [enrollment, session] = await Promise.all([
      prisma.enrollment.create({
        data: {
          studentName: body.studentName,
          dateOfBirth: body.dateOfBirth,
          address: body.address,
          cityStateZip: body.cityStateZip,
          phoneHome: body.phoneHome,
          phoneCell: body.phoneCell,
          email: body.email,
          socialSecurity: body.socialSecurity,
          stateId: body.stateId,
          emergencyContact: body.emergencyContact,
          emergencyRelationship: body.emergencyRelationship,
          emergencyPhone: body.emergencyPhone,
          studentSignature: body.studentSignature,
          studentSignatureDate: new Date(body.studentSignatureDate),
          directorSignature: body.directorSignature,
          directorSignatureDate: new Date(body.directorSignatureDate),
          guardianSignature: body.guardianSignature || null,
          guardianSignatureDate: body.guardianSignatureDate ? new Date(body.guardianSignatureDate) : null,
          paymentStatus: "PENDING",
          paymentId: null,
          paymentAmount: null,
          paymentDate: null,
        },
      }),

      stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Nursing Assistant Program Enrollment",
                description: "Enrollment fee for Nursing Assistant Training Program",
              },
              unit_amount: 99900,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${baseUrl}/courses/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/courses?canceled=true`,
        customer_email: body.email,
        metadata: {
          enrollmentId: null, // Will update after creation
          studentName: body.studentName,
        },
      }),
    ])

    // Update session metadata with enrollment ID
    await stripe.checkout.sessions.update(session.id, {
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
      { status: 201 },
    )
  } catch (error) {
    console.error("Error submitting enrollment:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: `Failed to submit enrollment - ${error}` }, { status: 500 })
  }
}

