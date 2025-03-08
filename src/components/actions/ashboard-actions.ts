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
      recentEnrollments,
      courseStats,
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
      prisma.enrollment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          studentName: true,
          paymentStatus: true,
          paymentAmount: true,
          createdAt: true,
        },
      }),
      prisma.courses.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          _count: {
            select: { cartItems: true },
          },
        },
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

    // Get monthly enrollment data for the chart
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyEnrollments = await prisma.enrollment.groupBy({
      by: ["paymentStatus"],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
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
      recentEnrollments,
      courseStats,
      usersByRole,
      monthlyEnrollments,
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    throw new Error("Failed to fetch dashboard data")
  }
}

