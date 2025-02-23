import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const rawBody = await req.text(); // Get raw body

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("✅ Webhook received:", event.type);

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
