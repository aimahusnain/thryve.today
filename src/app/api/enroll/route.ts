// app/api/enroll/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Get the host from the request headers
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Create enrollment record with all required fields
    const enrollment = await prisma.enrollment.create({
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
    });

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Nursing Assistant Program Enrollment',
              description: 'Enrollment fee for Nursing Assistant Training Program',
            },
            unit_amount: 99900, // $999.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/courses/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/courses?canceled=true`,
      customer_email: body.email,
      metadata: {
        enrollmentId: enrollment.id,
        studentName: body.studentName,
      },
    });

    return NextResponse.json({ 
      message: "Enrollment submitted successfully", 
      enrollment,
      checkoutUrl: session.url
    }, { status: 201 });
  } catch (error) {
    console.error("Error submitting enrollment:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to submit enrollment" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}