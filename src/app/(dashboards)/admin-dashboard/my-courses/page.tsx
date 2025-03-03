"use client"

import { useState, useEffect } from "react"
import {
  ChevronDown,
  Grid,
  List,
  Plus,
  Search,
  BookOpen,
  Calendar,
  DollarSign,
  Filter,
  ArrowUpRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/sidebar"

interface Course {
  id: string
  name: string
  duration: string
  price: number
  description: string
  classroom: string
  Lab?: string | null
  Clinic?: string | null
  WhoShouldAttend: string[]
  ProgramHighlights: string[]
  status: "DRAFT" | "ACTIVE"
  Note?: string | null
}

// Modern gradient backgrounds
const gradients = [
  "bg-gradient-to-br from-violet-600 to-indigo-800",
  "bg-gradient-to-br from-emerald-500 to-teal-700",
  "bg-gradient-to-br from-amber-500 to-orange-700",
  "bg-gradient-to-br from-rose-500 to-pink-700",
  "bg-gradient-to-br from-blue-600 to-indigo-900",
]

// Course card patterns
const patterns = [
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  "url(\"data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='%23ffffff' fillOpacity='0.1' fillRule='evenodd'/%3E%3C/svg%3E\")",
  "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='0.1' fillRule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
]

export default function CoursesPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "DRAFT">("ALL")

  useEffect(() => {
    // Simulate API call with mock data
    const mockCourses: Course[] = [
      {
        id: "1",
        name: "Introduction to Web Development",
        duration: "8 weeks",
        price: 299,
        description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
        classroom: "Virtual",
        WhoShouldAttend: ["Beginners", "Career Changers"],
        ProgramHighlights: ["Hands-on Projects", "Expert Instructors"],
        status: "ACTIVE",
      },
      {
        id: "2",
        name: "Advanced React & Next.js",
        duration: "10 weeks",
        price: 499,
        description: "Master React and Next.js to build modern, scalable web applications.",
        classroom: "Hybrid",
        Lab: "Online Lab",
        WhoShouldAttend: ["Intermediate Developers", "Frontend Engineers"],
        ProgramHighlights: ["Real-world Projects", "Code Reviews"],
        status: "ACTIVE",
      },
      {
        id: "3",
        name: "UX/UI Design Fundamentals",
        duration: "6 weeks",
        price: 349,
        description: "Learn the principles of user experience and interface design.",
        classroom: "In-person",
        WhoShouldAttend: ["Designers", "Developers"],
        ProgramHighlights: ["Portfolio Building", "Design Critiques"],
        status: "DRAFT",
      },
      {
        id: "4",
        name: "Data Science Bootcamp",
        duration: "12 weeks",
        price: 799,
        description: "Comprehensive introduction to data science, machine learning, and analytics.",
        classroom: "Virtual",
        Lab: "Data Lab",
        WhoShouldAttend: ["Analysts", "Tech Professionals"],
        ProgramHighlights: ["Real Dataset Projects", "Industry Mentors"],
        status: "ACTIVE",
      },
      {
        id: "5",
        name: "Mobile App Development",
        duration: "10 weeks",
        price: 599,
        description: "Build native mobile applications for iOS and Android platforms.",
        classroom: "Virtual",
        Lab: "Mobile Testing Lab",
        WhoShouldAttend: ["Web Developers", "CS Students"],
        ProgramHighlights: ["App Store Publishing", "Cross-platform Development"],
        status: "DRAFT",
      },
    ]

    setTimeout(() => {
      setCourses(mockCourses)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter courses based on search term and status
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || course.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Animation variants for list items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Thryve.today</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Sales Performance</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex-1 overflow-auto">
          {/* Main Content */}
          <main className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6 sm:py-12">
            <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  My Courses
                </h1>
                <p className="mt-1 text-zinc-500 dark:text-zinc-400">Manage and organize your educational content</p>
              </div>
              <Button className="group relative overflow-hidden rounded-full bg-[#10B981] px-4 sm:px-6 py-2 sm:py-6 text-white shadow-lg transition-all hover:shadow-xl hover:bg-[#10b981a8]">
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
                <div className="flex items-center rounded-full border border-zinc-200 bg-white/80 p-1 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
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
                <TabsTrigger
                  value="bundle-course"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 sm:px-6 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 dark:data-[state=active]:bg-zinc-950 dark:data-[state=active]:text-zinc-50"
                >
                  Bundle Courses
                  <Badge
                    variant="secondary"
                    className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-normal text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    0
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="my-course" className="mt-6 p-0">
                {loading ? (
                  <div className="flex flex-col items-center justify-center rounded-xl bg-white/50 py-20 backdrop-blur-sm dark:bg-zinc-900/50">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-emerald-500"></div>
                    <p className="mt-4 text-zinc-500 dark:text-zinc-400">Loading your courses...</p>
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-xl bg-white/50 py-20 backdrop-blur-sm dark:bg-zinc-900/50">
                    <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
                      <BookOpen className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-white">No courses found</h3>
                    <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                ) : viewMode === "list" ? (
                  <motion.div
                    className="overflow-hidden rounded-xl bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    <div className="hidden md:grid md:grid-cols-[1fr_auto_auto_auto] gap-6 border-b border-zinc-200 bg-zinc-50/80 p-4 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
                      <div>COURSE</div>
                      <div className="text-center">DURATION</div>
                      <div className="text-center">PRICE</div>
                      <div className="text-center">STATUS</div>
                    </div>
                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {filteredCourses.map((course, index) => (
                        <motion.div
                          key={course.id}
                          className="group grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] items-center gap-4 md:gap-6 p-4 md:p-6 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                          variants={item}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                            <div
                              className={cn(
                                "relative h-24 w-full sm:w-32 overflow-hidden rounded-lg",
                                gradients[index % gradients.length],
                              )}
                              style={{
                                backgroundImage: patterns[index % patterns.length],
                              }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center">
                                <BookOpen className="h-10 w-10 text-white/90" />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                              <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {course.name}
                              </h3>
                              <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                                {course.description}
                              </p>
                              <div className="mt-2 flex items-center gap-2">
                                <Badge
                                  variant={course.status === "ACTIVE" ? "default" : "secondary"}
                                  className={cn(
                                    "rounded-full px-2 py-0.5 text-xs font-normal",
                                    course.status === "ACTIVE"
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                      : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400",
                                  )}
                                >
                                  {course.status}
                                </Badge>
                                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                  Created: April 13, 2023
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-1 gap-2 mt-4 md:mt-0">
                            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                              <Calendar className="h-4 w-4 text-zinc-400" />
                              {course.duration}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
                              <DollarSign className="h-4 w-4 text-zinc-400" />
                              {course.price}
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "h-2.5 w-2.5 rounded-full",
                                  course.status === "ACTIVE" ? "bg-emerald-500" : "bg-zinc-400",
                                )}
                              />
                              <span className="text-sm text-zinc-600 dark:text-zinc-400">{course.status}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    {filteredCourses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        className="group overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl dark:bg-zinc-900 dark:shadow-zinc-900/10"
                        variants={item}
                      >
                        <div
                          className={cn("relative h-48 w-full overflow-hidden", gradients[index % gradients.length])}
                          style={{
                            backgroundImage: patterns[index % patterns.length],
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="h-16 w-16 text-white/90" />
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <Badge
                              variant={course.status === "ACTIVE" ? "default" : "secondary"}
                              className={cn(
                                "rounded-full px-3 py-1 text-xs font-medium",
                                course.status === "ACTIVE"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400"
                                  : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400",
                              )}
                            >
                              {course.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4 sm:p-6">
                          <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {course.name}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                            {course.description}
                          </p>
                          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4 text-zinc-400" />
                              <span className="text-zinc-600 dark:text-zinc-300">{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="h-4 w-4 text-zinc-400" />
                              <span className="font-bold text-zinc-900 dark:text-white">${course.price}</span>
                            </div>
                          </div>
                          <div className="mt-6 flex items-center justify-between">
                            <span className="text-xs text-zinc-400 dark:text-zinc-500">Created: April 13, 2023</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full border-zinc-200 dark:border-zinc-800 group-hover:border-emerald-500 group-hover:text-emerald-600 dark:group-hover:border-emerald-700 dark:group-hover:text-emerald-400"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="bundle-course">
                <div className="flex flex-col items-center justify-center rounded-xl bg-white/50 py-20 backdrop-blur-sm dark:bg-zinc-900/50">
                  <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
                    <BookOpen className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-white">No bundle courses yet</h3>
                  <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                    Create your first bundle to organize related courses
                  </p>
                  <Button className="mt-4 rounded-full" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Bundle
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </main>{" "}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

