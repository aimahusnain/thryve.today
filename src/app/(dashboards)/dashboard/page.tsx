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
import {
  Calendar,
  Clock,
  GraduationCap,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
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
        {/* Header with cart + explore buttons */}
        <div className="flex flex-col space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Title + Welcome */}
            <div className="relative text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-500">
                My Courses
              </h1>
              <div className="h-1.5 w-20 sm:w-24 mx-auto md:mx-0 bg-gradient-to-r from-primary to-green-500 rounded-full mt-2"></div>
              <p className="text-muted-foreground mt-3 text-base sm:text-lg">
                Welcome back,{" "}
                <span className="font-semibold">
                  {session.user.name || "Student"}
                </span>
                !
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/cart" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-full bg-slate-100 hover:bg-slate-200 text-black dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white flex items-center justify-center gap-2 px-5 py-2.5 shadow-sm hover:shadow-md transition-all">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                </Button>
              </Link>
              <Link href="/courses" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-full dark:text-black bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 px-5 py-2.5 shadow-sm hover:shadow-md transition-all">
                  <Sparkles className="h-5 w-5" />
                  <span>Explore</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* If no courses */}
          {enrolledCourses.length === 0 ? (
            <div className="mt-6 sm:mt-10">
              <Card className="border-none bg-white/80 dark:bg-black backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
                <CardContent className="pt-12 pb-12 sm:pt-16 sm:pb-16">
                  <div className="flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/30 via-green-500/30 to-blue-500/30 animate-pulse blur-xl"></div>
                      <div className="relative bg-gradient-to-br from-white to-slate-100 dark:from-zinc-800 dark:to-black rounded-full p-6 sm:p-8 shadow-inner">
                        <GraduationCap className="h-16 w-16 sm:h-20 sm:w-20 text-primary" />
                      </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold mt-4 sm:mt-6">
                      Start Your Learning Adventure
                    </h2>
                    <p className="text-muted-foreground max-w-md text-base sm:text-lg px-4">
                      You haven&apos;t enrolled in any courses yet. Browse our
                      catalog and discover amazing learning opportunities!
                    </p>
                    <Link
                      href="/courses"
                      className="text-black mt-4 sm:mt-6 rounded-full px-8 sm:px-10 py-2.5 sm:py-3 text-base sm:text-lg bg-gradient-to-r from-primary to-green-600 hover:opacity-90 transition-all border-none"
                    >
                      Browse Courses
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // If enrolled courses exist
            <div className="mt-8 sm:mt-12">
              <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden border-none rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 h-full flex flex-col bg-white dark:bg-black"
                  >
                    <CardHeader className="bg-gradient-to-r from-primary/15 via-green-500/10 to-blue-500/5 pb-4 pt-6 sm:pt-8 px-6 sm:px-8">
                      <div className="flex justify-between items-center gap-3">
                        <CardTitle className="line-clamp-1 text-lg sm:text-xl font-bold">
                          {course.name}
                        </CardTitle>
                        <Badge className="bg-gradient-to-r from-black to-green-600 text-white border-none px-2.5 sm:px-3 py-1">
                          Enrolled
                        </Badge>
                      </div>
                      <CardDescription className="mt-3">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Enrolled on{" "}
                            {new Date(course.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 sm:p-8 flex-grow">
                      <div className="space-y-4 sm:space-y-5">
                        <div className="flex items-center gap-2 text-primary dark:text-primary/90">
                          <Clock className="h-5 w-5" />
                          <span className="font-medium text-sm sm:text-base">
                            {course.duration}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground line-clamp-3">
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
