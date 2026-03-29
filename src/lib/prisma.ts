import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  return new PrismaClient()
}

function hasEnrollmentDocumentDelegate(client: PrismaClient) {
  return (
    typeof (client as unknown as { enrollmentDocument?: { create: unknown } }).enrollmentDocument
      ?.create === "function"
  )
}

function getPrisma(): PrismaClient {
  const cached = globalForPrisma.prisma

  // In dev, `next dev` can keep a PrismaClient from before `prisma generate`; that
  // instance has no delegates for newly added models (e.g. enrollmentDocument).
  if (process.env.NODE_ENV !== "production" && cached && !hasEnrollmentDocumentDelegate(cached)) {
    void cached.$disconnect()
    globalForPrisma.prisma = createPrismaClient()
    return globalForPrisma.prisma
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  return globalForPrisma.prisma
}

export const prisma = getPrisma()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
