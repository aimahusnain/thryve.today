import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

export async function POST(req: Request) {
  const headerList = await headers(); // Await the headers function
  const stripeSignature = headerList.get("stripe-signature");

  if (!stripeSignature) {
    return NextResponse.json({ error: "Missing Stripe Signature" }, { status: 400 });
  }

  let event;

  try {
    const body = await req.text(); // Get raw request body
    event = stripe.webhooks.constructEvent(body, stripeSignature, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  // Handle specific Stripe events
  switch (event.type) {
    case "payment_intent.succeeded":
      console.log("💰 PaymentIntent was successful!", event.data.object);
      break;

    case "payment_intent.payment_failed":
      console.log("❌ PaymentIntent failed!", event.data.object);
      break;

    case "charge.succeeded":
      console.log("✅ Charge was successful!", event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
