"use client"

import { AppSidebar } from "@/components/dashboard/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, Filter, Info } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// Stat Card Component
interface StatCardProps {
  title: string
  value: string
  change: number
  trend: "up" | "down"
  period: string
  chartData: number[]
}

function StatCard({ title, value, change, trend, period, chartData }: StatCardProps) {
  const data = chartData.map((value) => ({ value }))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs">
          <span className={trend === "up" ? "text-green-500" : "text-red-500"}>
            {trend === "up" ? "↑" : "↓"} {change}%
          </span>
          <span className="text-muted-foreground ml-1">{period}</span>
        </div>
        <div className="h-[40px] mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorValue)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Top Course Card Component
interface TopCourseCardProps {
  title: string
  lessons: string
  price: string
  icon: string
  color: string
}

function TopCourseCard({ title, lessons, price, icon, color }: TopCourseCardProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className={`h-10 w-10 rounded-md ${color}`}>
          <AvatarFallback className="rounded-md text-sm">{icon}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{lessons}</div>
        </div>
      </div>
      <div className="font-medium">{price}</div>
    </div>
  )
}

// Earnings Chart Component
function EarningsChart() {
  const data = [
    { name: "Mar", value: 400 },
    { name: "Apr", value: 500 },
    { name: "May", value: 450 },
    { name: "Jun", value: 300 },
    { name: "Jul", value: 350 },
    { name: "Aug", value: 450 },
    { name: "Sep", value: 550 },
    { name: "Oct", value: 500 },
    { name: "Nov", value: 450 },
    { name: "Dec", value: 400 },
    { name: "Jan", value: 500 },
    { name: "Feb", value: 450 },
  ]

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}k`}
        />
        <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Main Dashboard Component
export default function AdminDashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
            <Card
              className="mb-6 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/Background-Design-Wallpaper-HD-16247.jpg')",
              }}
            >
              <CardContent className="p-6 bg-black/20 rounded-lg">
                <div className="text-white">
                  <h2 className="text-2xl font-bold">Welcome Back, Keira!</h2>
                  <p className="text-white/80">See what happened with your courses and students!</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <StatCard
                title="Current Month"
                value="$9243.34"
                change={5.24}
                trend="up"
                period="vs last month"
                chartData={[10, 15, 8, 12, 9, 14, 11, 16, 10, 13]}
              />
              <StatCard
                title="Course Sell"
                value="824 Course"
                change={1.86}
                trend="up"
                period="vs last month"
                chartData={[8, 10, 7, 9, 11, 8, 10, 9, 12, 10]}
              />
              <StatCard
                title="Students this Month"
                value="1,124 Student"
                change={2.22}
                trend="up"
                period="vs last month"
                chartData={[9, 11, 8, 12, 10, 9, 13, 11, 14, 12]}
              />
              <StatCard
                title="Profile Views"
                value="2414"
                change={3.24}
                trend="up"
                period="vs last month"
                chartData={[7, 9, 8, 10, 9, 11, 10, 12, 11, 13]}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-6">
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base">Earning</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-1">
                        <span>September 2023</span>
                        <Info className="h-3 w-3" />
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">$5,925.00</span>
                        <span className="text-xs text-green-500">↑ 1.86%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">$2,978.20</span>
                        <span className="text-xs text-red-500">↓ 3.35%</span>
                      </div>
                    </div>
                    <Select defaultValue="mar-apr">
                      <SelectTrigger className="w-[180px] h-8">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mar-apr">Mar 2023 - Feb 2024</SelectItem>
                        <SelectItem value="jan-dec">Jan 2023 - Dec 2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-6">$10,874.23</div>
                  <EarningsChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">Top Courses</CardTitle>
                  <Button variant="link" className="h-auto p-0 text-sm">
                    See All
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TopCourseCard
                    title="UI Design"
                    lessons="122 lessons"
                    price="$9125.00"
                    icon="🎨"
                    color="bg-blue-100"
                  />
                  <TopCourseCard
                    title="Prototyping"
                    lessons="89 lessons"
                    price="$3566.00"
                    icon="🧩"
                    color="bg-orange-100"
                  />
                  <TopCourseCard
                    title="UX Design"
                    lessons="102 lessons"
                    price="$1632.00"
                    icon="🎯"
                    color="bg-green-100"
                  />
                  <TopCourseCard title="Webflow" lessons="65 lessons" price="$1152.00" icon="W" color="bg-purple-100" />
                  <TopCourseCard title="Framer" lessons="75 lessons" price="$720.00" icon="F" color="bg-gray-100" />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <Tabs defaultValue="all-course">
                  <div className="flex items-center justify-between">
                    <TabsList>
                      <TabsTrigger value="all-course">All Course</TabsTrigger>
                      <TabsTrigger value="students">Students</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Filter</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <span>Sort</span>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Tabs>
              </CardHeader>
              <CardContent>
                <Tabs value="all-course" className="m-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Tips & Trick UI Design</TableCell>
                        <TableCell>UI Design</TableCell>
                        <TableCell>$25.00</TableCell>
                        <TableCell>01-03-2024</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">• Active</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>UX Fundamentals</TableCell>
                        <TableCell>UX Design</TableCell>
                        <TableCell>$18.00</TableCell>
                        <TableCell>29-02-2024</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">• Active</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Prototyping</TableCell>
                        <TableCell>Prototyping</TableCell>
                        <TableCell>$16.00</TableCell>
                        <TableCell>26-02-2024</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">• Active</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Webflow</TableCell>
                        <TableCell>Webflow</TableCell>
                        <TableCell>$12.00</TableCell>
                        <TableCell>12-02-2024</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">• Active</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Tabs>
                <Tabs value="students" className="m-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>John Doe</TableCell>
                        <TableCell>john@example.com</TableCell>
                        <TableCell>UI Design</TableCell>
                        <TableCell>01-03-2024</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">• Active</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Jane Smith</TableCell>
                        <TableCell>jane@example.com</TableCell>
                        <TableCell>UX Design</TableCell>
                        <TableCell>28-02-2024</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">• Active</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Tabs>
              </CardContent>
            </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

