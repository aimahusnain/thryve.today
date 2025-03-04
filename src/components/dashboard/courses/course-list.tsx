"use client"

import { motion } from "framer-motion"
import { Edit, Trash2, BookOpen, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Course } from "@/types/course"

interface CourseListProps {
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

export function CourseList({ courses, onEdit, onDelete }: CourseListProps) {
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
    <div className="overflow-hidden rounded-xl bg-white shadow-sm backdrop-blur-sm dark:bg-zinc-900/90">
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
          {courses.map((course, index) => (
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
                    <p className="line-clamp-1 text-sm text-zinc-500 dark:text-zinc-400">{course.description}</p>
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
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{course.duration}</span>
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
                    className="h-8 w-8 rounded-full hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
                    onClick={() => onEdit(course)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
                    onClick={() => onDelete(course.id)}
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
        {courses.map((course, index) => (
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
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{course.duration}</span>
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
          </motion.div>
        ))}
      </div>
    </div>
  )
}

