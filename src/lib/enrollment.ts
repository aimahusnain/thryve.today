"use server"

import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function createEnrollment(data: any) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error("You must be logged in to enroll")
  }

  // Create the enrollment record
  const enrollment = await prisma.enrollment.create({
    data: {
      studentName: data.studentName,
      dateOfBirth: data.dateOfBirth,
      address: data.address,
      cityStateZip: data.cityStateZip,
      phoneHome: data.phoneHome,
      phoneCell: data.phoneCell,
      email: data.email,
      socialSecurity: data.socialSecurity,
      stateId: data.stateId,
      emergencyContact: data.emergencyContact || "",
      emergencyRelationship: data.emergencyRelationship || "",
      emergencyPhone: data.emergencyPhone,
      studentSignature: data.studentSignature,
      studentSignatureDate: new Date(data.studentSignatureDate),
      directorSignature: data.directorSignature || "Pending",
      directorSignatureDate: data.directorSignatureDate ? new Date(data.directorSignatureDate) : new Date(),
      guardianSignature: data.guardianSignature || null,
      guardianSignatureDate: data.guardianSignatureDate ? new Date(data.guardianSignatureDate) : null,
      userId: session.user.id || null,
      paymentStatus: "PENDING",
    },
  })

  revalidatePath("/cart")
  return enrollment
}

export async function hasCompletedEnrollment() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return false
  }

  // Check if the user has any enrollment records
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: session.user.id || undefined,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return !!enrollment
}
