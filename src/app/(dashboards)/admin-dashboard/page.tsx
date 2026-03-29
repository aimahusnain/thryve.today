import { getDashboardData } from "@/lib/dashboard-actions"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { AppSidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ArrowDown, ArrowUp, BookOpen, DollarSign, Search, ShoppingCart, Users } from "lucide-react"

export default async function Dashboard() {
  const data = await getDashboardData()

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
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8" />
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Explore enrollment data and revenue statistics</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data?.payments.totalRevenue || 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  From {data?.payments.completed || 0} completed payments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Enrollments</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.counts.enrollments || 0}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center text-xs text-green-500">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    {data?.payments.completed || 0} paid
                  </span>
                  <span className="flex items-center text-xs text-amber-500">
                    <ArrowDown className="mr-1 h-3 w-3" />
                    {data?.payments.pending || 0} pending
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.counts.courses || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Active courses in the system</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Cart Items</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.counts.cartItems || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Potential revenue opportunities</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <RevenueChart />

            <RecentTransactions transactions={data.recentTransactions || []} />
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-green-600 font-medium">Completed</p>
                      <p className="text-2xl font-bold text-green-700">{data?.payments.completed || 0}</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-amber-600 font-medium">Pending</p>
                      <p className="text-2xl font-bold text-amber-700">{data?.payments.pending || 0}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-red-600 font-medium">Failed</p>
                      <p className="text-2xl font-bold text-red-700">{data?.payments.failed || 0}</p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between">
                      <span className="text-sm">Completed</span>
                      <span className="text-sm">{data?.payments.completed || 0}</span>
                    </div>
                    <Progress
                      value={
                        data?.counts.enrollments > 0 ? (data?.payments.completed / data?.counts.enrollments) * 100 : 0
                      }
                      className="h-2 w-full bg-muted"
                    />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between">
                      <span className="text-sm">Pending</span>
                      <span className="text-sm">{data?.payments.pending || 0}</span>
                    </div>
                    <Progress
                      value={
                        data?.counts.enrollments > 0 ? (data?.payments.pending / data?.counts.enrollments) * 100 : 0
                      }
                      className="h-2 w-full bg-muted"
                    />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between">
                      <span className="text-sm">Failed</span>
                      <span className="text-sm">{data?.payments.failed || 0}</span>
                    </div>
                    <Progress
                      value={
                        data?.counts.enrollments > 0 ? (data?.payments.failed / data?.counts.enrollments) * 100 : 0
                      }
                      className="h-2 w-full bg-muted"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
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
      </SidebarInset>
    </SidebarProvider>
  )
}

