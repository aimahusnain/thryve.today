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

    const { searchParams } = new URL(request.url)
    const cartItemId = searchParams.get("cartItemId")

    if (!cartItemId) {
      return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 })
    }

    // First get the cart item to know which course it is
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      select: { courseId: true, cartId: true },
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    // Verify the cart belongs to the user
    const cart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      select: { userId: true },
    })

    if (!cart || cart.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use a transaction to ensure both operations succeed or fail together
    await prisma.$transaction([
      // Delete the enrollment record for this user and course
      prisma.enrollment.deleteMany({
        where: {
          userId: session.user.id,
          courseId: cartItem.courseId,
        },
      }),
      // Delete the cart item
      prisma.cartItem.delete({
        where: { id: cartItemId },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing cart item:", error)
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 })
  }
}
