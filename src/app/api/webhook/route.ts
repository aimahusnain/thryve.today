// app/api/webhook/route.ts
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

// Disable the body parser for this route as we need the raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const sig = req.headers.get("Stripe-Signature");

    if (!sig) {
      return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
    }

    // Verify the event
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("Event received:", event.type);

    // Handle specific events
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Extract the enrollment ID from metadata
      const enrollmentId = session.metadata?.enrollmentId;
      
      if (enrollmentId) {
        console.log(`Updating enrollment ${enrollmentId} to COMPLETED`);
        
        // Update the enrollment record in your database
        await prisma.enrollment.update({
          where: { id: enrollmentId },
          data: {
            paymentStatus: "COMPLETED",
            paymentId: session.payment_intent as string,
            paymentAmount: session.amount_total ? session.amount_total / 100 : 999.00,
            paymentDate: new Date(),
          },
        });
        
        console.log(`Enrollment ${enrollmentId} updated successfully`);
      } else {
        console.log("No enrollmentId found in metadata");
      }
    }

    return NextResponse.json({ status: "success", event: event.type });
  } catch (error) {
    console.error('Webhook error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ status: "Failed", error: error.message }, { status: 400 });
    }
    return NextResponse.json({ status: "Failed", error: "Unknown error" }, { status: 400 });
  } finally {
    await prisma.$disconnect();
  }
}