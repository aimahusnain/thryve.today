"use client"

import { useState } from "react"
import { Check, Filter, MoreHorizontal, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const enrollments = [
  {
    id: "1",
    userName: "John Doe",
    userEmail: "john.doe@example.com",
    courseName: "Introduction to Web Development",
    relationship: "Student",
    paymentStatus: "Paid",
    enrollmentDate: "2023-05-15",
  },
  {
    id: "2",
    userName: "Jane Smith",
    userEmail: "jane.smith@example.com",
    courseName: "Advanced JavaScript",
    relationship: "Student",
    paymentStatus: "Pending",
    enrollmentDate: "2023-06-02",
  },
  {
    id: "3",
    userName: "Emily Davis",
    userEmail: "emily.davis@example.com",
    courseName: "UX/UI Design Fundamentals",
    relationship: "Student",
    paymentStatus: "Paid",
    enrollmentDate: "2023-04-20",
  },
  {
    id: "4",
    userName: "Robert Wilson",
    userEmail: "robert.wilson@example.com",
    courseName: "Introduction to Web Development",
    relationship: "Student",
    paymentStatus: "Paid",
    enrollmentDate: "2023-05-22",
  },
  {
    id: "5",
    userName: "Sarah Johnson",
    userEmail: "sarah.johnson@example.com",
    courseName: "Data Science Basics",
    relationship: "Student",
    paymentStatus: "Failed",
    enrollmentDate: "2023-06-10",
  },
  {
    id: "6",
    userName: "David Brown",
    userEmail: "david.brown@example.com",
    courseName: "Advanced JavaScript",
    relationship: "Corporate",
    paymentStatus: "Paid",
    enrollmentDate: "2023-05-05",
  },
  {
    id: "7",
    userName: "Lisa Anderson",
    userEmail: "lisa.anderson@example.com",
    courseName: "UX/UI Design Fundamentals",
    relationship: "Student",
    paymentStatus: "Pending",
    enrollmentDate: "2023-06-15",
  },
]

// Available courses for filtering
const courses = [
  "Introduction to Web Development",
  "Advanced JavaScript",
  "UX/UI Design Fundamentals",
  "Data Science Basics",
]

// Available relationships for filtering
const relationships = ["Student", "Corporate", "Partner"]

export function CoursesView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [selectedRelationships, setSelectedRelationships] = useState<string[]>([])
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Filter enrollments based on search and filters
  const filteredEnrollments = enrollments.filter((enrollment) => {
    // Search filter
    const matchesSearch =
      enrollment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.courseName.toLowerCase().includes(searchTerm.toLowerCase())

    // Course filter
    const matchesCourse = selectedCourses.length === 0 || selectedCourses.includes(enrollment.courseName)

    // Relationship filter
    const matchesRelationship =
      selectedRelationships.length === 0 || selectedRelationships.includes(enrollment.relationship)

    // Payment status filter
    const matchesPaymentStatus = selectedPaymentStatus === null || enrollment.paymentStatus === selectedPaymentStatus

    return matchesSearch && matchesCourse && matchesRelationship && matchesPaymentStatus
  })

  // Toggle course selection
  const toggleCourseSelection = (course: string) => {
    setSelectedCourses((prev) => (prev.includes(course) ? prev.filter((c) => c !== course) : [...prev, course]))
  }

  // Toggle relationship selection
  const toggleRelationshipSelection = (relationship: string) => {
    setSelectedRelationships((prev) =>
      prev.includes(relationship) ? prev.filter((r) => r !== relationship) : [...prev, relationship],
    )
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedCourses([])
    setSelectedRelationships([])
    setSelectedPaymentStatus(null)
  }

  // Check if any filters are active
  const hasActiveFilters =
    selectedCourses.length > 0 || selectedRelationships.length > 0 || selectedPaymentStatus !== null

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64 md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search enrollments..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 rounded-full px-1">
                {selectedCourses.length + selectedRelationships.length + (selectedPaymentStatus ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </div>
        <Button>Add Enrollment</Button>
      </div>

      {showFilters && (
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Course</h3>
                <div className="flex flex-wrap gap-2">
                  {courses.map((course) => (
                    <Badge
                      key={course}
                      variant={selectedCourses.includes(course) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleCourseSelection(course)}
                    >
                      {course}
                      {selectedCourses.includes(course) && (
                        <X
                          className="ml-1 h-3 w-3"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleCourseSelection(course)
                          }}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Relationship</h3>
                <div className="flex flex-wrap gap-2">
                  {relationships.map((relationship) => (
                    <Badge
                      key={relationship}
                      variant={selectedRelationships.includes(relationship) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleRelationshipSelection(relationship)}
                    >
                      {relationship}
                      {selectedRelationships.includes(relationship) && (
                        <X
                          className="ml-1 h-3 w-3"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleRelationshipSelection(relationship)
                          }}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Payment Status</h3>
                <Select
                  value={selectedPaymentStatus || ""}
                  onValueChange={(value) => setSelectedPaymentStatus(value || null)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
                Clear filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Course Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Enrollment Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{enrollment.userName}</div>
                      <div className="text-sm text-muted-foreground">{enrollment.userEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{enrollment.courseName}</TableCell>
                  <TableCell>{enrollment.relationship}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        enrollment.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : enrollment.paymentStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {enrollment.paymentStatus === "Paid" && <Check className="mr-1 h-3 w-3" />}
                      {enrollment.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell>{enrollment.enrollmentDate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit enrollment</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete enrollment</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEnrollments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No enrollments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}