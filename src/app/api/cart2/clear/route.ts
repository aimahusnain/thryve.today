import { NextResponse } from "next/server"
import { clearCart } from "@/lib/cart"

export async function POST() {
  try {
    await clearCart()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error clearing cart:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to clear cart" },
      { status: 500 },
    )
  }
}

