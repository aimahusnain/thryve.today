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
    const enrollment = await prisma.enrollment.create({
      data: {
        ...data,
        userId: session.user.id,
        email: session.user.email!,
        paymentStatus: "PENDING",
        studentSignature: session.user.name || "Electronic Signature",
        studentSignatureDate: new Date(),
        directorSignature: "Pending Review",
        directorSignatureDate: new Date(),
        // Make sure courseId is included in the data
        courseId: data.courseId,
      },
    })

    return NextResponse.json(enrollment)
  } catch (error) {
    console.error("Error creating enrollment:", error)
    return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 })
  }
}