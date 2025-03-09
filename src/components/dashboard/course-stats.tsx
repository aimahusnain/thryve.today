import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, GraduationCap, Clock } from "lucide-react"

interface CourseStatsProps {
  cartItemCount: number
  enrolledCourseCount: number
}

export default function CourseStats({ cartItemCount, enrolledCourseCount }: CourseStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Your Cart</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cartItemCount}</div>
          <p className="text-xs text-muted-foreground">
            {cartItemCount === 1 ? "Course" : "Courses"} waiting for checkout
          </p>
          <div className="mt-4 h-1 w-full bg-secondary">
            <div className="h-1 bg-primary" style={{ width: `${Math.min(100, cartItemCount * 20)}%` }} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{enrolledCourseCount}</div>
          <p className="text-xs text-muted-foreground">
            {enrolledCourseCount === 1 ? "Course" : "Courses"} in progress
          </p>
          <div className="mt-4 h-1 w-full bg-secondary">
            <div className="h-1 bg-primary" style={{ width: `${Math.min(100, enrolledCourseCount * 20)}%` }} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{enrolledCourseCount * 10}h</div>
          <p className="text-xs text-muted-foreground">Estimated learning hours</p>
          <div className="mt-4 h-1 w-full bg-secondary">
            <div className="h-1 bg-primary" style={{ width: `${Math.min(100, enrolledCourseCount * 10)}%` }} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

