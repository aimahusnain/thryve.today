"use server"

import { prisma } from "@/lib/prisma"
import type { Enrollment } from "@prisma/client"

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