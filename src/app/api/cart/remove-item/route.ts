import { NextResponse } from "next/server"
import { removeItemFromCart } from "@/lib/cart" 

export async function POST(request: Request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    await removeItemFromCart(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing item from cart:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to remove item from cart" },
      { status: 500 },
    )
  }
}

