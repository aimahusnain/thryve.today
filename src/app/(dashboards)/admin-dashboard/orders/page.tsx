"use client"

import { AppSidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getEnrollments } from "@/lib/enrollment-actions"
import type { Enrollment } from "@prisma/client"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react"
import { useEffect, useState } from "react"

export default function EnrollmentsDashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("ALL")

  useEffect(() => {
    async function loadEnrollments() {
      try {
        const data = await getEnrollments()
        setEnrollments(data)
      } catch (error) {
        console.error("Failed to load enrollments:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEnrollments()
  }, [])

  // Filter enrollments based on search query, date range, and payment status
  const filteredEnrollments = enrollments.filter((enrollment) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      enrollment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.id.toLowerCase().includes(searchQuery.toLowerCase())

    // Date filter
    const enrollmentDate = new Date(enrollment.createdAt)
    const matchesDate = !date.from || !date.to || (enrollmentDate >= date.from && enrollmentDate <= date.to)

    // Payment status filter
    const matchesPayment = paymentFilter === "ALL" || enrollment.paymentStatus === paymentFilter

    return matchesSearch && matchesDate && matchesPayment
  })

  // Pagination
  const itemsPerPage = 7
  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage)
  const paginatedEnrollments = filteredEnrollments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Format currency
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "N/A"
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  }

  // Format date
  const formatDate = (dateString: Date) => {
    return format(new Date(dateString), "MMM dd, yyyy")
  }

  // Generate and download CSV
  const downloadCSV = () => {
    // Define CSV headers
    const headers = ["ID", "Student Name", "Date", "Email", "Phone", "Payment Status", "Amount"]

    // Map enrollments to CSV rows
    const csvRows = filteredEnrollments.map((enrollment) => [
      enrollment.id,
      enrollment.studentName,
      formatDate(enrollment.createdAt),
      enrollment.email,
      enrollment.phoneCell || "",
      enrollment.paymentStatus,
      enrollment.paymentAmount ? enrollment.paymentAmount.toString() : "N/A",
    ])

    // Combine headers and rows
    const csvContent = [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n")

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

    // Create a download link and trigger the download
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `enrollments-${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-full">
          {/* Tabs */}
          <div className="p-4 flex justify-center items-center w-full border-b">
            <Tabs
              defaultValue="all"
              onValueChange={(value) => setPaymentFilter(value === "all" ? "ALL" : value.toUpperCase())}
            >
              <TabsList className="bg-background border">
                <TabsTrigger value="all" className="data-[state=active]:bg-background">
                  All Enrollments
                </TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Search and filters */}
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                className="pl-8 h-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
          
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    {date.from && date.to
                      ? `${format(date.from, "dd MMM")} - ${format(date.to, "dd MMM")}`
                      : "Select Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2 bg-white border rounded-md shadow-md">
                  <Calendar mode="range" selected={date} onSelect={setDate as any} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-2">
              <Button className="bg-[#2DB188] rounded-full hover:bg-[#29a37e] h-9" onClick={downloadCSV}>
                <Download className="mr-2 h-4 w-4" />
                Download as CSV
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 p-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading enrollments...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]"></TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEnrollments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No enrollments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedEnrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{enrollment.studentName}</div>
                            <div className="text-sm text-muted-foreground">#{enrollment.id.substring(0, 8)}</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(enrollment.createdAt)}</TableCell>
                        <TableCell>
                          <div>
                            <div>{enrollment.email}</div>
                            <div className="text-sm text-muted-foreground">{enrollment.phoneCell}</div>
                          </div>
                        </TableCell>
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
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="p-4 border-t flex items-center justify-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                )
              })}

              {totalPages > 5 && (
                <>
                  {currentPage > 5 && <span className="mx-1">...</span>}
                  {currentPage > 5 && (
                    <Button
                      variant={currentPage === totalPages ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  )}
                </>
              )}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

