import { NextResponse } from "next/server"
import { getUserCart, addToCart, removeFromCart, updateCartItemQuantity } from "@/lib/cart"

// Get user's cart
export async function GET() {
  try {
    const cart = await getUserCart()
    return NextResponse.json(cart)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 401 })
  }
}

// Add item to cart
export async function POST(request: Request) {
  try {
    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    const cartItem = await addToCart(courseId)
    return NextResponse.json(cartItem)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 401 })
  }
}

// Update cart item
export async function PUT(request: Request) {
  try {
    const { cartItemId, quantity } = await request.json()

    if (!cartItemId || quantity === undefined) {
      return NextResponse.json({ error: "Cart item ID and quantity are required" }, { status: 400 })
    }

    const cartItem = await updateCartItemQuantity(cartItemId, quantity)
    return NextResponse.json(cartItem)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 401 })
  }
}

// Delete cart item
export async function DELETE(request: Request) {
  try {
    const { cartItemId } = await request.json()

    if (!cartItemId) {
      return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 })
    }

    await removeFromCart(cartItemId)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 401 })
  }
}

