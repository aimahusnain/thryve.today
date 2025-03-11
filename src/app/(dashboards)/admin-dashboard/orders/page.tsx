import { getEnrollmentDetails } from "@/lib/dashboard-actions"
import { AppSidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { Download, ExternalLink } from "lucide-react"
import Link from "next/link"

export default async function OrdersPage() {
  const enrollments = await getEnrollmentDetails()

  // Format currency
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: Date) => {
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
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
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
                      <TableRow key={enrollment.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{enrollment.studentName}</div>
                            <div className="text-sm text-muted-foreground">{enrollment.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{enrollment.courseName}</TableCell>
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
                          <Link href={`/dashboard/orders/${enrollment.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

