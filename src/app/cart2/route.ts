import { type NextRequest, NextResponse } from "next/server"
import { addToCart, getUserCart, removeFromCart, updateCartItemQuantity } from "@/lib/cart"

export async function GET() {
  try {
    const cart = await getUserCart()
    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error fetching cart2:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch cart2" },
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

    const cart2Item = await addToCart(courseId)
    return NextResponse.json(cart2Item)
  } catch (error) {
    console.error("Error adding to cart2:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add to cart2" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { cart2ItemId } = await request.json()

    if (!cart2ItemId) {
      return NextResponse.json({ error: "Cart2 item ID is required" }, { status: 400 })
    }

    await removeFromCart(cart2ItemId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing from cart2:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to remove from cart2" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { cart2ItemId, quantity } = await request.json()

    if (!cart2ItemId) {
      return NextResponse.json({ error: "Cart2 item ID is required" }, { status: 400 })
    }

    if (typeof quantity !== "number" || quantity < 0) {
      return NextResponse.json({ error: "Valid quantity is required" }, { status: 400 })
    }

    const updatedItem = await updateCartItemQuantity(cart2ItemId, quantity)
    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Error updating cart2:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update cart2" },
      { status: 500 },
    )
  }
}

