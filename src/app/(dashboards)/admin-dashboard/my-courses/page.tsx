"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
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
  X,
  Check,
  Clock,
  Users,
  Briefcase,
  School,
  FileText,
  Trash2,
  Edit,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toaster } from "sonner"
import { toast } from "sonner"

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
  createdAt?: Date
  updatedAt?: Date
}

// Abstract gradient images from Unsplash
const unsplashImages = [
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
]

export default function CoursesPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "DRAFT">("ALL")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null)

  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    name: "",
    description: "",
    duration: "",
    price: 0,
    classroom: "Virtual",
    status: "DRAFT",
    WhoShouldAttend: [],
    ProgramHighlights: [],
  })

  const [whoShouldAttend, setWhoShouldAttend] = useState("")
  const [programHighlight, setProgramHighlight] = useState("")

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCourse((prev) => ({
      ...prev,
      [name]: name === "price" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewCourse((prev) => ({ ...prev, [name]: value }))
  }

  const addWhoShouldAttend = () => {
    if (whoShouldAttend.trim()) {
      setNewCourse((prev) => ({
        ...prev,
        WhoShouldAttend: [...(prev.WhoShouldAttend || []), whoShouldAttend.trim()],
      }))
      setWhoShouldAttend("")
    }
  }

  const removeWhoShouldAttend = (index: number) => {
    setNewCourse((prev) => ({
      ...prev,
      WhoShouldAttend: (prev.WhoShouldAttend || []).filter((_, i) => i !== index),
    }))
  }

  const addProgramHighlight = () => {
    if (programHighlight.trim()) {
      setNewCourse((prev) => ({
        ...prev,
        ProgramHighlights: [...(prev.ProgramHighlights || []), programHighlight.trim()],
      }))
      setProgramHighlight("")
    }
  }

  const removeProgramHighlight = (index: number) => {
    setNewCourse((prev) => ({
      ...prev,
      ProgramHighlights: (prev.ProgramHighlights || []).filter((_, i) => i !== index),
    }))
  }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleCreateCourse = async () => {
    try {
      const courseData = {
        name: newCourse.name || "Untitled Course",
        description: newCourse.description || "No description provided.",
        duration: newCourse.duration || "Not specified",
        price: newCourse.price || 0,
        classroom: newCourse.classroom || "Virtual",
        Lab: newCourse.Lab,
        Clinic: newCourse.Clinic,
        status: newCourse.status || "DRAFT",
        WhoShouldAttend: newCourse.WhoShouldAttend || [],
        ProgramHighlights: newCourse.ProgramHighlights || [],
        Note: newCourse.Note,
      }

      let response

      if (isEditing && newCourse.id) {
        // Update existing course
        response = await fetch(`/api/courses?id=${newCourse.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
        })
      } else {
        // Create new course
        response = await fetch("/api/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
        })
      }

      if (!response.ok) {
        throw new Error(isEditing ? "Failed to update course" : "Failed to create course")
      }

      // Refresh courses list
      await fetchCourses()

      // Reset form and close dialog
      resetForm()

      toast.success(isEditing ? "Course updated successfully" : "Course created successfully")
    } catch (error) {
      console.error(isEditing ? "Error updating course:" : "Error creating course:", error)
      toast.error(
        isEditing ? "Failed to update course. Please try again." : "Failed to create course. Please try again.",
      )
    }
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

      toast.success("Course deleted successfully")
    } catch (error) {
      console.error("Error deleting course:", error)
      toast.error("Failed to delete course. Please try again.")
    } finally {
      setCourseToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleEditCourse = (course: Course) => {
    setNewCourse({
      ...course,
    })
    setIsEditing(true)
    setCurrentStep(1)
    setDialogOpen(true)
  }

  const confirmDeleteCourse = (courseId: string) => {
    setCourseToDelete(courseId)
    setDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setNewCourse({
      name: "",
      description: "",
      duration: "",
      price: 0,
      classroom: "Virtual",
      status: "DRAFT",
      WhoShouldAttend: [],
      ProgramHighlights: [],
    })
    setCurrentStep(1)
    setIsEditing(false)
    setDialogOpen(false)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const formatDate = (dateString?: Date) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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
                  <BreadcrumbPage>My Courses</BreadcrumbPage>
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
              <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger asChild>
                  <Button className="group relative overflow-hidden rounded-full bg-[#10B981] px-4 sm:px-6 py-2 sm:py-6 text-white shadow-lg transition-all hover:shadow-xl hover:bg-[#10b981a8]">
                    <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></span>
                    <Plus className="mr-2 h-5 w-5" />
                    <span className="whitespace-nowrap">Create New Course</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
                  <div className="flex flex-col h-full">
                    {/* Dialog Header with Steps */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                      <DialogTitle className="text-2xl font-bold">
                        {isEditing ? "Edit Course" : "Create New Course"}
                      </DialogTitle>
                      <DialogDescription className="text-emerald-50 mt-1">
                        {isEditing ? "Update the course details" : "Fill in the details to create a new course"}
                      </DialogDescription>

                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              currentStep >= 1 ? "bg-white text-emerald-600" : "bg-emerald-700 text-white"
                            }`}
                          >
                            {currentStep > 1 ? <Check className="h-5 w-5" /> : "1"}
                          </div>
                          <div className="text-sm font-medium">Basic Info</div>
                        </div>
                        <div className="w-12 h-0.5 bg-emerald-400"></div>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              currentStep >= 2 ? "bg-white text-emerald-600" : "bg-emerald-700 text-white"
                            }`}
                          >
                            {currentStep > 2 ? <Check className="h-5 w-5" /> : "2"}
                          </div>
                          <div className="text-sm font-medium">Details</div>
                        </div>
                        <div className="w-12 h-0.5 bg-emerald-400"></div>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              currentStep >= 3 ? "bg-white text-emerald-600" : "bg-emerald-700 text-white"
                            }`}
                          >
                            3
                          </div>
                          <div className="text-sm font-medium">Review</div>
                        </div>
                      </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-6 flex-1 overflow-y-auto max-h-[60vh]">
                      {currentStep === 1 && (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-base">
                              Course Name
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="e.g. Introduction to Web Development"
                              value={newCourse.name}
                              onChange={handleInputChange}
                              className="h-12"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description" className="text-base">
                              Description
                            </Label>
                            <Textarea
                              id="description"
                              name="description"
                              placeholder="Describe what students will learn in this course"
                              rows={4}
                              value={newCourse.description}
                              onChange={handleInputChange}
                              className="resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="duration" className="text-base">
                                Duration
                              </Label>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                <Input
                                  id="duration"
                                  name="duration"
                                  placeholder="e.g. 8 weeks"
                                  value={newCourse.duration}
                                  onChange={handleInputChange}
                                  className="h-12 pl-10"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="price" className="text-base">
                                Price ($)
                              </Label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                <Input
                                  id="price"
                                  name="price"
                                  type="number"
                                  placeholder="e.g. 299"
                                  value={newCourse.price || ""}
                                  onChange={handleInputChange}
                                  className="h-12 pl-10"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label className="text-base">Classroom Type</Label>
                            <RadioGroup
                              value={newCourse.classroom || "Virtual"}
                              onValueChange={(value) => handleSelectChange("classroom", value)}
                              className="grid grid-cols-1 md:grid-cols-3 gap-2"
                            >
                              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-zinc-50 transition-colors">
                                <RadioGroupItem value="Virtual" id="virtual" />
                                <Label htmlFor="virtual" className="cursor-pointer flex items-center">
                                  <School className="mr-2 h-4 w-4 text-zinc-500" />
                                  Virtual
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-zinc-50 transition-colors">
                                <RadioGroupItem value="In-person" id="in-person" />
                                <Label htmlFor="in-person" className="cursor-pointer flex items-center">
                                  <Users className="mr-2 h-4 w-4 text-zinc-500" />
                                  In-person
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-zinc-50 transition-colors">
                                <RadioGroupItem value="Hybrid" id="hybrid" />
                                <Label htmlFor="hybrid" className="cursor-pointer flex items-center">
                                  <Briefcase className="mr-2 h-4 w-4 text-zinc-500" />
                                  Hybrid
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-base">Status</Label>
                            <Select
                              value={newCourse.status || "DRAFT"}
                              onValueChange={(value) => handleSelectChange("status", value)}
                            >
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-base">Who Should Attend</Label>
                            <div className="flex space-x-2">
                              <Input
                                placeholder="e.g. Beginners"
                                value={whoShouldAttend}
                                onChange={(e) => setWhoShouldAttend(e.target.value)}
                                className="h-12"
                              />
                              <Button type="button" onClick={addWhoShouldAttend} className="shrink-0">
                                Add
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {newCourse.WhoShouldAttend?.map((item, index) => (
                                <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                                  {item}
                                  <button
                                    type="button"
                                    onClick={() => removeWhoShouldAttend(index)}
                                    className="ml-2 text-zinc-400 hover:text-zinc-700"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-base">Program Highlights</Label>
                            <div className="flex space-x-2">
                              <Input
                                placeholder="e.g. Hands-on Projects"
                                value={programHighlight}
                                onChange={(e) => setProgramHighlight(e.target.value)}
                                className="h-12"
                              />
                              <Button type="button" onClick={addProgramHighlight} className="shrink-0">
                                Add
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {newCourse.ProgramHighlights?.map((item, index) => (
                                <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                                  {item}
                                  <button
                                    type="button"
                                    onClick={() => removeProgramHighlight(index)}
                                    className="ml-2 text-zinc-400 hover:text-zinc-700"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-6">
                          <div className="bg-zinc-50 rounded-lg p-6 space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-bold">{newCourse.name || "Untitled Course"}</h3>
                                <p className="text-zinc-500 text-sm mt-1">
                                  {newCourse.status === "ACTIVE" ? "Active" : "Draft"}
                                </p>
                              </div>
                              <Badge
                                variant={newCourse.status === "ACTIVE" ? "default" : "secondary"}
                                className="rounded-full"
                              >
                                {newCourse.status}
                              </Badge>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-zinc-500">Duration</p>
                                <p className="font-medium">{newCourse.duration || "Not specified"}</p>
                              </div>
                              <div>
                                <p className="text-zinc-500">Price</p>
                                <p className="font-medium">${newCourse.price || 0}</p>
                              </div>
                              <div>
                                <p className="text-zinc-500">Classroom</p>
                                <p className="font-medium">{newCourse.classroom || "Virtual"}</p>
                              </div>
                            </div>

                            <Separator />

                            <div>
                              <p className="text-zinc-500 text-sm">Description</p>
                              <p className="mt-1">{newCourse.description || "No description provided."}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <p className="text-zinc-500 text-sm">Who Should Attend</p>
                                <div className="mt-2 space-y-1">
                                  {newCourse.WhoShouldAttend && newCourse.WhoShouldAttend.length > 0 ? (
                                    newCourse.WhoShouldAttend.map((item, index) => (
                                      <div key={index} className="flex items-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></div>
                                        <span>{item}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-zinc-400 italic">None specified</p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <p className="text-zinc-500 text-sm">Program Highlights</p>
                                <div className="mt-2 space-y-1">
                                  {newCourse.ProgramHighlights && newCourse.ProgramHighlights.length > 0 ? (
                                    newCourse.ProgramHighlights.map((item, index) => (
                                      <div key={index} className="flex items-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></div>
                                        <span>{item}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-zinc-400 italic">None specified</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 flex items-start">
                            <FileText className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                            <p className="text-sm">
                              Please review all information carefully before
                              {isEditing ? " updating" : " creating"} this course. You can edit the course details
                              later.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dialog Footer */}
                    <DialogFooter className="p-6 border-t bg-zinc-50">
                      <div className="flex justify-between w-full">
                        {currentStep > 1 ? (
                          <Button variant="outline" onClick={prevStep}>
                            Back
                          </Button>
                        ) : (
                          <div></div>
                        )}

                        {currentStep < 3 ? (
                          <Button onClick={nextStep}>Continue</Button>
                        ) : (
                          <Button onClick={handleCreateCourse} className="bg-emerald-600 hover:bg-emerald-700">
                            {isEditing ? "Update Course" : "Create Course"}
                          </Button>
                        )}
                      </div>
                    </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>
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
                    <table className="w-full hidden md:table">
                      <thead className="bg-zinc-50/80 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                        <tr>
                          <th className="text-left p-4 pb-3 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Course
                          </th>
                          <th className="text-center p-4 pb-3 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 w-[140px]">
                            Duration
                          </th>
                          <th className="text-center p-4 pb-3 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 w-[120px]">
                            Price
                          </th>
                          <th className="text-center p-4 pb-3 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 w-[160px]">
                            Status
                          </th>
                          <th className="text-center p-4 pb-3 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 w-[120px]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {filteredCourses.map((course, index) => (
                          <motion.tr
                            key={course.id}
                            className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                            variants={item}
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-4">
                                <div
                                  className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg"
                                  style={{
                                    backgroundImage: `url(${unsplashImages[index % unsplashImages.length]})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                  }}
                                >
                                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <BookOpen className="h-8 w-8 text-white" />
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    {course.name}
                                  </h3>
                                  <p className="line-clamp-1 text-sm text-zinc-500 dark:text-zinc-400">
                                    {course.description}
                                  </p>
                                  <div className="mt-1 flex items-center gap-2">
                                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                      Created: {formatDate(course.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                  {course.duration}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <DollarSign className="h-3.5 w-3.5 text-zinc-400" />
                                <span className="text-sm font-bold text-zinc-900 dark:text-white">${course.price}</span>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                                  <div
                                    className={cn(
                                      "h-2 w-2 rounded-full",
                                      course.status === "ACTIVE" ? "bg-emerald-500" : "bg-zinc-400",
                                    )}
                                  />
                                  <span className="text-sm text-zinc-600 dark:text-zinc-400">{course.status}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                  onClick={() => handleEditCourse(course)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
                                  onClick={() => confirmDeleteCourse(course.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Mobile view */}
                    <div className="md:hidden divide-y divide-zinc-200 dark:divide-zinc-800">
                      {filteredCourses.map((course, index) => (
                        <motion.div
                          key={course.id}
                          className="group p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                          variants={item}
                        >
                          <div className="flex flex-col sm:flex-row items-start gap-4">
                            <div
                              className="relative h-24 w-full sm:w-32 overflow-hidden rounded-lg"
                              style={{
                                backgroundImage: `url(${unsplashImages[index % unsplashImages.length]})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            >
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <BookOpen className="h-10 w-10 text-white" />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                              <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {course.name}
                              </h3>
                              <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400 overflow-hidden">
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
                                  Created: {formatDate(course.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 mt-4">
                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                              <Calendar className="h-4 w-4 text-zinc-400 mb-1" />
                              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                {course.duration}
                              </span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                              <DollarSign className="h-4 w-4 text-zinc-400 mb-1" />
                              <span className="text-xs font-bold text-zinc-900 dark:text-white">${course.price}</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                              <div
                                className={cn(
                                  "h-2.5 w-2.5 rounded-full mb-1",
                                  course.status === "ACTIVE" ? "bg-emerald-500" : "bg-zinc-400",
                                )}
                              />
                              <span className="text-xs text-zinc-600 dark:text-zinc-400">{course.status}</span>
                            </div>
                          </div>

                          <div className="flex justify-end mt-4 space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full"
                              onClick={() => handleEditCourse(course)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-900/20"
                              onClick={() => confirmDeleteCourse(course.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
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
                          className="relative h-52 w-full overflow-hidden"
                          style={{
                            backgroundImage: `url(${unsplashImages[index % unsplashImages.length]})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <BookOpen className="h-16 w-16 text-white" />
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
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                              <Calendar className="h-4 w-4 text-zinc-400" />
                              <span className="text-sm text-zinc-600 dark:text-zinc-300">{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                              <DollarSign className="h-4 w-4 text-zinc-400" />
                              <span className="text-sm font-bold text-zinc-900 dark:text-white">${course.price}</span>
                            </div>
                          </div>
                          <div className="mt-6 flex items-center justify-between">
                            <span className="text-xs text-zinc-400 dark:text-zinc-500">
                              Created: {formatDate(course.createdAt)}
                            </span>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                onClick={() => handleEditCourse(course)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-900/20"
                                onClick={() => confirmDeleteCourse(course.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </SidebarInset>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the course and remove it from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteCourse} className="bg-red-500 hover:bg-red-600 text-white">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </SidebarProvider>
  )
}

