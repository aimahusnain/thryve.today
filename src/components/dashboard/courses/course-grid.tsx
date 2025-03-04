"use client"

import { motion } from "framer-motion"
import { Edit, Trash2, BookOpen, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Course } from "@/types/course"

interface CourseGridProps {
  courses: Course[]
  onEdit: (course: Course) => void
  onDelete: (courseId: string) => void
}

// Abstract gradient images from Unsplash
const unsplashImages = [
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
]

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function CourseGrid({ courses, onEdit, onDelete }: CourseGridProps) {
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
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, index) => (
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-white/70" />
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
            <p className="mt-2 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{course.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <Calendar className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-zinc-600 dark:text-zinc-300">{course.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-bold text-zinc-900 dark:text-white">${course.price}</span>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs text-zinc-400 dark:text-zinc-500">Created: {formatDate(course.createdAt)}</span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
                  onClick={() => onEdit(course)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-900/20"
                  onClick={() => onDelete(course.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

