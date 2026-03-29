import { unlink } from "fs/promises"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminSession } from "@/lib/admin-auth"
import { getStoredFileAbsolutePath } from "@/lib/enrollment-document-storage"

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

  const absPath = getStoredFileAbsolutePath(enrollmentId, doc.storedFileName)
  try {
    await unlink(absPath)
  } catch {
    // file may already be missing
  }

  await prisma.enrollmentDocument.delete({
    where: { id: documentId },
  })

  return NextResponse.json({ success: true })
}
