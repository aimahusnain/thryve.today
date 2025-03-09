import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import CourseStats from "@/components/dashboard/course-stats"
import CartCourses from "@/components/dashboard/cart-courses"
import EnrolledCourses from "@/components/dashboard/enrolled-courses"
import { authOptions } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin")
  }

  // Fetch user data with cart and enrolled courses
  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email as string,
    },
    include: {
      cart: {
        include: {
          items: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    redirect("/api/auth/signin")
  }

  // Since there's no direct relation between enrollments and courses in the schema,
  // we'll need a different approach to show enrolled courses
  // For now, let's fetch some active courses as a placeholder
  const enrolledCourses = await prisma.courses.findMany({
    where: {
      status: "ACTIVE",
    },
    take: 3, // Limit to 3 courses for demo purposes
  })

  const cartItems = user.cart?.items || []
  const cartItemCount = cartItems.length
  const enrolledCourseCount = enrolledCourses.length

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <CourseStats cartItemCount={cartItemCount} enrolledCourseCount={enrolledCourseCount} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <CartCourses cartItems={cartItems} />
          <EnrolledCourses enrolledCourses={enrolledCourses} />
        </div>
      </main>
    </div>
  )
}