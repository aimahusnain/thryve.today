import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserCart } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email || "";
    const userName = session.user.name || "Customer";

    // Get the user's cart
    const cart = await getUserCart();

    if (cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-04-01",
    });

    // Prepare line items for Stripe and create/update pending enrollments
    const lineItems = await Promise.all(
      cart.items.map(async (item) => {
        // Check if an enrollment already exists
        let enrollment = await prisma.enrollment.findFirst({
          where: {
            AND: [
              {
                OR: [{ email: userEmail }, { userId: userId }],
              },
              { courseId: item.course.id },
            ],
          },
        });

        if (!enrollment) {
          // Create a new pending enrollment with the course price
          enrollment = await prisma.enrollment.create({
            data: {
              studentName: userName,
              dateOfBirth: "",
              address: "",
              cityStateZip: "",
              phoneHome: "",
              phoneCell: "",
              email: userEmail,
              socialSecurity: "",
              stateId: "",
              emergencyContact: "",
              emergencyRelationship: "",
              emergencyPhone: "",
              studentSignature: userName,
              studentSignatureDate: new Date(),
              directorSignature: "Pending Payment",
              directorSignatureDate: new Date(),
              paymentStatus: "PENDING",
              courseId: item.course.id,
              userId: userId,
              paymentAmount: item.course.price, // Store the course price during enrollment creation
            },
          });
        } else if (enrollment.paymentStatus !== "COMPLETED") {
          // Update existing enrollment if it's not already completed
          await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: {
              paymentStatus: "PENDING",
              studentName: userName,
              email: userEmail,
              paymentAmount: item.course.price, // Update the course price
            },
          });
        }

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.course.name,
              description: `${item.course.duration} course`,
            },
            unit_amount: Math.round(item.course.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        };
      })
    );

    // Extract course IDs for metadata
    const courseIds = cart.items.map((item) => item.course.id);

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: [
        "card",
        "klarna",
        "afterpay_clearpay",
        "amazon_pay",
        "google_pay",
      ],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: {
        userId,
        courseIds: JSON.stringify(courseIds),
      },
    });

    return NextResponse.json({ checkoutUrl: stripeSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
