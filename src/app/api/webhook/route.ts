import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

// Configure API route to handle raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

export async function POST(req: Request) {
  const headerList = await headers(); // Await the headers
  const stripeSignature = headerList.get("stripe-signature");

  if (!stripeSignature) {
    return NextResponse.json(
      { error: "Missing Stripe Signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event; // Add type annotation
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
    switch (event.type) {
      case "charge.succeeded":
        const charge = event.data.object as Stripe.Charge;
        console.log("💰 Payment succeeded:", charge.id);
        break;
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("✅ Payment intent succeeded:", paymentIntent.id);
        break;
      // Add other event types as needed
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("❌ Error processing webhook:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
