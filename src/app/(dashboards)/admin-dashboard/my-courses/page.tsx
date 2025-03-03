"use client"

import { useState, useEffect } from "react"
import { Bell, ChevronDown, Grid, List, Plus, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Course {
  id: string
  name: string
  duration: string
  price: number
  description: string
  classroom: string
  Lab?: string | null
  Clinic?: string | null
  WhoShouldAttend: string[]
  ProgramHighlights: string[]
  status: "DRAFT" | "ACTIVE"
  Note?: string | null
}

const gradients = [
  "from-black to-purple-500",
  "from-green-500 to-teal-500",
  "from-yellow-500 to-orange-500",
  "from-pink-500 to-red-500",
  "from-indigo-500 to-black",
]

export default function CoursesPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/courses")
        if (!response.ok) {
          throw new Error("Failed to fetch courses")
        }
        const data = await response.json()
        setCourses(data)
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span>Hope</span>
              <span className="text-zinc-500 dark:text-zinc-400">LMS</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">Muhammad</span>
                  <ChevronDown className="h-4 w-4 text-zinc-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1200px] px-6 py-8">
        <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">My Courses</h1>

        {/* Tabs */}
        <Tabs defaultValue="my-course">
          <div className="border-b border-zinc-200 dark:border-zinc-800">
            <TabsList className="mb-0 flex !justify-between h-auto bg-transparent p-0">
<div>
<TabsTrigger
                value="my-course"
                className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 data-[state=active]:border-black data-[state=active]:text-black dark:text-zinc-400 dark:hover:text-zinc-300 dark:data-[state=active]:border-black dark:data-[state=active]:text-black"
              >
                My Course
                <Badge
                  variant="secondary"
                  className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-normal text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  {courses.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="bundle-course"
                className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 data-[state=active]:border-black data-[state=active]:text-black dark:text-zinc-400 dark:hover:text-zinc-300 dark:data-[state=active]:border-black dark:data-[state=active]:text-black"
              >
                Bundle Course
                <Badge
                  variant="secondary"
                  className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-normal text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  0
                </Badge>
              </TabsTrigger>
</div>
<div className="flex flex-row">
      <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9  !border-none bg-white text-sm font-normal text-zinc-500 hover:bg-zinc-50  dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900"
                  >
                    All <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All</DropdownMenuItem>
                  <DropdownMenuItem>Active</DropdownMenuItem>
                  <DropdownMenuItem>Draft</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> 
              <div className="flex items-center rounded-md  p-1 dark:border-zinc-700">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-7 w-7", viewMode === "list" && "bg-zinc-100 dark:bg-zinc-800")}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-7 w-7", viewMode === "grid" && "bg-zinc-100 dark:bg-zinc-800")}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
              <Button className="gap-1 bg-[#2DB188] text-white hover:bg-[#2DB188] dark:bg-[#2DB188] dark:hover:bg-black">
                <Plus className="h-4 w-4" />
                New
              </Button>
</div>
            </TabsList>
          </div>

          <TabsContent value="my-course" className="mt-6 p-0">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <p className="text-zinc-500 dark:text-zinc-400">Loading courses...</p>
              </div>
            ) : viewMode === "list" ? (
              <div className="overflow-hidden rounded-lg ">
                <div className=" border-b grid grid-cols-[1fr_auto_auto_auto] gap-4 bg-zinc-50 p-4 text-xs font-medium uppercase text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                  <div>COURSE</div>
                  <div>DURATION</div>
                  <div>PRICE</div>
                  <div>STATUS</div>
                </div>
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {courses.map((course) => (
                    <div key={course.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "h-[120px] w-[120px] rounded-md bg-gradient-to-br",
                            gradients[Math.floor(Math.random() * gradients.length)],
                          )}
                        />
                        <div>
                          <h3 className="font-medium text-zinc-900 dark:text-white">{course.name}</h3>
                          <p className="text-zinc-500 dark:text-zinc-400">{course.description}</p>
                          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            Created: April 13, 2022 - 4:24 PM
                          </p>
                          <div className="mt-2">
                            <Badge
                              variant={course.status === "ACTIVE" ? "success" : "secondary"}
                              className={cn(
                                "rounded-full px-2 py-0.5 text-xs font-normal",
                                course.status === "ACTIVE"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400",
                              )}
                            >
                              {course.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-300">{course.duration}</div>
                      <div className="text-sm font-medium text-zinc-900 dark:text-white">${course.price}</div>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={cn(
                            "h-4 w-1 rounded-full",
                            course.status === "ACTIVE" ? "bg-green-500" : "bg-zinc-500",
                          )}
                        />
                        <span className="text-sm text-zinc-600 dark:text-zinc-300">{course.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="overflow-hidden rounded-lg  bg-white dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div
                      className={cn(
                        "h-[200px] w-full bg-gradient-to-br",
                        gradients[Math.floor(Math.random() * gradients.length)],
                      )}
                    />
                    <div className="p-4">
                      <h3 className="font-medium text-zinc-900 dark:text-white">{course.name}</h3>
                      <p className="text-zinc-500 dark:text-zinc-400 truncate">{course.description}</p>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Created: April 13, 2022 - 4:24 PM</p>
                      <div className="mt-4 flex items-center justify-between">
                        <Badge
                          variant={course.status === "ACTIVE" ? "success" : "secondary"}
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-normal",
                            course.status === "ACTIVE"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400",
                          )}
                        >
                          {course.status}
                        </Badge>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={cn(
                              "h-4 w-1 rounded-full",
                              course.status === "ACTIVE" ? "bg-green-500" : "bg-zinc-500",
                            )}
                          />
                          <span className="text-sm text-zinc-600 dark:text-zinc-300">{course.status}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between border-t border-zinc-200 pt-2 text-sm dark:border-zinc-700">
                        <div className="text-zinc-600 dark:text-zinc-300">{course.duration}</div>
                        <div className="font-medium text-zinc-900 dark:text-white">${course.price}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bundle-course">
            <div className="mt-6 rounded-lg  p-8 text-center dark:border-zinc-800">
              <p className="text-zinc-500 dark:text-zinc-400">Bundle courses will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

