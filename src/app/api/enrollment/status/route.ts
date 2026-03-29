import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// API endpoint to check if a user has completed enrollment for a specific course
export async function GET(request: Request) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get courseId from query params
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    // Check if enrollment exists for this user and course
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: courseId,
      },
    })

    return NextResponse.json({
      completed: !!enrollment,
      enrollmentId: enrollment?.id || null,
    })
  } catch (error) {
    console.error("Error checking enrollment status:", error)
    return NextResponse.json({ error: "Failed to check enrollment status" }, { status: 500 })
  }
}
