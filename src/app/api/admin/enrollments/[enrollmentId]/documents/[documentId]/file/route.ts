import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminSession } from "@/lib/admin-auth"

export async function GET(
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

  const disposition = `attachment; filename*=UTF-8''${encodeURIComponent(doc.originalFileName)}`

  const bytes =
    doc.fileData instanceof Buffer ? new Uint8Array(doc.fileData) : new Uint8Array(doc.fileData as any)

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType || "application/octet-stream",
      "Content-Disposition": disposition,
      "Cache-Control": "private, no-store",
    },
  })
}
