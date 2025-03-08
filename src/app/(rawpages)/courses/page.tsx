import { PrismaClient } from "@prisma/client"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"

const prisma = new PrismaClient()

export default async function CoursesPage() {
  const courses = await prisma.courses.findMany({
    where: {
      status: "ACTIVE",
    },
  })

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden flex flex-col">
            <div className="aspect-video relative">
              <Image src="/placeholder.svg?height=200&width=400" alt={course.name} fill className="object-cover" />
            </div>
            <CardContent className="p-6 flex-grow">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Clock className="mr-1 h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <Link href={`/courses/${course.id}`}>
                <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">{course.name}</h2>
              </Link>
              <p className="text-gray-600 line-clamp-3">{course.description}</p>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex items-center justify-between">
              <div className="text-xl font-bold">${course.price.toFixed(2)}</div>
              <Link href={`/courses/${course.id}`}>
                <Button>Enroll Now</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
