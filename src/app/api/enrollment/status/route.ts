import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the user has any enrollment records
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        OR: [{ userId: session.user.id }, { email: session.user.email || "" }],
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      completed: !!enrollment,
    })
  } catch (error) {
    console.error("Error checking enrollment status:", error)
    return NextResponse.json({ error: "Failed to check enrollment status" }, { status: 500 })
  }
}
