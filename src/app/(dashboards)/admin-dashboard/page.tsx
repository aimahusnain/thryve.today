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
        <div className="flex-1 overflow-auto">
    <h1>Hi, Admin I'm working in it - Developer</h1>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

