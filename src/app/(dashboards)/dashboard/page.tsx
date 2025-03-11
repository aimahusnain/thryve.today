import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getEnrolledCourses } from "@/lib/enrollments"
import Navbar from "@/components/header"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/log-in?callbackUrl=/dashboard")
  }

  // Get user's enrolled courses
  const enrolledCourses = await getEnrolledCourses()

  return (
 <>
 <Navbar />

<div className="container mx-auto py-10 px-4 sm:px-6 pt-[100px]">
      <div className="flex flex-col space-y-6">
<div className="flex items-center justify-between">
<div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user.name || "Student"}! Here are your enrolled courses.
          </p>
        </div>
        <Link href="/courses" className=" bg-white text-black px-3 py-2 rounded-full shadow-md">
        Explore Courses
        </Link>
</div>

        {enrolledCourses.length === 0 ? (
          <Card className="border-dashed border-2 bg-muted/50">
            <CardContent className="pt-16 pb-16">
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 blur-lg"></div>
                  <div className="relative bg-background rounded-full p-6">
                    <GraduationCap className="h-16 w-16 text-primary/80" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold">No courses yet</h2>
                <p className="text-muted-foreground max-w-md">
                  You haven&apos;t enrolled in any courses yet. Browse our catalog and start your learning journey
                  today!  
                </p>
                <Link href="/courses">
                  <Button size="lg" className="mt-2 rounded-full px-8">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <div className="flex justify-between items-center">
                    <CardTitle className="line-clamp-1">{course.name}</CardTitle>
                    <Badge variant="secondary">Enrolled</Badge>
                  </div>
                  <CardDescription>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>Enrolled on {new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>{course.duration}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {course.description || "No description available"}
                    </p>
                    <div className="pt-2">
                      <Link href={`/courses/${course.id}`}>
                        <Button variant="outline" className="w-full">
                          View Course Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div></>
  )
}

