import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const sig = headers().get("stripe-signature");
  const body = await req.text(); // Read raw body

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle different event types
  if (event.type === "checkout.session.completed") {
    console.log("✅ Payment successful!", event.data.object);
    // Handle successful payment (e.g., update DB, send email)
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
