import { prisma } from "@/lib/prisma"
import { CheckCircle, Clock, DollarSign, GraduationCap } from "lucide-react"
import { CourseCart2Button } from "@/components/cart/course-cart-button"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth" // Adjust path as per your setup

export default async function CoursesPage() {
    const session = await getServerSession(authOptions)
    const user = session?.user
    const isLoggedIn = !!(user?.email || user?.name)

  const courses = await prisma.courses.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      duration: true,
      price: true,
      description: true,
      ProgramHighlights: true,
    },
  })

  return (
    <div className="mt-[50px] py-10">
      <div className="bg-white mb-6 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white">
              Healthcare Training Programs
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
              Discover our comprehensive range of healthcare courses designed to launch and advance your medical career
            </p>
          </div>
        </div>
      </div>

      <div className="grid mx-[30px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group relative overflow-hidden rounded-3xl p-8 sm:p-6 md:p-8
              bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800
              transition-all duration-500 ease-in-out
              border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700
              flex flex-col col-span-full sm:col-span-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-lime-50/50 via-transparent to-transparent dark:from-lime-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative space-y-6 h-full z-10">
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white group-hover:text-[#35dba8] dark:group-hover:text-[#2db188] transition-colors duration-300">
                  {course.name}
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[#35dba8] dark:text-[#2db188] bg-lime-50 dark:bg-[#2db188]/10 px-3 py-1.5 rounded-full">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold">{course.price.toFixed(2)}</span>
                  </div>
                  {course.duration && (
                    <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-300/10 px-3 py-1.5 rounded-full">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{course.duration}</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 line-clamp-3">
                {course.description}
              </p>

              <div className="space-y-3 mt-0">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#35dba8] dark:text-[#2db188]" /> Program Highlights
                </h4>
                <ul className="grid gap-2 md:gap-3">
                  {course.ProgramHighlights && course.ProgramHighlights.length > 0 ? (
                    course.ProgramHighlights.slice(0, 4).map((highlight, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm md:text-base text-zinc-600 dark:text-zinc-300"
                      >
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#35dba8] dark:text-[#2db188] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{highlight}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-zinc-500 dark:text-zinc-400">No highlights available</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <CourseCart2Button
                courseId={course.id}
                courseName={course.name}
                coursePrice={course.price}
                courseDuration={course.duration || ""}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
