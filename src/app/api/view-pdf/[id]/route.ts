import { getFullEnrollmentById } from "@/lib/enrollment-actions"
import { generateEnrollmentPDF } from "@/lib/pdf-generator"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    console.log(request.headers.get("user-agent"))

    // Get full enrollment data
    const fullEnrollment = await getFullEnrollmentById(id)

    if (!fullEnrollment) {
      return new NextResponse("Enrollment not found", { status: 404 })
    }

    // Generate PDF
    const pdfBytes = await generateEnrollmentPDF(fullEnrollment)
    const fileName = `enrollment-${fullEnrollment.studentName.replace(/\s+/g, "-")}-${fullEnrollment.id.slice(0, 8)}.pdf`

    // Return PDF with headers for inline viewing
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return new NextResponse("Failed to generate PDF", { status: 500 })
  }
}
