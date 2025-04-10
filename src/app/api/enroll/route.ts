import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    const requiredFields = [
      "studentName",
      "dateOfBirth",
      "address",
      "cityStateZip",
      "phoneHome",
      "phoneCell",
      "email",
      "socialSecurity",
      "stateId",
      "emergencyPhone",
      "studentSignature",
    ]

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          {
            error: `Missing required field: ${field}`,
          },
          { status: 400 },
        )
      }
    }

    // Check if an enrollment already exists
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: data.courseId,
      },
    })

    // Prepare data with proper date handling
    const enrollmentData = {
      ...data,
      userId: session.user.id,
      email: data.email || session.user.email || "",
      paymentStatus: "PENDING",
      studentSignature: data.studentSignature || session.user.name || "Electronic Signature",
      studentSignatureDate: data.studentSignatureDate ? new Date(data.studentSignatureDate) : new Date(),
      directorSignature: data.directorSignature || "Pending Review",
      directorSignatureDate: data.directorSignatureDate ? new Date(data.directorSignatureDate) : new Date(),
      guardianSignature: data.guardianSignature || null,
      guardianSignatureDate: data.guardianSignatureDate ? new Date(data.guardianSignatureDate) : null,
      updatedAt: new Date(),
    }

    if (existingEnrollment) {
      // Update existing enrollment
      const updatedEnrollment = await prisma.enrollment.update({
        where: { id: existingEnrollment.id },
        data: enrollmentData,
      })

      return NextResponse.json({
        success: true,
        message: "Enrollment updated successfully",
        enrollment: updatedEnrollment,
      })
    } else {
      // Create new enrollment
      const newEnrollment = await prisma.enrollment.create({
        data: {
          ...enrollmentData,
          createdAt: new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        message: "Enrollment created successfully",
        enrollment: newEnrollment,
      })
    }
  } catch (error) {
    console.error("Error creating/updating enrollment:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process enrollment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
