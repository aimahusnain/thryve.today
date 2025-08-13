import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    // Check authentication first
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    let data
    try {
      data = await request.json()
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

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
      "studentSignature",
      "courseId",
    ]

    const missingFields = requiredFields.filter((field) => !data[field])
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      )
    }

    const parseDate = (dateString: string | undefined): Date | null => {
      if (!dateString) return null
      try {
        const date = new Date(dateString)
        return isNaN(date.getTime()) ? null : date
      } catch {
        return null
      }
    }

    const enrollmentData = {
      studentName: data.studentName,
      dateOfBirth: data.dateOfBirth,
      address: data.address,
      cityStateZip: data.cityStateZip,
      phoneHome: data.phoneHome,
      phoneCell: data.phoneCell,
      email: data.email || session.user.email || "",
      socialSecurity: data.socialSecurity,
      studentSignature: data.studentSignature || session.user.name || "Electronic Signature",
      studentSignatureDate: parseDate(data.studentSignatureDate) || new Date(),
      directorSignature: data.directorSignature || "Pending Review",
      directorSignatureDate: parseDate(data.directorSignatureDate) || new Date(),
      guardianSignature: data.guardianSignature || null,
      guardianSignatureDate: parseDate(data.guardianSignatureDate),
      courseId: data.courseId,
      userId: session.user.id,
      paymentStatus: "PENDING" as const,
      updatedAt: new Date(),
    }

    // Check if enrollment already exists
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: data.courseId,
      },
    })

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
    }

    try {
      const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
        include: {
          items: {
            where: { courseId: data.courseId },
          },
        },
      })

      const isInCart = (cart?.items?.length ?? 0) > 0

      return NextResponse.json({
        success: true,
        message: existingEnrollment ? "Enrollment updated successfully" : "Enrollment created successfully",
        enrollment,
        isInCart,
      })
    } catch (cartError) {
      // If cart check fails, still return success for enrollment
      console.warn("Cart check failed:", cartError)
      return NextResponse.json({
        success: true,
        message: existingEnrollment ? "Enrollment updated successfully" : "Enrollment created successfully",
        enrollment,
        isInCart: false,
      })
    }
  } catch (error) {
    console.error("Error creating/updating enrollment:", error)

    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process enrollment",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : "Internal server error",
      },
      { status: 500 },
    )
  }
}
