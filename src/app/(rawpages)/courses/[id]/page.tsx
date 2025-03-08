import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import { NursingEnrollmentForm } from "@/components/nursing-enrollment-form"

const prisma = new PrismaClient()

export default async function CoursePage({
  params,
}: {
  params: { id: string }
}) {
  const course = await prisma.courses.findUnique({
    where: { id: params.id },
  })

  if (!course) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <NursingEnrollmentForm 
        courseId={course.id} 
        courseName={course.name} 
        coursePrice={course.price} 
        courseDuration={course.duration} 
      />
    </div>
  )
}