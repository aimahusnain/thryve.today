import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import {prisma} from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ count: 0 })
    }

    // Find the user's cart
    const cart = await prisma.cart.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        items: true,
      },
    })

    if (!cart) {
      return NextResponse.json({ count: 0 })
    }

    // Count total items (considering quantity)
    const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0)

    return NextResponse.json({ count: totalItems })
  } catch (error) {
    console.error("Error fetching cart count:", error)
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
}