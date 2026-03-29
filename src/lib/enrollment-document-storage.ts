import fs from "fs/promises"
import path from "path"

const UPLOAD_ROOT = path.join(process.cwd(), "uploads", "enrollment-documents")

export function getEnrollmentUploadDir(enrollmentId: string) {
  return path.join(UPLOAD_ROOT, enrollmentId)
}

export async function ensureEnrollmentUploadDir(enrollmentId: string) {
  const dir = getEnrollmentUploadDir(enrollmentId)
  await fs.mkdir(dir, { recursive: true })
  return dir
}

export function getStoredFileAbsolutePath(enrollmentId: string, storedFileName: string) {
  return path.join(getEnrollmentUploadDir(enrollmentId), storedFileName)
}

export async function deleteEnrollmentUploadDirectory(enrollmentId: string) {
  const dir = getEnrollmentUploadDir(enrollmentId)
  try {
    await fs.rm(dir, { recursive: true, force: true })
  } catch {
    // ignore missing dir
  }
}

export function sanitizeStoredFileName(originalName: string): string {
  const base = originalName.replace(/^.*[/\\]/, "").slice(0, 180)
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, "_")
  return cleaned.length > 0 ? cleaned : "file"
}
