"use client"

import { useState } from "react"
import Link from "next/link"
import type { Courses } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, BookOpen } from "lucide-react"
import { motion } from "framer-motion"

interface EnrolledCoursesProps {
  enrolledCourses: Courses[]
}

export default function EnrolledCourses({ enrolledCourses }: EnrolledCoursesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Generate random progress for demo purposes
  const getRandomProgress = () => Math.floor(Math.random() * 100)

  if (enrolledCourses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Your Enrolled Courses
          </CardTitle>
          <CardDescription>Courses you&apos;ve enrolled in</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="rounded-full bg-muted p-3">
            <BookOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No enrolled courses yet</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">Complete your checkout to start learning</p>
          <Button asChild className="mt-4">
            <Link href="/checkout">Go to Checkout</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Your Enrolled Courses
        </CardTitle>
        <CardDescription>Courses you&apos;ve enrolled in</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {enrolledCourses.map((course, index) => {
          const progress = getRandomProgress()

          return (
            <motion.div
              key={course.id}
              className="relative rounded-lg border p-4 transition-all hover:shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="mb-2 flex justify-between">
                <h3 className="font-semibold">{course.name}</h3>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              {hoveredIndex === index && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-primary/90 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Button variant="secondary" asChild>
                    <Link href={`/learn/${course.id}`}>Continue Learning</Link>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </CardContent>
    </Card>
  )
}

