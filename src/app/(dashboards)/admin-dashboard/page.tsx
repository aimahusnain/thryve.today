"use client"

import { getDashboardData } from "@/components/actions/ashboard-actions"
import { AppSidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ArrowDown, ArrowUp, BookOpen, DollarSign, RefreshCw, Search, ShoppingCart, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface DashboardData {
  counts: {
    enrollments: number
    courses: number
    cartItems: number
    users: number
  }
  usersByRole: { role: string; _count: { _all: number } }[]
  payments: {
    totalRevenue: number
    completed: number
    pending: number
    failed: number
    byStatus?: Record<string, number>
  }
  enrollmentsByStatus: {
    paymentStatus: string
    _count: {
      id: number
    }
  }[]
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const dashboardData = await getDashboardData()
      setData(dashboardData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate percentages for the progress bars
  const adminPercentage = data?.usersByRole?.find((r) => r.role === "ADMIN")?._count._all || 0
  const userPercentage = data?.usersByRole?.find((r) => r.role === "USER")?._count._all || 0

  const totalUsers = adminPercentage + userPercentage
  const adminPercent = totalUsers > 0 ? (adminPercentage / totalUsers) * 100 : 0
  const userPercent = totalUsers > 0 ? (userPercentage / totalUsers) * 100 : 0

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mx-2 h-4" />
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8" />
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Good morning, Admin!</h1>
              <p className="text-muted-foreground">Explore enrollment data and course statistics</p>
            </div>
            <Button variant="outline" className="gap-2" onClick={fetchData}>
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <p>Loading dashboard data...</p>
            </div>
          ) : data ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Enrollments</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data?.counts.enrollments || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Courses</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">{data?.counts.courses || 0}</div>
                      {data?.counts.courses > 0 && (
                        <span className="flex items-center text-sm text-green-500">
                          <ArrowUp className="mr-1 h-3 w-3" />
                          Active
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Cart Items</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data?.counts.cartItems || 0}</div>
                  </CardContent>
                </Card>
                <Card className="bg-black text-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Users</CardTitle>
                    <Users className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data?.counts.users || 0}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-lg font-medium">Payment Statistics</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold">{formatCurrency(data?.payments.totalRevenue || 0)}</div>
                          {data?.payments.completed > 0 && (
                            <span className="flex items-center text-sm text-green-500">
                              <ArrowUp className="mr-1 h-3 w-3" />
                              {data?.payments.completed} paid
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold">{data?.payments.pending || 0}</div>
                          {data?.payments.pending > 0 && (
                            <span className="flex items-center text-sm text-amber-500">
                              <ArrowDown className="mr-1 h-3 w-3" />
                              Awaiting
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Enrollment Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] w-full">
                        <ChartContainer
                          config={{
                            pending: {
                              label: "Pending",
                              color: "hsl(38, 92%, 50%)", // amber-400 equivalent
                            },
                            completed: {
                              label: "Completed",
                              color: "hsl(142, 71%, 45%)", // green-500 equivalent
                            },
                            failed: {
                              label: "Failed",
                              color: "hsl(0, 84%, 60%)", // red-500 equivalent
                            },
                          }}
                        >
                          <BarChart
                            data={[
                              {
                                name: "Status",
                                pending: data?.payments.pending || 0,
                                completed: data?.payments.completed || 0,
                                failed: data?.payments.failed || 0,
                              },
                            ]}
                            margin={{
                              top: 10,
                              right: 10,
                              left: 10,
                              bottom: 10,
                            }}
                          >
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="pending" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="completed" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="failed" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ChartContainer>
                      </div>
                      <div className="mt-4 flex justify-center gap-6">
                        {[
                          {
                            label: "Pending",
                            value: data?.payments.pending || 0,
                            color: "bg-amber-400",
                          },
                          {
                            label: "Completed",
                            value: data?.payments.completed || 0,
                            color: "bg-green-500",
                          },
                          {
                            label: "Failed",
                            value: data?.payments.failed || 0,
                            color: "bg-red-500",
                          },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                            <span className="text-sm text-muted-foreground">{item.label}</span>
                            <span className="text-sm font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Course Enrollment</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center pt-4">
                      <div className="relative flex h-44 w-44 items-center justify-center">
                        <svg className="h-full w-full" viewBox="0 0 100 100">
                          <circle className="stroke-muted stroke-[8] opacity-25" cx="50" cy="50" r="40" fill="none" />
                          <circle
                            className="stroke-blue-600 stroke-[8]"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            strokeDasharray="251.2"
                            strokeDashoffset={
                              251.2 -
                              ((data?.counts.enrollments || 0) / (data?.counts.enrollments > 0 ? 100 : 1)) * 251.2
                            }
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-3xl font-bold">{data?.counts.enrollments || 0}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <h3 className="font-medium">Total enrollments</h3>
                        <p className="text-sm text-muted-foreground">Across all courses</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">User Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Admin Users</p>
                            <p className="text-2xl font-bold">{adminPercentage}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Regular Users</p>
                            <p className="text-2xl font-bold">{userPercentage}</p>
                          </div>
                        </div>

                        <div>
                          <div className="mb-1 flex justify-between">
                            <span className="text-sm">Admin</span>
                            <span className="text-sm">{adminPercentage}</span>
                          </div>
                          <Progress value={adminPercent} className="h-2 w-full bg-muted" />
                        </div>

                        <div>
                          <div className="mb-1 flex justify-between">
                            <span className="text-sm">Users</span>
                            <span className="text-sm">{userPercentage}</span>
                          </div>
                          <Progress value={userPercent} className="h-2 w-full bg-muted" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-40 items-center justify-center">
              <p>No data available. Please refresh to try again.</p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

