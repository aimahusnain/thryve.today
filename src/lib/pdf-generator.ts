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

// Determine which PDF form to use based on course name
function getPdfFormPath(courseName?: string | null): string {
  if (!courseName) return "/enrollment-forms/Website embbed phlebotomy application Oct25.pdf"

  const normalizedCourseName = courseName.toLowerCase().trim()

  if (normalizedCourseName.includes("phlebotomy")) {
    return "/enrollment-forms/Website embbed phlebotomy application Oct25.pdf"
  } else if (
    normalizedCourseName.includes("nurse") &&
    normalizedCourseName.includes("aid") &&
    normalizedCourseName.includes("cna")
  ) {
    return "/enrollment-forms/CNA website embed application Oct25.pdf"
  }

  // Default to phlebotomy if course name doesn't match
  return "/enrollment-forms/Website embbed phlebotomy application Oct25.pdf"
}

// Get field mappings based on course type
function getFieldMappings(enrollment: EnrollmentData, courseName?: string | null) {
  const normalizedCourseName = courseName?.toLowerCase().trim() || ""
  const isCNA =
    normalizedCourseName.includes("nurse") &&
    normalizedCourseName.includes("aid") &&
    normalizedCourseName.includes("cna")

  if (isCNA) {
    return {
      "STUDENT NAME": safeValue(enrollment.studentName),
      ADDRESS: safeValue(enrollment.address),
      CITYSTATEZIP: safeValue(enrollment.cityStateZip),
      "PHONE NUMBERS H": safeValue(enrollment.phoneHome),
      "PHONE NUMBERS C": safeValue(enrollment.phoneCell),
      "EMAIL ADDRESS": safeValue(enrollment.email),
      "SOCIAL SECURITY": safeValue(enrollment.socialSecurity),
      "STUDENT STATE ID": safeValue(enrollment.stateId),
      "EMERGENCY CONTACT": safeValue(enrollment.emergencyContact),
      RELATIONSHIP: safeValue(enrollment.emergencyRelationship),
      TELEPHONE: safeValue(enrollment.emergencyPhone),
      "DATE OF ADMISSION": safeDate(enrollment.createdAt),
      "Student Signature": safeValue(enrollment.studentSignature),
      "SS Date": safeDate(enrollment.studentSignatureDate),
      "Program DirectorDirector Signature": safeValue(enrollment.directorSignature),
      "PDDS Date1": safeDate(enrollment.directorSignatureDate),
    }
  } else {
    // Phlebotomy form fields
    return {
      "Student Name": safeValue(enrollment.studentName),
      "Date of Birth": safeDate(enrollment.dateOfBirth),
      Address: safeValue(enrollment.address),
      "City/State/Zip": safeValue(enrollment.cityStateZip),
      "Phone Number H": safeValue(enrollment.phoneHome),
      "Phone Number C": safeValue(enrollment.phoneCell),
      "Email address": safeValue(enrollment.email),
      "Social Security": safeValue(enrollment.socialSecurity),
      "Student State ID": safeValue(enrollment.stateId),
      "Emergency Contact": safeValue(enrollment.emergencyContact),
      Relationship: safeValue(enrollment.emergencyRelationship),
      Telephone: safeValue(enrollment.emergencyPhone),
      "date of admission": safeDate(enrollment.createdAt),
      "Students Signature": safeValue(enrollment.studentSignature),
      "SS Date": safeDate(enrollment.studentSignatureDate),
      "Program director/Director Signature": safeValue(enrollment.directorSignature),
      "PDDS Date": safeDate(enrollment.directorSignatureDate),
    }
  }
}

export async function generateEnrollmentPDF(enrollment: EnrollmentData) {
  try {
    // Get the appropriate PDF form based on course name
    const formPath = getPdfFormPath(enrollment.courseName)
    const response = await fetch(formPath)

    if (!response.ok) {
      throw new Error(
        `PDF form not found at ${formPath}. Please ensure the file exists in the public/enrollment-forms folder. Status: ${response.status}`,
      )
    }

    const formPdfBytes = await response.arrayBuffer()

    // Load the PDF document - this preserves the original page size
    const pdfDoc = await PDFDocument.load(formPdfBytes, {
      ignoreEncryption: true,
      updateMetadata: false
    })
    const form = pdfDoc.getForm()

    // Log available fields for debugging
    const fields = form.getFields()
    console.log(
      "Available form fields:",
      fields.map((field) => field.getName()),
    )

    // Get field mappings based on course type
    const fieldMappings = getFieldMappings(enrollment, enrollment.courseName)

    // Fill each field if it exists in the form
    Object.entries(fieldMappings).forEach(([fieldName, value]) => {
      try {
        const field = form.getTextField(fieldName)
        if (field && value) {
          field.setText(value)
        }
      } catch (error) {
        console.log(`Field "${fieldName}" not found or not a text field in the PDF form. ${error}`)
      }
    })

    // Flatten the form to prevent further editing
    form.flatten()

    // Serialize the PDF
    const pdfBytes = await pdfDoc.save()
    return new Uint8Array(pdfBytes)
  } catch (error) {
    console.error("Error generating PDF:", error)
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
    console.error("Error downloading PDF:", error)
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
    console.error("Error downloading combined PDF:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to download combined PDF: ${error.message}`)
    }
    throw new Error("Failed to download combined PDF")
  }
}

export async function viewEnrollmentPDF(enrollment: EnrollmentData) {
  try {
    const pdfBytes = await generateEnrollmentPDF(enrollment)
    const fileName = `enrollment-${enrollment.studentName.replace(/\s+/g, "-")}-${enrollment.id.slice(0, 8)}.pdf`
    const blob = new Blob([pdfBytes.buffer], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    // Open in new tab instead of downloading
    const newWindow = window.open(url, "_blank")
    if (newWindow) {
      newWindow.document.title = fileName
    }
    // Clean up the URL after a delay to allow the browser to load it
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 1000)
  } catch (error) {
    console.error("Error viewing PDF:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to view PDF: ${error.message}`)
    }
    throw new Error("Failed to view PDF")
  }
}

// Check if a course supports PDF viewing
export function supportsPdfViewing(courseName?: string | null): boolean {
  if (!courseName) return false

  const normalizedCourseName = courseName.toLowerCase().trim()

  return (
    normalizedCourseName.includes("phlebotomy") ||
    (normalizedCourseName.includes("nurse") &&
      normalizedCourseName.includes("aid") &&
      normalizedCourseName.includes("cna"))
  )
}