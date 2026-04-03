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

  // For images, use `inline` so the UI can render thumbnails / expanded previews.
  // For non-images (e.g. PDFs in legacy data), keep it as `attachment`.
  const isImage = doc.mimeType?.startsWith("image/")
  const dispositionType = isImage ? "inline" : "attachment"
  const disposition = `${dispositionType}; filename*=UTF-8''${encodeURIComponent(doc.originalFileName)}`

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
