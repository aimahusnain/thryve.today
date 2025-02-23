import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

export async function POST(req: Request) {
  const headerList = await headers(); // Get headers
  const stripeSignature = headerList.get("stripe-signature");

  if (!stripeSignature) {
    return NextResponse.json({ error: "Missing Stripe Signature" }, { status: 400 });
  }

  let event;
  try {
    const rawBody = await req.text(); // Ensure RAW body
    event = stripe.webhooks.constructEvent(
      rawBody,
      stripeSignature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`✅ Received Stripe Event: ${event.type}`, event);

  return NextResponse.json({ received: true }, { status: 200 });
}
