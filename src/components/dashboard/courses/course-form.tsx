"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  X,
  Check,
  Clock,
  Users,
  Briefcase,
  School,
  FileText,
  Sparkles,
  ChevronRight,
  PenLine,
  CircleCheck,
  Calendar,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import type { Course } from "@/types/course"
import { motion, AnimatePresence } from "framer-motion"

interface CourseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course | null
  onSuccess: () => void
}

export function CourseForm({ open, onOpenChange, course, onSuccess }: CourseFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [whoShouldAttend, setWhoShouldAttend] = useState("")
  const [programHighlight, setProgramHighlight] = useState("")
  const isEditing = !!course

  const [formData, setFormData] = useState<Partial<Course>>({
    name: "",
    description: "",
    duration: "",
    price: 0,
    classroom: "Virtual",
    status: "DRAFT",
    WhoShouldAttend: [],
    ProgramHighlights: [],
    startingDates: "",
  })

  useEffect(() => {
    if (course) {
      setFormData({
        ...course,
      })
    } else {
      setFormData({
        name: "",
        description: "",
        duration: "",
        price: 0,
        classroom: "Virtual",
        status: "DRAFT",
        WhoShouldAttend: [],
        ProgramHighlights: [],
        startingDates: "",
      })
    }
    setCurrentStep(1)
  }, [course])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addWhoShouldAttend = () => {
    if (whoShouldAttend.trim()) {
      setFormData((prev) => ({
        ...prev,
        WhoShouldAttend: [...(prev.WhoShouldAttend || []), whoShouldAttend.trim()],
      }))
      setWhoShouldAttend("")
    }
  }

  const removeWhoShouldAttend = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      WhoShouldAttend: (prev.WhoShouldAttend || []).filter((_, i) => i !== index),
    }))
  }

  const addProgramHighlight = () => {
    if (programHighlight.trim()) {
      setFormData((prev) => ({
        ...prev,
        ProgramHighlights: [...(prev.ProgramHighlights || []), programHighlight.trim()],
      }))
      setProgramHighlight("")
    }
  }

  const removeProgramHighlight = (index: number) => {
    setFormData((prev) => ({
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

  const handleSubmit = async () => {
    try {
      const courseData = {
        name: formData.name || "Untitled Course",
        description: formData.description || "No description provided.",
        duration: formData.duration || "Not specified",
        price: formData.price || 0,
        classroom: formData.classroom || "Virtual",
        Lab: formData.Lab,
        Clinic: formData.Clinic,
        status: formData.status || "DRAFT",
        WhoShouldAttend: formData.WhoShouldAttend || [],
        ProgramHighlights: formData.ProgramHighlights || [],
        Note: formData.Note,
        startingDates: formData.startingDates || null,
      }

      let response

      if (isEditing && course?.id) {
        // Update existing course
        response = await fetch(`/api/courses?id=${course.id}`, {
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

      toast.success(isEditing ? "Course updated successfully" : "Course created successfully", {
        style: { background: "#10B981", color: "white" },
        icon: "🎉",
      })

      onSuccess()
    } catch (error) {
      console.error(isEditing ? "Error updating course:" : "Error creating course:", error)
      toast.error(
        isEditing ? "Failed to update course. Please try again." : "Failed to create course. Please try again.",
      )
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] p-0 overflow-hidden rounded-xl border-0 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Dialog Header with Steps */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-800">
              {/* Background pattern */}
              <svg
                className="absolute top-0 right-0 text-white/5"
                width="300"
                height="300"
                viewBox="0 0 250 250"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M107.319 118.172C116.913 123.932 128.933 122.183 136.486 114.629C144.039 107.076 145.789 95.0568 140.028 85.4626C134.267 75.8684 121.502 72.4205 111.015 77.1764C100.529 81.9323 95.5813 94.1736 99.3986 104.851C103.216 115.528 114.872 123.427 126.066 121.767C137.106 120.229 145.006 109.918 144.728 98.75"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </svg>
              <svg
                className="absolute -bottom-20 -left-20 text-white/5"
                width="250"
                height="250"
                viewBox="0 0 250 250"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M182.319 118.172C191.913 123.932 203.933 122.183 211.486 114.629C219.039 107.076 220.789 95.0568 215.028 85.4626C209.267 75.8684 196.502 72.4205 186.015 77.1764C175.529 81.9323 170.581 94.1736 174.399 104.851C178.216 115.528 189.872 123.427 201.066 121.767C212.106 120.229 220.006 109.918 219.728 98.75"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="relative px-6 pt-8 pb-14 text-white">
              <DialogTitle className="text-2xl font-bold flex items-center">
                {isEditing ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center"
                  >
                    <PenLine className="mr-2 h-6 w-6" />
                    Edit Course
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center"
                  >
                    <Sparkles className="mr-2 h-6 w-6" />
                    Create New Course
                  </motion.div>
                )}
              </DialogTitle>
              <DialogDescription className="text-emerald-50 dark:text-emerald-100 mt-1 opacity-80">
                {isEditing
                  ? "Update the course details to improve your educational offering"
                  : "Fill in the details to create a new course for your students"}
              </DialogDescription>

              <div className="mt-8 flex items-center justify-between relative">
                {/* Progress bar */}
                <div className="absolute left-[25px] right-[25px] h-1 bg-emerald-700/50 dark:bg-emerald-800/50 rounded-full top-[14px] -z-10">
                  <motion.div
                    className="h-full rounded-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{
                      width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Step 1 */}
                <motion.div
                  className="flex flex-col items-center gap-1"
                  animate={{
                    scale: currentStep >= 1 ? 1 : 0.9,
                    opacity: currentStep >= 1 ? 1 : 0.7,
                  }}
                >
                  <div
                    className={`relative flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${
                      currentStep >= 1 ? "bg-white text-emerald-600 shadow-xl" : "bg-emerald-700/50 text-white"
                    }`}
                  >
                    {currentStep > 1 ? <Check className="h-4 w-4" /> : <span className="text-xs font-semibold">1</span>}
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{
                        scale: currentStep === 1 ? [1, 1.3, 1] : 0,
                      }}
                      transition={{
                        duration: 0.5,
                        times: [0, 0.5, 1],
                      }}
                      className="absolute inset-0 rounded-full border-2 border-white"
                    />
                  </div>
                  <span className={`text-xs font-medium ${currentStep === 1 ? "text-white" : "text-emerald-100/70"}`}>
                    Basic Info
                  </span>
                </motion.div>

                {/* Step 2 */}
                <motion.div
                  className="flex flex-col items-center gap-1"
                  animate={{
                    scale: currentStep >= 2 ? 1 : 0.9,
                    opacity: currentStep >= 2 ? 1 : 0.7,
                  }}
                >
                  <div
                    className={`relative flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${
                      currentStep >= 2 ? "bg-white text-emerald-600 shadow-xl" : "bg-emerald-700/50 text-white"
                    }`}
                  >
                    {currentStep > 2 ? <Check className="h-4 w-4" /> : <span className="text-xs font-semibold">2</span>}
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{
                        scale: currentStep === 2 ? [1, 1.3, 1] : 0,
                      }}
                      transition={{
                        duration: 0.5,
                        times: [0, 0.5, 1],
                      }}
                      className="absolute inset-0 rounded-full border-2 border-white"
                    />
                  </div>
                  <span className={`text-xs font-medium ${currentStep === 2 ? "text-white" : "text-emerald-100/70"}`}>
                    Details
                  </span>
                </motion.div>

                {/* Step 3 */}
                <motion.div
                  className="flex flex-col items-center gap-1"
                  animate={{
                    scale: currentStep >= 3 ? 1 : 0.9,
                    opacity: currentStep >= 3 ? 1 : 0.7,
                  }}
                >
                  <div
                    className={`relative flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${
                      currentStep >= 3 ? "bg-white text-emerald-600 shadow-xl" : "bg-emerald-700/50 text-white"
                    }`}
                  >
                    <span className="text-xs font-semibold">3</span>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{
                        scale: currentStep === 3 ? [1, 1.3, 1] : 0,
                      }}
                      transition={{
                        duration: 0.5,
                        times: [0, 0.5, 1],
                      }}
                      className="absolute inset-0 rounded-full border-2 border-white"
                    />
                  </div>
                  <span className={`text-xs font-medium ${currentStep === 3 ? "text-white" : "text-emerald-100/70"}`}>
                    Preview
                  </span>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 flex-1 overflow-y-auto max-h-[60vh] bg-white dark:bg-zinc-950 border-t border-emerald-100/30 dark:border-emerald-900/30">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-medium text-zinc-800 dark:text-zinc-200">
                      Course Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g. Introduction to Web Development"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="h-12 transition-all focus-within:ring-2 focus-within:ring-emerald-500 focus-visible:ring-offset-0 dark:bg-zinc-900 dark:border-zinc-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-medium text-zinc-800 dark:text-zinc-200">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe what students will learn in this course"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="resize-none transition-all focus-within:ring-2 focus-within:ring-emerald-500 focus-visible:ring-offset-0 dark:bg-zinc-900 dark:border-zinc-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-base font-medium text-zinc-800 dark:text-zinc-200">
                        Duration
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                        <Input
                          id="duration"
                          name="duration"
                          placeholder="e.g. 8 weeks"
                          value={formData.duration}
                          onChange={handleInputChange}
                          className="h-12 pl-10 transition-all focus-within:ring-2 focus-within:ring-emerald-500 focus-visible:ring-offset-0 dark:bg-zinc-900 dark:border-zinc-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-base font-medium text-zinc-800 dark:text-zinc-200">
                        Price ($)
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500 dark:text-emerald-400 font-semibold">
                          $
                        </div>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          placeholder="e.g. 299"
                          value={formData.price || ""}
                          onChange={handleInputChange}
                          className="h-12 pl-10 transition-all focus-within:ring-2 focus-within:ring-emerald-500 focus-visible:ring-offset-0 dark:bg-zinc-900 dark:border-zinc-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Starting Dates Field */}
                  <div className="space-y-2">
                    <Label htmlFor="startingDates" className="text-base font-medium text-zinc-800 dark:text-zinc-200">
                      Schedule Dates <span className="text-sm text-zinc-500 dark:text-zinc-400 font-normal">(Optional)</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                      <Input
                        id="startingDates"
                        name="startingDates"
                        placeholder="e.g. January 15, March 1, May 20"
                        value={formData.startingDates || ""}
                        onChange={handleInputChange}
                        className="h-12 pl-10 transition-all focus-within:ring-2 focus-within:ring-emerald-500 focus-visible:ring-offset-0 dark:bg-zinc-900 dark:border-zinc-800"
                      />
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Enter multiple Schedule dates separated by commas
                    </p>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label className="text-base font-medium text-zinc-800 dark:text-zinc-200">Classroom Type</Label>
                    <RadioGroup
                      value={formData.classroom || "Virtual"}
                      onValueChange={(value) => handleSelectChange("classroom", value)}
                      className="grid grid-cols-1 md:grid-cols-3 gap-2"
                    >
                      <div className="flex items-center space-x-2 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors hover:border-emerald-200 dark:hover:border-emerald-900">
                        <RadioGroupItem value="Virtual" id="virtual" className="text-emerald-500 border-emerald-500" />
                        <Label htmlFor="virtual" className="cursor-pointer flex items-center">
                          <School className="mr-2 h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                          Virtual
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors hover:border-emerald-200 dark:hover:border-emerald-900">
                        <RadioGroupItem
                          value="In-person"
                          id="in-person"
                          className="text-emerald-500 border-emerald-500"
                        />
                        <Label htmlFor="in-person" className="cursor-pointer flex items-center">
                          <Users className="mr-2 h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                          In-person
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors hover:border-emerald-200 dark:hover:border-emerald-900">
                        <RadioGroupItem value="Hybrid" id="hybrid" className="text-emerald-500 border-emerald-500" />
                        <Label htmlFor="hybrid" className="cursor-pointer flex items-center">
                          <Briefcase className="mr-2 h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                          Hybrid
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium text-zinc-800 dark:text-zinc-200">Status</Label>
                    <Select
                      value={formData.status || "DRAFT"}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger className="h-12 transition-all focus:ring-2 focus:ring-emerald-500 dark:bg-zinc-900 dark:border-zinc-800">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-zinc-900 dark:border-zinc-800">
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium text-zinc-800 dark:text-zinc-200">Who Should Attend</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="e.g. Beginners"
                        value={whoShouldAttend}
                        onChange={(e) => setWhoShouldAttend(e.target.value)}
                        className="h-12 transition-all focus-within:ring-2 focus-within:ring-emerald-500 dark:bg-zinc-900 dark:border-zinc-800"
                      />
                      <Button
                        type="button"
                        onClick={addWhoShouldAttend}
                        className="shrink-0 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md dark:from-emerald-600 dark:to-teal-600 dark:hover:from-emerald-500 dark:hover:to-teal-500"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.WhoShouldAttend?.map((item, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1 text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => removeWhoShouldAttend(index)}
                            className="ml-2 text-emerald-500 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium text-zinc-800 dark:text-zinc-200">Program Highlights</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="e.g. Hands-on Projects"
                        value={programHighlight}
                        onChange={(e) => setProgramHighlight(e.target.value)}
                        className="h-12 transition-all focus-within:ring-2 focus-within:ring-emerald-500 dark:bg-zinc-900 dark:border-zinc-800"
                      />
                      <Button
                        type="button"
                        onClick={addProgramHighlight}
                        className="shrink-0 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md dark:from-emerald-600 dark:to-teal-600 dark:hover:from-emerald-500 dark:hover:to-teal-500"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.ProgramHighlights?.map((item, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1 text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => removeProgramHighlight(index)}
                            className="ml-2 text-emerald-500 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-br from-white to-emerald-50 dark:from-zinc-900 dark:to-emerald-950/30 rounded-xl p-6 space-y-4 shadow-sm border border-emerald-100 dark:border-emerald-900/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                          {formData.name || "Untitled Course"}
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                          {formData.status === "ACTIVE" ? "Active" : "Draft"}
                        </p>
                      </div>
                      <Badge
                        variant={formData.status === "ACTIVE" ? "default" : "secondary"}
                        className={`rounded-full px-3 py-1 ${
                          formData.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
                            : "bg-zinc-100 text-zinc-800 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                        }`}
                      >
                        {formData.status}
                      </Badge>
                    </div>

                    <Separator className="bg-emerald-100 dark:bg-emerald-900/30" />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-zinc-500 dark:text-zinc-400">Duration</p>
                        <p className="font-medium text-zinc-900 dark:text-white">
                          {formData.duration || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-500 dark:text-zinc-400">Price</p>
                        <p className="font-medium text-zinc-900 dark:text-white">${formData.price || 0}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 dark:text-zinc-400">Classroom</p>
                        <p className="font-medium text-zinc-900 dark:text-white">{formData.classroom || "Virtual"}</p>
                      </div>
                      {formData.startingDates && (
                        <div>
                          <p className="text-zinc-500 dark:text-zinc-400">Schedule Dates</p>
                          <p className="font-medium text-zinc-900 dark:text-white">{formData.startingDates}</p>
                        </div>
                      )}
                    </div>

                    <Separator className="bg-emerald-100 dark:bg-emerald-900/30" />

                    <div>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm">Description</p>
                      <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                        {formData.description || "No description provided."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Who Should Attend</p>
                        <div className="mt-2 space-y-1">
                          {formData.WhoShouldAttend && formData.WhoShouldAttend.length > 0 ? (
                            formData.WhoShouldAttend.map((item, index) => (
                              <div key={index} className="flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2"></div>
                                <span className="text-zinc-800 dark:text-zinc-200">{item}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-zinc-400 dark:text-zinc-500 italic">None specified</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Program Highlights</p>
                        <div className="mt-2 space-y-1">
                          {formData.ProgramHighlights && formData.ProgramHighlights.length > 0 ? (
                            formData.ProgramHighlights.map((item, index) => (
                              <div key={index} className="flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2"></div>
                                <span className="text-zinc-800 dark:text-zinc-200">{item}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-zinc-400 dark:text-zinc-500 italic">None specified</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg p-4 text-amber-800 dark:text-amber-300 flex items-start"
                  >
                    <FileText className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                    <p className="text-sm">
                      Please review all information carefully before
                      {isEditing ? " updating" : " creating"} this course. You can edit the course details later.
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="p-6 border-t bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800">
            <div className="flex justify-between w-full">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300"
                >
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center">
                    Back
                  </motion.span>
                </Button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md dark:from-emerald-600 dark:to-teal-600 dark:hover:from-emerald-500 dark:hover:to-teal-500"
                >
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </motion.span>
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md dark:from-emerald-600 dark:to-teal-600 dark:hover:from-emerald-500 dark:hover:to-teal-500"
                >
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-1.5"
                  >
                    <CircleCheck className="h-4 w-4" />
                    {isEditing ? "Update Course" : "Create Course"}
                  </motion.span>
                </Button>
              )}
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}