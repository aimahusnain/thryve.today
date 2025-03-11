import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await request.json()

  try {
    // Check if an enrollment already exists
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: data.courseId,
      },
    })

    if (existingEnrollment) {
      // Update existing enrollment
      const updatedEnrollment = await prisma.enrollment.update({
        where: { id: existingEnrollment.id },
        data: {
          ...data,
          userId: session.user.id,
          email: session.user.email!,
          paymentStatus: "PENDING",
          studentSignature: data.studentSignature || session.user.name || "Electronic Signature",
          studentSignatureDate: new Date(data.studentSignatureDate),
          directorSignature: data.directorSignature || "Pending Review",
          directorSignatureDate: new Date(data.directorSignatureDate),
        },
      })
      return NextResponse.json(updatedEnrollment)
    } else {
      // Create new enrollment
      const newEnrollment = await prisma.enrollment.create({
        data: {
          ...data,
          userId: session.user.id,
          email: session.user.email!,
          paymentStatus: "PENDING",
          studentSignature: data.studentSignature || session.user.name || "Electronic Signature",
          studentSignatureDate: new Date(data.studentSignatureDate),
          directorSignature: data.directorSignature || "Pending Review",
          directorSignatureDate: new Date(data.directorSignatureDate),
        },
      })
      return NextResponse.json(newEnrollment)
    }
  } catch (error) {
    console.error("Error creating/updating enrollment:", error)
    return NextResponse.json({ error: "Failed to create/update enrollment" }, { status: 500 })
  }
}

