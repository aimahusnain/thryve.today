import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

// Get or create a cart for the current user
export async function getUserCart() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }

  const userId = session.user.id

  // First check if the user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Find existing cart or create a new one
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          course: true,
        },
      },
    },
  })

  if (!cart) {
    try {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
        include: {
          items: {
            include: {
              course: true,
            },
          },
        },
      })
    } catch (error) {
      console.error("Error creating cart:", error)
      // Return an empty cart structure if creation fails
      return {
        id: "",
        userId,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
  }

  return cart
}

// Add a course to the cart
export async function addToCart(courseId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }

  const userId = session.user.id

  // First check if the user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Check if the course exists
  const course = await prisma.courses.findUnique({
    where: { id: courseId },
  })

  if (!course) {
    throw new Error("Course not found")
  }

  // Get or create cart
  let cart = await prisma.cart.findUnique({
    where: { userId },
  })

  if (!cart) {
    try {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
      })
    } catch (error) {
      console.error("Error creating cart:", error)
      throw new Error("Failed to create cart")
    }
  }

  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      courseId,
    },
  })

  if (existingItem) {
    // Update quantity if item already exists
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + 1,
      },
      include: {
        course: true,
      },
    })
  } else {
    // Create new cart item
    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        courseId,
        quantity: 1,
      },
      include: {
        course: true,
      },
    })
  }
}

// Remove an item from the cart
export async function removeFromCart(cartItemId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }

  return prisma.cartItem.delete({
    where: { id: cartItemId },
  })
}

// Update cart item quantity
export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }

  if (quantity <= 0) {
    return prisma.cartItem.delete({
      where: { id: cartItemId },
    })
  }

  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
    include: {
      course: true,
    },
  })
}

// Get cart total
export async function getCartTotal() {
  try {
    const cart = await getUserCart()

    return cart.items.reduce((total, item) => {
      return total + item.course.price * item.quantity
    }, 0)
  } catch (error) {
    console.error("Error calculating cart total:", error)
    return 0
  }
}

// Clear the cart
export async function clearCart() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }

  const userId = session.user.id

  const cart = await prisma.cart.findUnique({
    where: { userId },
  })

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })
  }

  return { success: true }
}