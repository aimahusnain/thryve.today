"use client"

import React from "react"
import { useState, useEffect } from "react"
import { getEnrollmentDetails, deleteEnrollment } from "@/lib/enrollment-actions"
import { AppSidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import {
  ChevronDown,
  ChevronUp,
  Download,
  Phone,
  User,
  Calendar,
  Mail,
  CreditCard,
  Clock,
  RefreshCcw,
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
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

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

  // Toggle expanded row
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Handle delete enrollment
  const handleDeleteEnrollment = async (id: string) => {
    try {
      await deleteEnrollment(id)
      // Update local state to remove the deleted enrollment
      setEnrollments(enrollments.filter((enrollment) => enrollment.id !== id))
      toast.success("Order deleted", {
        description: "The enrollment has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting enrollment:", error)
      toast.error("Error", {
        description: "Failed to delete enrollment. Please try again.",
      })
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
                className="flex flex-row gap-2 "
                onClick={() => {
                  setLoading(true)
                  getEnrollmentDetails().then((data) => {
                    setEnrollments(data)
                    setLoading(false)
                  })
                }}
              >
                <RefreshCcw /> Refresh
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
                          <TableRow
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => toggleExpand(enrollment.id)}
                          >
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
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : enrollment.paymentStatus === "FAILED"
                                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                                      : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                                }`}
                              >
                                {enrollment.paymentStatus}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatCurrency(enrollment.paymentAmount)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <DeleteConfirmationDialog
                                  id={enrollment.id}
                                  name={enrollment.studentName}
                                  onDelete={handleDeleteEnrollment}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleExpand(enrollment.id)
                                  }}
                                >
                                  {expandedId === enrollment.id ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">
                                    {expandedId === enrollment.id ? "Collapse" : "Expand"}
                                  </span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedId === enrollment.id && (
                            <TableRow className="bg-muted/30">
                              <TableCell colSpan={6} className="p-0">
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Student Information */}
                                  <div className="space-y-3">
                                    <h3 className="font-semibold flex items-center gap-2">
                                      <User className="h-4 w-4" /> Student Information
                                    </h3>
                                    <div className="space-y-2">
                                      <div className="flex items-start gap-2">
                                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                          <p className="text-sm font-medium">Name</p>
                                          <p className="text-sm text-muted-foreground">{enrollment.studentName}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                          <p className="text-sm font-medium">Email</p>
                                          <p className="text-sm text-muted-foreground">{enrollment.email}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                          <p className="text-sm font-medium">Phone</p>
                                          <p className="text-sm text-muted-foreground">{enrollment.phoneCell}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Payment Details */}
                                  <div className="space-y-3">
                                    <h3 className="font-semibold flex items-center gap-2">
                                      <CreditCard className="h-4 w-4" /> Payment Details
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
                                                enrollment.paymentStatus === "COMPLETED"
                                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                  : enrollment.paymentStatus === "FAILED"
                                                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                                                    : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                                              }`}
                                            >
                                              {enrollment.paymentStatus}
                                            </Badge>
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <div className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                          <p className="text-sm font-medium">Amount</p>
                                          <p className="text-sm text-muted-foreground">
                                            {formatCurrency(enrollment.paymentAmount)}
                                          </p>
                                        </div>
                                      </div>
                                      {enrollment.paymentDate && (
                                        <div className="flex items-start gap-2">
                                          <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                                          <div>
                                            <p className="text-sm font-medium">Payment Date</p>
                                            <p className="text-sm text-muted-foreground">
                                              {formatDate(enrollment.paymentDate)}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                      {enrollment.courseName && (
                                        <div className="flex items-start gap-2">
                                          <div className="h-4 w-4 text-muted-foreground mt-0.5" />
                                          <div>
                                            <p className="text-sm font-medium">Course</p>
                                            <p className="text-sm text-muted-foreground">{enrollment.courseName}</p>
                                          </div>
                                        </div>
                                      )}
                                      <div className="flex items-start gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                          <p className="text-sm font-medium">Enrollment Date</p>
                                          <p className="text-sm text-muted-foreground">
                                            {formatDate(enrollment.createdAt)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

