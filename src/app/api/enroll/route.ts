import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const enrollment = await prisma.enrollment.create({
      data: {
        studentName: body.studentName,
        dateOfBirth: body.dateOfBirth,
        address: body.address,
        cityStateZip: body.cityStateZip,
        phoneHome: body.phoneHome,
        phoneCell: body.phoneCell,
        email: body.email,
        socialSecurity: body.socialSecurity,
        stateId: body.stateId,
        emergencyContact: body.emergencyContact,
        emergencyRelationship: body.emergencyRelationship,
        emergencyPhone: body.emergencyPhone,
        studentSignature: body.studentSignature,
        studentSignatureDate: new Date(body.studentSignatureDate),
        directorSignature: body.directorSignature,
        directorSignatureDate: new Date(body.directorSignatureDate),
        guardianSignature: body.guardianSignature,
        guardianSignatureDate: body.guardianSignatureDate ? new Date(body.guardianSignatureDate) : null,
      },
    })

    return NextResponse.json({ message: "Enrollment submitted successfully", enrollment }, { status: 201 })
  } catch (error) {
    console.error("Error submitting enrollment:", error)
    return NextResponse.json({ error: "Failed to submit enrollment" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

