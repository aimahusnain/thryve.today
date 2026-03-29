import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserCart } from "@/lib/cart"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const userEmail = session.user.email || ""
    // const userName = session.user.name || "Customer"

    // Get the user's cart
    const cart = await getUserCart()

    if (cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Check if all courses in the cart have completed enrollment forms
    const courseIds = cart.items.map((item) => item.course.id)

    // Get all enrollments for this user and these courses
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: userId,
        courseId: {
          in: courseIds,
        },
      },
      select: {
        courseId: true,
      },
    })

    const enrolledCourseIds = enrollments.map((enrollment) => enrollment.courseId)

    // Find courses that don't have enrollment forms
    const missingEnrollments = courseIds.filter((id) => !enrolledCourseIds.includes(id))

    if (missingEnrollments.length > 0) {
      // Get the names of courses missing enrollment
      const missingCourses = await prisma.courses.findMany({
        where: {
          id: {
            in: missingEnrollments,
          },
        },
        select: {
          id: true,
          name: true,
        },
      })

      const missingCourseNames = missingCourses.map((course) => course.name).join(", ")

      return NextResponse.json(
        {
          error: "Enrollment forms required",
          message: `Please complete enrollment forms for: ${missingCourseNames}`,
          missingCourseIds: missingEnrollments,
          missingCourses: missingCourses,
        },
        { status: 400 },
      )
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16" as Stripe.LatestApiVersion, // Using the correct API version type
    })

    // Prepare line items for Stripe and update pending enrollments
    const lineItems = await Promise.all(
      cart.items.map(async (item) => {
        // Update enrollment payment status to PENDING
        await prisma.enrollment.updateMany({
          where: {
            userId: userId,
            courseId: item.course.id,
          },
          data: {
            paymentStatus: "PENDING",
            paymentAmount: item.course.price * item.quantity,
          },
        })

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.course.name,
              description: `${item.course.duration} course`,
            },
            unit_amount: Math.round(item.course.price * 100),
          },
          quantity: item.quantity,
        }
      }),
    )

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "klarna", "afterpay_clearpay"],
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
    })

    return NextResponse.json({ checkoutUrl: stripeSession.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout session" },
      { status: 500 },
    )
  }
}
