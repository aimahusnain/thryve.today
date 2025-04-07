import { type NextRequest, NextResponse } from "next/server"
import { addToCart, getUserCart, removeItemFromCart, updateCartItemQuantity } from "@/lib/cart"

export async function GET() {
  try {
    const cart = await getUserCart()
    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch cart" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    const cartItem = await addToCart(courseId)
    return NextResponse.json(cartItem)
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add to cart" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { cartItemId } = await request.json()

    if (!cartItemId) {
      return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 })
    }

    await removeItemFromCart(cartItemId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to remove from cart" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { cartItemId, quantity } = await request.json()

    if (!cartItemId) {
      return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 })
    }

    if (typeof quantity !== "number" || quantity < 0) {
      return NextResponse.json({ error: "Valid quantity is required" }, { status: 400 })
    }

    const updatedItem = await updateCartItemQuantity(cartItemId, quantity)
    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update cart" },
      { status: 500 },
    )
  }
}

