import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get the user's cart with course IDs
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          select: { courseId: true },
        },
      },
    })

    if (!cart) {
      return NextResponse.json({ success: true, message: "Cart already empty" })
    }

    // Get all course IDs in the cart
    const courseIds = cart.items.map((item) => item.courseId)

    // Use a transaction to ensure all operations succeed or fail together
    await prisma.$transaction([
      // Delete all enrollment records for these courses
      ...(courseIds.length > 0
        ? [
            prisma.enrollment.deleteMany({
              where: {
                userId: session.user.id,
                courseId: {
                  in: courseIds,
                },
              },
            }),
          ]
        : []),
      // Delete all cart items
      prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error clearing cart:", error)
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
  }
}
