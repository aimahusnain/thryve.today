"use server"

import { prisma } from "@/lib/prisma"
import type { Enrollment } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getEnrollments(): Promise<Enrollment[]> {
  try {
    const enrollments = await prisma.enrollment.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return enrollments
  } catch (error) {
    console.error("Failed to fetch enrollments:", error)
    throw new Error("Failed to fetch enrollments")
  }
}

export async function getEnrollmentById(id: string): Promise<Enrollment | null> {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        id,
      },
    })

    return enrollment
  } catch (error) {
    console.error(`Failed to fetch enrollment with ID ${id}:`, error)
    throw new Error(`Failed to fetch enrollment with ID ${id}`)
  }
}

// <CHANGE> Added function to get full enrollment data for PDF generation
export async function getFullEnrollmentById(id: string) {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        id,
      },
    })

    if (!enrollment) {
      throw new Error(`Enrollment with ID ${id} not found`)
    }

    // Get course information if courseId exists
    let courseName = "Nursing Assistant"
    if (enrollment.courseId) {
      const course = await prisma.courses.findUnique({
        where: { id: enrollment.courseId },
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
  } catch (error) {
    console.error(`Failed to fetch full enrollment with ID ${id}:`, error)
    throw new Error(`Failed to fetch full enrollment with ID ${id}`)
  }
}

export async function updateEnrollmentPaymentStatus(
  id: string,
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED",
  paymentAmount?: number,
  paymentId?: string,
): Promise<Enrollment> {
  try {
    const updatedEnrollment = await prisma.enrollment.update({
      where: {
        id,
      },
      data: {
        paymentStatus,
        ...(paymentAmount && { paymentAmount }),
        ...(paymentId && { paymentId }),
        ...(paymentStatus === "COMPLETED" && { paymentDate: new Date() }),
      },
    })

    return updatedEnrollment
  } catch (error) {
    console.error(`Failed to update payment status for enrollment ${id}:`, error)
    throw new Error(`Failed to update payment status for enrollment ${id}`)
  }
}

export async function deleteEnrollment(id: string) {
  try {
    await prisma.enrollment.delete({
      where: {
        id,
      },
    })

    revalidatePath("/dashboard/orders")
    return { success: true }
  } catch (error) {
    console.error("Error deleting enrollment:", error)
    throw new Error("Failed to delete enrollment")
  }
}

export async function getEnrollmentDetails() {
  try {
    // Use a more efficient approach with a single query
    const enrollments = await prisma.enrollment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        studentName: true,
        email: true,
        phoneCell: true,
        paymentStatus: true,
        paymentAmount: true,
        paymentDate: true,
        createdAt: true,
        courseId: true,
      },
    })

    // For each enrollment with a courseId, fetch the course name
    const enrollmentsWithCourseInfo = await Promise.all(
      enrollments.map(async (enrollment) => {
        let courseName = "N/A"

        // Only try to fetch course if courseId exists
        if (enrollment.courseId) {
          const course = await prisma.courses.findUnique({
            where: { id: enrollment.courseId },
            select: { name: true, price: true },
          })

          if (course) {
            courseName = course.name

            // If paymentAmount is null but we have course price, use that
            if (enrollment.paymentAmount === null && course.price) {
              enrollment.paymentAmount = course.price
            }
          }
        }

        // Ensure paymentAmount is a number or null, not undefined
        const paymentAmount = enrollment.paymentAmount !== undefined ? enrollment.paymentAmount : null

        return {
          ...enrollment,
          courseName,
          paymentAmount,
        }
      }),
    )

    return enrollmentsWithCourseInfo
  } catch (error) {
    console.error("Error fetching enrollment data:", error)
    throw new Error("Failed to fetch enrollment data")
  }
}
