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

    // Create enrollment record with pending payment status
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
        guardianSignature: body.guardianSignature,
        guardianSignatureDate: body.guardianSignatureDate ? new Date(body.guardianSignatureDate) : null,
        paymentStatus: "PENDING",
      },
    });

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 99900, // $999.00 in cents
      currency: "usd",
      metadata: {
        enrollmentId: enrollment.id,
        studentName: enrollment.studentName,
        email: enrollment.email
      }
    });

    return NextResponse.json({ 
      message: "Enrollment submitted successfully", 
      enrollment,
      clientSecret: paymentIntent.client_secret 
    }, { status: 201 });
  } catch (error) {
    console.error("Error submitting enrollment:", error);
    return NextResponse.json({ error: "Failed to submit enrollment" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}