import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Get all enrollments for the current user
export async function getUserEnrollments() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }

  const enrollments = await prisma.enrollment.findMany({
    where: {
      OR: [{ email: session.user.email! }, { userId: session.user.id }],
      paymentStatus: "COMPLETED",
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return enrollments
}

// Check if a user is enrolled in a specific course
export async function isUserEnrolledInCourse(courseId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return false
  }

  // Check for enrollment with direct course ID reference
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      AND: [
        {
          OR: [{ email: session.user.email! }, { userId: session.user.id }],
        },
        {
          OR: [{ courseId: courseId }, { paymentId: courseId }],
        },
        { paymentStatus: "COMPLETED" },
      ],
    },
  })

  return !!enrollment
}

// Get enrolled course details
export async function getEnrolledCourses() {
  const enrollments = await getUserEnrollments()

  // Get course details for each enrollment
  const enrolledCourses = await Promise.all(
    enrollments.map(async (enrollment) => {
      // First try to use the direct courseId if available
      if (enrollment.courseId) {
        const course = await prisma.courses.findUnique({
          where: { id: enrollment.courseId },
        })

        if (course) return course
      }

      // If no direct courseId or course not found, try using paymentId
      // if it looks like a UUID (contains hyphens)
      if (enrollment.paymentId?.includes("-")) {
        const course = await prisma.courses.findUnique({
          where: { id: enrollment.paymentId },
        })

        if (course) return course
      }

      // If we still don't have a course, try to find by price
      const possibleCourses = await prisma.courses.findMany({
        where: {
          price: enrollment.paymentAmount || undefined,
        },
        take: 1,
      })

      if (possibleCourses.length > 0) {
        return possibleCourses[0]
      }

      // If all else fails, return a placeholder
      return {
        id: enrollment.id,
        name: "Enrolled Course",
        duration: "Unknown duration",
        price: enrollment.paymentAmount || 0,
        description: "Course details not available",
        createdAt: enrollment.createdAt,
        updatedAt: enrollment.updatedAt,
        status: "ACTIVE",
      }
    }),
  )

  return enrolledCourses
}

