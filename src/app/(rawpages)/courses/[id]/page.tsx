import { NursingEnrollmentForm } from "@/components/nursing-enrollment-form";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

const prisma = new PrismaClient()

export default async function CoursePage(props: { params: Promise<{ id: string }> }) {
  const { params } = props
  const { id } = await params
  const session = await getServerSession(authOptions)

  const course = await prisma.courses.findUnique({
    where: { id },
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
        session={session}
      />
    </div>
  )
}