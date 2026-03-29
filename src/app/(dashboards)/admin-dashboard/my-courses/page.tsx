"use client"


import { CourseForm } from "@/components/dashboard/courses/course-form"
import { CourseGrid } from "@/components/dashboard/courses/course-grid"
import { CourseList } from "@/components/dashboard/courses/course-list"
import { DeleteConfirmationDialog } from "@/components/dashboard/courses/delete-confirmation-dialog"
import { EmptyState } from "@/components/dashboard/courses/empty-state"
import { LoadingState } from "@/components/dashboard/courses/loading-state"
import { AppSidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Course } from "@/types/course"
import { motion } from "framer-motion"
import { ChevronDown, Filter, Grid, List, Plus, Search } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

export default function CoursesPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "DRAFT">("ALL")
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null)
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null)

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Fetch courses from API
  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/courses")
      if (!response.ok) {
        throw new Error("Failed to fetch courses")
      }
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      console.error("Error fetching courses:", error)
      toast.error("Failed to load courses. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  // Filter courses based on search term and status
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || course.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleEditCourse = (course: Course) => {
    setCourseToEdit(course)
    setFormDialogOpen(true)
  }

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return

    try {
      const response = await fetch(`/api/courses?id=${courseToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete course")
      }

      // Refresh courses list
      await fetchCourses()

      toast.success("Course deleted successfully", {
        style: { background: "#10B981", color: "white" },
        icon: "🎉",
      })
    } catch (error) {
      console.error("Error deleting course:", error)
      toast.error("Failed to delete course. Please try again.")
    } finally {
      setCourseToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const confirmDeleteCourse = (courseId: string) => {
    setCourseToDelete(courseId)
    setDeleteDialogOpen(true)
  }

  const handleFormDialogOpenChange = (open: boolean) => {
    setFormDialogOpen(open)
    if (!open) {
      setCourseToEdit(null)
    }
  }

  const handleFormSubmitSuccess = () => {
    fetchCourses()
    setFormDialogOpen(false)
    setCourseToEdit(null)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href="#"
                    className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
                  >
                    Thryve.today
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>My Courses</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-zinc-50/50 dark:bg-zinc-900/50">
          {/* Main Content */}
          <main className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6 sm:py-12">
            <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  My Courses
                </h1>
                <p className="mt-1 text-zinc-500 dark:text-zinc-400">Manage and organize your educational content</p>
              </div>

              <Button
                onClick={() => setFormDialogOpen(true)}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 sm:px-6 py-2 sm:py-6 text-white shadow-lg transition-all hover:shadow-xl hover:from-emerald-600 hover:to-teal-600"
              >
                <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></span>
                <Plus className="mr-2 h-5 w-5" />
                <span className="whitespace-nowrap">Create New Course</span>
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  placeholder="Search courses..."
                  className="pl-10 rounded-full border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 rounded-full border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80"
                    >
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {statusFilter === "ALL"
                          ? "All Courses"
                          : statusFilter === "ACTIVE"
                            ? "Active Courses"
                            : "Draft Courses"}
                      </span>
                      <span className="sm:hidden">
                        {statusFilter === "ALL" ? "All" : statusFilter === "ACTIVE" ? "Active" : "Draft"}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuItem onClick={() => setStatusFilter("ALL")}>All Courses</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("ACTIVE")}>Active Courses</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("DRAFT")}>Draft Courses</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="hidden sm:flex items-center rounded-full border border-zinc-200 bg-white/80 p-1 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8 rounded-full", viewMode === "list" && "bg-zinc-100 dark:bg-zinc-800")}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8 rounded-full", viewMode === "grid" && "bg-zinc-100 dark:bg-zinc-800")}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="my-course" className="mb-8">
              <TabsList className="w-full sm:w-auto inline-flex h-10 items-center justify-center rounded-full bg-zinc-100 p-1 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                <TabsTrigger
                  value="my-course"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 sm:px-6 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 dark:data-[state=active]:bg-zinc-950 dark:data-[state=active]:text-zinc-50"
                >
                  My Courses
                  <Badge
                    variant="secondary"
                    className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-normal text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    {filteredCourses.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="my-course" className="mt-6 p-0">
                {loading ? (
                  <LoadingState />
                ) : filteredCourses.length === 0 ? (
                  <EmptyState />
                ) : viewMode === "list" ? (
                  <motion.div variants={container} initial="hidden" animate="show">
                    <CourseList courses={filteredCourses} onEdit={handleEditCourse} onDelete={confirmDeleteCourse} />
                  </motion.div>
                ) : (
                  <motion.div variants={container} initial="hidden" animate="show">
                    <CourseGrid courses={filteredCourses} onEdit={handleEditCourse} onDelete={confirmDeleteCourse} />
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </SidebarInset>

      {/* Course Form Dialog */}
      <CourseForm
        open={formDialogOpen}
        onOpenChange={handleFormDialogOpenChange}
        course={courseToEdit}
        onSuccess={handleFormSubmitSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteCourse}
      />

      {/* <Toaster position="top-right" richColors /> */}
    </SidebarProvider>
  )
}

