"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getDashboardData() {
  try {
    // Get counts and stats
    const [
      totalEnrollments,
      totalUsers,
      totalCourses,
      pendingPayments,
      completedPayments,
      failedPayments,
      usersByRole,
    ] = await Promise.all([
      prisma.enrollment.count(),
      prisma.user.count(),
      prisma.courses.count(),
      prisma.enrollment.count({
        where: { paymentStatus: "PENDING" },
      }),
      prisma.enrollment.count({
        where: { paymentStatus: "COMPLETED" },
      }),
      prisma.enrollment.count({
        where: { paymentStatus: "FAILED" },
      }),
      prisma.user.groupBy({
        by: ["role"],
        _count: {
          _all: true,
        },
      }),
    ])

    // Calculate total revenue
    const totalRevenue = await prisma.enrollment.aggregate({
      _sum: {
        paymentAmount: true,
      },
      where: {
        paymentStatus: "COMPLETED",
      },
    })

    // Get cart data
    const cartCount = await prisma.cart.count()
    const cartItemCount = await prisma.cartItem.count()

    return {
      counts: {
        enrollments: totalEnrollments,
        users: totalUsers,
        courses: totalCourses,
        carts: cartCount,
        cartItems: cartItemCount,
      },
      payments: {
        pending: pendingPayments,
        completed: completedPayments,
        failed: failedPayments,
        totalRevenue: totalRevenue._sum.paymentAmount || 0,
      },
      usersByRole,
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    throw new Error("Failed to fetch dashboard data")
  }
}

