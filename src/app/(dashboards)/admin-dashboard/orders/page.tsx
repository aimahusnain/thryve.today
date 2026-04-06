"use client"

import React from "react"
import { useState, useEffect } from "react"
import { getEnrollmentDetails, deleteEnrollment, getFullEnrollmentById } from "@/lib/enrollment-actions"
import { downloadEnrollmentPDF, viewEnrollmentPDF } from "@/lib/pdf-generator"
import { AppSidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { EnrollmentDocumentsSection } from "@/components/admin/enrollment-documents-section"
import {
  Download,
  Phone,
  User,
  Calendar,
  Mail,
  CreditCard,
  Clock,
  RefreshCcw,
  FileText,
  FolderOpen,
  Eye,
  DollarSign,
  CheckCircle,
} from "lucide-react"
import { toast } from "sonner"

// Define types based on the available fields
type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED"

interface Enrollment {
  id: string
  studentName: string
  email: string
  phoneCell: string
  paymentStatus: PaymentStatus
  paymentAmount: number | null // Update to allow null
  paymentDate?: Date | string | null // Update to allow null
  createdAt: Date | string
  courseId?: string | null // Update to allow null
  courseName?: string
}

export default function OrdersPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null)
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null)
  const [manualPaymentDialog, setManualPaymentDialog] = useState<Enrollment | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)

  // Fetch enrollment data
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getEnrollmentDetails()
        setEnrollments(data)
      } catch (error) {
        console.error("Error fetching enrollment data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Format currency
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: Date | string | null | undefined) => {
    if (!dateString) return "N/A"
    return format(new Date(dateString), "MMM dd, yyyy")
  }

  // Calculate total revenue
  const totalRevenue = enrollments
    .filter((enrollment) => enrollment.paymentStatus === "COMPLETED")
    .reduce((sum, enrollment) => sum + (enrollment.paymentAmount || 0), 0)

  // Group enrollments by payment status
  const completedCount = enrollments.filter((e) => e.paymentStatus === "COMPLETED").length
  const pendingCount = enrollments.filter((e) => e.paymentStatus === "PENDING").length
  const failedCount = enrollments.filter((e) => e.paymentStatus === "FAILED").length

  const handleViewPDF = async (enrollmentId: string) => {
    try {
      setDownloadingPdf(enrollmentId)

      const fullEnrollment = await getFullEnrollmentById(enrollmentId)
      await viewEnrollmentPDF(fullEnrollment)

      toast.success("PDF Opened", {
        description: "The enrollment agreement has been opened in a new tab.",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      })
    } catch (error) {
      console.error("Error viewing PDF:", error)
      toast.error("View Failed", {
        description: "Failed to view the enrollment agreement. Please try again.",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      })
    } finally {
      setDownloadingPdf(null)
    }
  }

  const handleDownloadPDF = async (enrollmentId: string) => {
    try {
      setDownloadingPdf(enrollmentId)

      // Get full enrollment data
      const fullEnrollment = await getFullEnrollmentById(enrollmentId)

      // Generate and download PDF
      downloadEnrollmentPDF(fullEnrollment)

      toast.success("PDF Downloaded", {
        description: "The enrollment agreement has been downloaded successfully.",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      })
    } catch (error) {
      console.error("Error downloading PDF:", error)
      toast.error("Download Failed", {
        description: "Failed to download the enrollment agreement. Please try again.",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      })
    } finally {
      setDownloadingPdf(null)
    }
  }

  // Handle delete enrollment
  const handleDeleteEnrollment = async (id: string) => {
    try {
      await deleteEnrollment(id)
      // Update local state to remove the deleted enrollment
      setEnrollments(enrollments.filter((enrollment) => enrollment.id !== id))
      toast.success("Order deleted", {
        description: "The enrollment has been successfully deleted.",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      })
    } catch (error) {
      console.error("Error deleting enrollment:", error)
      toast.error("Error", {
        description: "Failed to delete enrollment. Please try again.",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      })
    }
  }

  // Handle manual payment completion
  const handleManualPaymentCompletion = async (enrollment: Enrollment) => {
    try {
      setProcessingPayment(true)

      // Import the function to update payment status
      const { updateEnrollmentPaymentStatus } = await import("@/lib/enrollment-actions")

      // Update payment status to COMPLETED
      await updateEnrollmentPaymentStatus(
        enrollment.id,
        "COMPLETED",
        enrollment.paymentAmount || undefined,
        `MANUAL-${Date.now()}`
      )

      // Update local state
      setEnrollments(enrollments.map((e) =>
        e.id === enrollment.id
          ? { ...e, paymentStatus: "COMPLETED" as PaymentStatus, paymentDate: new Date() }
          : e
      ))

      toast.success("Payment Completed", {
        description: `Payment for ${enrollment.studentName} has been marked as complete.`,
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      })

      setManualPaymentDialog(null)
    } catch (error) {
      console.error("Error completing manual payment:", error)
      toast.error("Error", {
        description: "Failed to complete payment. Please try again.",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      })
    } finally {
      setProcessingPayment(false)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Orders & Revenue</h1>
              <p className="text-muted-foreground">Manage course enrollments and payments</p>
            </div>
            <div className="flex gap-2">
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button
                variant="outline"
                className="flex flex-row gap-2 bg-transparent"
                onClick={() => {
                  setLoading(true)
                  getEnrollmentDetails().then((data) => {
                    setEnrollments(data)
                    setLoading(false)
                  })
                }}
              >
                <RefreshCcw />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground mt-1">From {completedCount} completed payments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Successful enrollments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{failedCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Payment issues</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse text-muted-foreground">Loading...</div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No enrollments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      enrollments.map((enrollment) => (
                        <React.Fragment key={enrollment.id}>
                          <TableRow>
                            <TableCell>
                              <div>
                                <div className="font-medium">{enrollment.studentName}</div>
                                <div className="text-sm text-muted-foreground">{enrollment.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>{enrollment.courseName || "N/A"}</TableCell>
                            <TableCell>{formatDate(enrollment.createdAt)}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`${
                                  enrollment.paymentStatus === "COMPLETED"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100 uppercase"
                                    : enrollment.paymentStatus === "FAILED"
                                      ? "bg-red-100 uppercase text-red-800 hover:bg-red-100"
                                      : "bg-orange-100 uppercase text-orange-800 hover:bg-orange-100"
                                }`}
                              >
                                {enrollment.paymentStatus === "COMPLETED"
                                  ? "Completed/PAID"
                                  : enrollment.paymentStatus === "PENDING"
                                    ? "Pending/UNPAID"
                                    : "Failed/CANNOT PAY"}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatCurrency(enrollment.paymentAmount)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewPDF(enrollment.id)
                                  }}
                                  disabled={downloadingPdf === enrollment.id}
                                  title="View PDF in browser"
                                >
                                  {downloadingPdf === enrollment.id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                  ) : (
                                    <FileText className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">View PDF</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDownloadPDF(enrollment.id)
                                  }}
                                  disabled={downloadingPdf === enrollment.id}
                                  title="Download PDF"
                                >
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download PDF</span>
                                </Button>
                                {enrollment.paymentStatus === "PENDING" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setManualPaymentDialog(enrollment)
                                    }}
                                    title="Mark as paid (cash/check)"
                                  >
                                    <DollarSign className="h-4 w-4" />
                                    <span className="sr-only">Mark as paid</span>
                                  </Button>
                                )}
                                <DeleteConfirmationDialog
                                  id={enrollment.id}
                                  name={enrollment.studentName}
                                  onDelete={handleDeleteEnrollment}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => setSelectedEnrollment(enrollment)}
                                  title="View details"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View details</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Enrollment Details Dialog */}
          <Dialog open={!!selectedEnrollment} onOpenChange={() => setSelectedEnrollment(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Enrollment Details</DialogTitle>
                <DialogDescription>
                  View detailed information about this enrollment
                </DialogDescription>
              </DialogHeader>
              {selectedEnrollment && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Student Information */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Student Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Name</p>
                          <p className="text-sm text-muted-foreground">{selectedEnrollment.studentName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{selectedEnrollment.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">{selectedEnrollment.phoneCell}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Status</p>
                          <p className="text-sm">
                            <Badge
                              variant="outline"
                              className={`${
                                selectedEnrollment.paymentStatus === "COMPLETED"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : selectedEnrollment.paymentStatus === "FAILED"
                                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                                    : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                              }`}
                            >
                              {selectedEnrollment.paymentStatus === "COMPLETED"
                                ? "Completed/PAID"
                                : selectedEnrollment.paymentStatus === "PENDING"
                                  ? "Pending/UNPAID"
                                  : "Failed/CANNOT PAY"}
                            </Badge>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Amount</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(selectedEnrollment.paymentAmount)}
                          </p>
                        </div>
                      </div>
                      {selectedEnrollment.paymentDate && (
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Payment Date</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(selectedEnrollment.paymentDate)}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedEnrollment.courseName && (
                        <div className="flex items-start gap-2">
                          <div className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Course</p>
                            <p className="text-sm text-muted-foreground">{selectedEnrollment.courseName}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Enrollment Date</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(selectedEnrollment.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 border-t pt-4 space-y-3">
                    <h3 className="font-semibold flex items-center gap-2 text-sm">
                      <FolderOpen className="h-4 w-4" />
                      Order documents
                    </h3>
                    <EnrollmentDocumentsSection enrollmentId={selectedEnrollment.id} />
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Manual Payment Completion Dialog */}
          <Dialog open={!!manualPaymentDialog} onOpenChange={() => setManualPaymentDialog(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Complete Manual Payment
                </DialogTitle>
                <DialogDescription>
                  Confirm that you have received payment from this student via cash or check.
                </DialogDescription>
              </DialogHeader>
              {manualPaymentDialog && (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Student:</span>
                      <span className="text-sm">{manualPaymentDialog.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Email:</span>
                      <span className="text-sm text-muted-foreground">{manualPaymentDialog.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Amount:</span>
                      <span className="text-sm font-semibold">{formatCurrency(manualPaymentDialog.paymentAmount)}</span>
                    </div>
                    {manualPaymentDialog.courseName && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Course:</span>
                        <span className="text-sm">{manualPaymentDialog.courseName}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> This will mark the payment as completed and record the current date as the payment date. Use this only for cash or check payments that you have received.
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setManualPaymentDialog(null)}
                      disabled={processingPayment}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleManualPaymentCompletion(manualPaymentDialog)}
                      disabled={processingPayment}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {processingPayment ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4 mr-1" />
                          Confirm Payment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
