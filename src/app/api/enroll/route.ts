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

    let enrollment

    if (existingEnrollment) {
      // Update existing enrollment
      enrollment = await prisma.enrollment.update({
        where: { id: existingEnrollment.id },
        data: enrollmentData,
      })
    } else {
      // Create new enrollment
      enrollment = await prisma.enrollment.create({
        data: {
          ...enrollmentData,
          createdAt: new Date(),
        },
      })

      // Check if course is already in cart
      const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
        include: {
          items: {
            where: { courseId: data.courseId },
          },
        },
      })

      // Return information about cart status
      return NextResponse.json({
        success: true,
        message: "Enrollment created successfully",
        enrollment,
isInCart: (cart?.items?.length ?? 0) > 0
      })
    }

    return NextResponse.json({
      success: true,
      message: existingEnrollment ? "Enrollment updated successfully" : "Enrollment created successfully",
      enrollment,
    })
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