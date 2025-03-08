import { authOptions } from "@/lib/auth"
import { getUserCart } from "@/lib/cart"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
})

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user's cart
    const cart = await getUserCart()

    if (cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Create line items for Stripe
    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.course.name,
          description: `Duration: ${item.course.duration}`,
        },
        unit_amount: Math.round(item.course.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Create a Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: {
        userId: session.user.id,
        cartId: cart.id,
      },
    })

    return NextResponse.json({ checkoutUrl: stripeSession.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: `Failed to create checkout session - ${error}` }, { status: 500 })
  }
}

