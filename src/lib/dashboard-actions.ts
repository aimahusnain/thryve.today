"use server"

import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export async function getDashboardData() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/log-in?callbackUrl=/dashboard")
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== "ADMIN") {
    redirect("/dashboard/user")
  }

  // Get counts
  const [enrollmentsCount, coursesCount, cartItemsCount, usersCount, usersByRole, enrollmentsByStatus, revenueData] =
    await Promise.all([
      prisma.enrollment.count(),
      prisma.courses.count(),
      prisma.cartItem.count(),
      prisma.user.count(),
      prisma.user.groupBy({
        by: ["role"],
        _count: {
          _all: true,
        },
      }),
      prisma.enrollment.groupBy({
        by: ["paymentStatus"],
        _count: {
          id: true,
        },
      }),
      prisma.enrollment.aggregate({
        _sum: {
          paymentAmount: true,
        },
        where: {
          paymentStatus: "COMPLETED",
        },
      }),
    ])

  // Calculate payment statistics
  const completedPayments = await prisma.enrollment.count({
    where: { paymentStatus: "COMPLETED" },
  })

  const pendingPayments = await prisma.enrollment.count({
    where: { paymentStatus: "PENDING" },
  })

  const failedPayments = await prisma.enrollment.count({
    where: { paymentStatus: "FAILED" },
  })

  // Get recent transactions
  const recentTransactions = await prisma.enrollment.findMany({
    where: {
      paymentStatus: "COMPLETED",
      paymentAmount: { not: null },
    },
    select: {
      id: true,
      studentName: true,
      email: true,
      paymentAmount: true,
      paymentDate: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  })

  return {
    counts: {
      enrollments: enrollmentsCount,
      courses: coursesCount,
      cartItems: cartItemsCount,
      users: usersCount,
    },
    usersByRole,
    enrollmentsByStatus,
    payments: {
      totalRevenue: revenueData._sum.paymentAmount || 0,
      completed: completedPayments,
      pending: pendingPayments,
      failed: failedPayments,
    },
    recentTransactions,
  }
}

export async function getRevenueByMonth(year = new Date().getFullYear()) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return []
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== "ADMIN") {
    return []
  }

  // Get all completed payments for the specified year
  const enrollments = await prisma.enrollment.findMany({
    where: {
      paymentStatus: "COMPLETED",
      paymentAmount: { not: null },
      paymentDate: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      },
    },
    select: {
      paymentAmount: true,
      paymentDate: true,
    },
  })

  // Initialize monthly revenue data
  const monthlyRevenue = Array(12)
    .fill(0)
    .map((_, index) => ({
      name: new Date(0, index).toLocaleString("default", { month: "short" }),
      revenue: 0,
    }))

  // Aggregate revenue by month
  enrollments.forEach((enrollment) => {
    if (enrollment.paymentDate && enrollment.paymentAmount) {
      const month = enrollment.paymentDate.getMonth()
      monthlyRevenue[month].revenue += enrollment.paymentAmount
    }
  })

  return monthlyRevenue
}

export async function getEnrollmentDetails() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/log-in?callbackUrl=/dashboard")
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== "ADMIN") {
    redirect("/dashboard/user")
  }

  const enrollments = await prisma.enrollment.findMany({
    select: {
      id: true,
      studentName: true,
      email: true,
      phoneCell: true,
      paymentStatus: true,
      paymentAmount: true,
      paymentDate: true,
      createdAt: true,
      paymentId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Get course details for each enrollment
  const enrollmentsWithCourseDetails = await Promise.all(
    enrollments.map(async (enrollment) => {
      let courseName = "Unknown Course"

      if (enrollment.paymentId) {
        const course = await prisma.courses.findUnique({
          where: { id: enrollment.paymentId },
          select: { name: true },
        })

        if (course) {
          courseName = course.name
        }
      }

      return {
        ...enrollment,
        courseName,
      }
    }),
  )

  return enrollmentsWithCourseDetails
}