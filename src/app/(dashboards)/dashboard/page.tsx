"use strict";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getEnrolledCourses } from "@/lib/enrollments";
import { Calendar, Clock, GraduationCap, ShoppingCart, Sparkles } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/log-in?callbackUrl=/dashboard");
  }

  // Get user's enrolled courses
  const enrolledCourses = await getEnrolledCourses();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-black dark:to-zinc-900">
      <div className="container mx-auto py-10 px-4 sm:px-6 pt-[100px]">
        {/* Header with cart button */}
        <div className="flex flex-col space-y-8">
          <div className="flex items-center justify-between">
            <div className="relative">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-500">My Courses</h1>
              <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-green-500 rounded-full mt-2"></div>
              <p className="text-muted-foreground mt-3 text-lg">
                Welcome back, <span className="font-semibold">{session.user.name || "Student"}</span>!
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="/cart">
              <Button className="rounded-full bg-slate-100 hover:bg-slate-200 text-black dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white flex items-center gap-2 px-5 py-2.5 shadow-sm hover:shadow-md transition-all">
                <ShoppingCart className="h-5 w-5" />
                <span>Cart</span>
              </Button>
              </Link>
              <Link href="/courses">
              <Button className="rounded-full dark:text-black bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-5 py-2.5 shadow-sm hover:shadow-md transition-all">
                <Sparkles className="h-5 w-5" />
                <span>Explore Courses</span>
              </Button>
              </Link>
            </div>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="mt-10">
              <Card className="border-none bg-white/80 dark:bg-black backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
                <CardContent className="pt-16 pb-16">
                  <div className="flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/30 via-green-500/30 to-blue-500/30 animate-pulse blur-xl"></div>
                      <div className="relative bg-gradient-to-br from-white to-slate-100 dark:from-zinc-800 dark:to-black rounded-full p-8 shadow-inner">
                        <GraduationCap className="h-20 w-20 text-primary" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold mt-6">Start Your Learning Adventure</h2>
                    <p className="text-muted-foreground max-w-md text-lg">
                      You haven&apos;t enrolled in any courses yet. Browse our
                      catalog and discover amazing learning opportunities!
                    </p>
                    <Link href='/courses' className="text-black mt-6 rounded-full px-10 py-3 text-lg bg-gradient-to-r from-primary to-green-600 hover:opacity-90 transition-all border-none">
                      Browse Courses
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="mt-12">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden border-none rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 h-full flex flex-col bg-white dark:bg-black"
                  >
                    <CardHeader className="bg-gradient-to-r from-primary/15 via-green-500/10 to-blue-500/5 pb-4 pt-8 px-8">
                      <div className="flex justify-between items-center">
                        <CardTitle className="line-clamp-1 text-xl font-bold">
                          {course.name}
                        </CardTitle>
                        <Badge className="bg-gradient-to-r from-black to-green-600 text-white border-none px-3 py-1">
                          Enrolled
                        </Badge>
                      </div>
                      <CardDescription className="mt-3">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Enrolled on {new Date(course.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 flex-grow">
                      <div className="space-y-5">
                        <div className="flex items-center gap-2 text-primary dark:text-primary/90">
                          <Clock className="h-5 w-5" />
                          <span className="font-medium">{course.duration}</span>
                        </div>
                        <p className="text-base text-muted-foreground line-clamp-3">
                          {course.description || "No description available"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}