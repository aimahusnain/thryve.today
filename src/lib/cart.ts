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

// Check if a course is already in the cart
export async function isInCart(courseId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          where: { courseId },
        },
      },
    })

    return  (cart?.items?.length ?? 0) > 0
  } catch (error) {
    console.error("Error checking if course is in cart:", error)
    return false
  }
}

// Modify the addToCart function to prevent duplicates
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
    // Return the existing item without changing quantity
    return prisma.cartItem.findUnique({
      where: { id: existingItem.id },
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
export async function removeItemFromCart(cartItemId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }

  // First get the cart item to know which course it is
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    select: { courseId: true },
  })

  if (!cartItem) {
    throw new Error("Cart item not found")
  }

  // Delete the enrollment record for this user and course
  await prisma.enrollment.deleteMany({
    where: {
      userId: session.user.id,
      courseId: cartItem.courseId,
    },
  })

  // Then delete the cart item
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
    include: {
      items: {
        select: { courseId: true },
      },
    },
  })

  if (cart) {
    // Get all course IDs in the cart
    const courseIds = cart.items.map((item) => item.courseId)

    // Delete all enrollment records for these courses
    if (courseIds.length > 0) {
      await prisma.enrollment.deleteMany({
        where: {
          userId: session.user.id,
          courseId: {
            in: courseIds,
          },
        },
      })
    }

    // Delete all cart items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })
  }

  return { success: true }
}

// Check if a user has completed enrollment for a specific course
export async function checkEnrollmentStatus(courseId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: session.user.id,
      courseId: courseId,
    },
  })

  return {
    completed: !!enrollment,
    enrollmentId: enrollment?.id || null,
  }
}

// Check enrollment status for all courses in cart
export async function checkCartEnrollmentStatus() {
  try {
    const cart = await getUserCart()
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const courseIds = cart.items.map((item) => item.course.id)

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: session.user.id,
        courseId: {
          in: courseIds,
        },
      },
      select: {
        courseId: true,
      },
    })

    const enrolledCourseIds = enrollments.map((e) => e.courseId)

    const enrollmentStatus: Record<string, boolean> = {}
    let allEnrolled = true

    for (const item of cart.items) {
      const isEnrolled = enrolledCourseIds.includes(item.course.id)
      enrollmentStatus[item.course.id] = isEnrolled
      if (!isEnrolled) allEnrolled = false
    }

    return {
      enrollmentStatus,
      allEnrolled,
    }
  } catch (error) {
    console.error("Error checking enrollment status:", error)
    return {
      enrollmentStatus: {},
      allEnrolled: false,
    }
  }
}
