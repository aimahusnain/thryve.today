import { NextResponse } from "next/server"
import { clearCart } from "@/lib/cart"

export async function POST() {
  try {
    await clearCart()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 401 })
  }
}

