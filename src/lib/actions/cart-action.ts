"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { isValidUUID } from "@/utils/validation"

export async function removeFromCart(cartItemId: string) {
  console.log("Server action called with ID:", cartItemId)

  if (!cartItemId) {
    console.error("No cart item ID provided")
    return { success: false, error: "No cart item ID provided" }
  }

  if (!isValidUUID(cartItemId)) {
    console.error(`Invalid UUID format: ${cartItemId}`)
    return { success: false, error: "Invalid ID format" }
  }

  try {
    // First check if the item exists
    const item = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    })

    if (!item) {
      console.error(`Cart item with ID ${cartItemId} not found`)
      return { success: false, error: "Cart item not found" }
    }

    // Delete the cart item from the database
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    })

    console.log(`Successfully removed cart item with ID: ${cartItemId}`)

    // Revalidate the cart page to reflect the changes
    revalidatePath("/cart")
    return { success: true }
  } catch (error) {
    console.error("Failed to remove item from cart:", error)
    return { success: false, error: String(error) }
  }
}

