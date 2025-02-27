"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function createEnrollment(data: {
  studentName: string
  dateOfBirth: string
  address: string
  cityStateZip: string
  phoneHome: string
  phoneCell: string
  email: string
}) {
  try {
    const enrollment = await prisma.enrollment.create({
      data,
    })

    revalidatePath("/enrollment")
    return { success: true, data: enrollment }
  } catch (error) {
    console.error("Failed to create enrollment:", error)
    throw new Error("Failed to create enrollment")
  } finally {
    await prisma.$disconnect()
  }
}