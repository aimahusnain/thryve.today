import { PDFDocument } from "pdf-lib"
import { format } from "date-fns"

interface EnrollmentData {
  id: string
  studentName: string
  email: string
  phoneCell: string
  phoneHome?: string | null
  address?: string | null
  cityStateZip?: string | null
  socialSecurity?: string | null
  stateId?: string | null
  emergencyContact?: string | null
  emergencyRelationship?: string | null
  emergencyPhone?: string | null
  dateOfBirth?: string | null
  paymentStatus: string
  paymentAmount: number | null
  paymentDate?: Date | string | null
  createdAt: Date | string
  courseName?: string | null
  studentSignature?: string | null
  studentSignatureDate?: Date | string | null
  directorSignature?: string | null
  directorSignatureDate?: Date | string | null
}

function safeValue(value: string | null | undefined): string {
  return value || ""
}

function safeDate(date: Date | string | null | undefined): string {
  if (!date) return ""
  try {
    return format(new Date(date), "MM/dd/yyyy")
  } catch {
    return ""
  }
}

export async function generateEnrollmentPDF(enrollment: EnrollmentData) {
  try {
    // Load the existing PDF form
    const formUrl = "/enrollment-form.pdf"
    const response = await fetch(formUrl)

    if (!response.ok) {
      throw new Error(
        `PDF form not found. Please upload 'enrollment-form.pdf' to the public folder. Status: ${response.status}`,
      )
    }

    const formPdfBytes = await response.arrayBuffer()

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(formPdfBytes)
    const form = pdfDoc.getForm()

    // Fill the form fields with student data
    const fields = form.getFields()
    console.log(
      "[v0] Available form fields:",
      fields.map((field) => field.getName()),
    )

    // Map enrollment data to form field names
    const fieldMappings = {
      "STUDENT NAME": safeValue(enrollment.studentName),
      ADDRESS: safeValue(enrollment.address),
      CITYSTATEZIP: safeValue(enrollment.cityStateZip),
      "PHONE NUMBERS H": safeValue(enrollment.phoneHome),
      "PHONE NUMBERS C": safeValue(enrollment.phoneCell),
      "EMAIL ADDRESS": safeValue(enrollment.email),
      "SOCIAL SECURITY": safeValue(enrollment.socialSecurity),
      "DATE OF ADMISSION": safeDate(enrollment.createdAt),
      "Student Signature": safeValue(enrollment.studentSignature),
      Date: safeDate(enrollment.studentSignatureDate),
      "Program DirectorDirector Signature": safeValue(enrollment.directorSignature),
      Date1: safeDate(enrollment.directorSignatureDate),
    }

    // Fill each field if it exists in the form
    Object.entries(fieldMappings).forEach(([fieldName, value]) => {
      try {
        const field = form.getTextField(fieldName)
        if (field && value) {
          field.setText(value)
        }
      } catch (error) {
        console.log(`[v0] Field "${fieldName}" not found or not a text field`)
      }
    })

    // Flatten the form to prevent further editing (optional)
    form.flatten()

    // Serialize the PDF
    const pdfBytes = await pdfDoc.save()
    return new Uint8Array(pdfBytes)
  } catch (error) {
    console.error("[v0] Error generating PDF:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to generate PDF")
  }
}

export async function downloadEnrollmentPDF(enrollment: EnrollmentData) {
  try {
    const pdfBytes = await generateEnrollmentPDF(enrollment)
    const fileName = `enrollment-${enrollment.studentName.replace(/\s+/g, "-")}-${enrollment.id.slice(0, 8)}.pdf`

    const blob = new Blob([pdfBytes.buffer], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("[v0] Error downloading PDF:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to download PDF: ${error.message}`)
    }
    throw new Error("Failed to download PDF")
  }
}

export async function downloadAllEnrollmentsPDF(enrollments: EnrollmentData[]) {
  try {
    const combinedPdf = await PDFDocument.create()

    for (const enrollment of enrollments) {
      const pdfBytes = await generateEnrollmentPDF(enrollment)
      const enrollmentPdf = await PDFDocument.load(pdfBytes)
      const pages = await combinedPdf.copyPages(enrollmentPdf, enrollmentPdf.getPageIndices())
      pages.forEach((page) => combinedPdf.addPage(page))
    }

    const pdfBytes = await combinedPdf.save()
    const fileName = `all-enrollments-${format(new Date(), "yyyy-MM-dd")}.pdf`

    const blob = new Blob([new Uint8Array(pdfBytes).buffer], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("[v0] Error downloading combined PDF:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to download combined PDF: ${error.message}`)
    }
    throw new Error("Failed to download combined PDF")
  }
}
