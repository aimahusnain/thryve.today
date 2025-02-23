import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const headerList = await headers();
  const stripeSignature = headerList.get("stripe-signature");

  if (!stripeSignature) {
    return NextResponse.json({ error: "Missing Stripe Signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      stripeSignature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error(`❌ Webhook signature verification failed: ${err}`);
    return NextResponse.json({ error: err }, { status: 400 });
  }

  try {
    if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge;
      
      // Extract the enrollment ID from metadata (you'll need to add this when creating the payment)
      const enrollmentId = charge.metadata.enrollmentId;
      
      if (enrollmentId) {
        // Update the enrollment record
        await prisma.enrollment.update({
          where: {
            id: enrollmentId
          },
          data: {
            paymentStatus: 'COMPLETED',
            paymentId: charge.id,
            paymentAmount: charge.amount / 100, // Convert from cents to dollars
            paymentDate: new Date()
          }
        });
        
        console.log(`✅ Payment recorded for enrollment ${enrollmentId}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error('❌ Error processing webhook:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}