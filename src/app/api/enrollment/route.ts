import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Enrollment ID is required" }, { status: 400 })
    }

    await prisma.enrollment.delete({
      where: {
        id: id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting enrollment:", error)
    return NextResponse.json({ error: "Failed to delete enrollment" }, { status: 500 })
  }
}

