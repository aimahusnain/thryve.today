import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import { NursingEnrollmentForm } from "@/components/nursing-enrollment-form"
import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const { id } = params

  const course = await prisma.courses.findUnique({
    where: { id },
  })

  return {
    title: course ? `Enroll: ${course.name}` : "Course Enrollment",
    description: "Complete your enrollment application",
  }
}

export default async function CoursePage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
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

