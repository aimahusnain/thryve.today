import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminSession } from "@/lib/admin-auth"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ enrollmentId: string; documentId: string }> },
) {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { enrollmentId, documentId } = await params

  const doc = await prisma.enrollmentDocument.findFirst({
    where: { id: documentId, enrollmentId },
  })

  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  await prisma.enrollmentDocument.delete({
    where: { id: documentId },
  })

  return NextResponse.json({ success: true })
}
