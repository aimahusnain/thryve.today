import { randomUUID } from "crypto"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminSession } from "@/lib/admin-auth"
import { sanitizeStoredFileName } from "@/lib/enrollment-document-storage"

const MAX_BYTES = 15 * 1024 * 1024
const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/tiff",
])

const EXT_TO_MIME: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  tif: "image/tiff",
  tiff: "image/tiff",
}

function resolveAllowedMime(file: File): string | null {
  if (file.type && ALLOWED_MIME.has(file.type)) return file.type
  const ext = file.name.split(".").pop()?.toLowerCase()
  if (ext && EXT_TO_MIME[ext]) return EXT_TO_MIME[ext]
  return null
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ enrollmentId: string }> },
) {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { enrollmentId } = await params

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    select: { id: true },
  })
  if (!enrollment) {
    return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
  }

  const documents = await prisma.enrollmentDocument.findMany({
    where: { enrollmentId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      originalFileName: true,
      mimeType: true,
      sizeBytes: true,
      createdAt: true,
    },
  })

  return NextResponse.json({ documents })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ enrollmentId: string }> },
) {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { enrollmentId } = await params

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    select: { id: true },
  })
  if (!enrollment) {
    return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
  }

  const formData = await request.formData()
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0)

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 })
  }

  const created: { id: string; originalFileName: string }[] = []

  for (const file of files) {
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File too large (max ${MAX_BYTES / 1024 / 1024}MB): ${file.name}` },
        { status: 400 },
      )
    }

    const mimeType = resolveAllowedMime(file)
    if (!mimeType) {
      return NextResponse.json(
        { error: `Unsupported file type for "${file.name}". Use PDF or common image formats.` },
        { status: 400 },
      )
    }

    const safeBase = sanitizeStoredFileName(file.name)
    const storedFileName = `${randomUUID()}_${safeBase}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const row = await prisma.enrollmentDocument.create({
      data: {
        enrollmentId,
        originalFileName: file.name.slice(0, 500),
        storedFileName,
        fileData: buffer,
        mimeType,
        sizeBytes: file.size,
      },
      select: { id: true, originalFileName: true },
    })
    created.push(row)
  }

  return NextResponse.json({ uploaded: created })
}
