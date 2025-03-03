"use client"

import { ArrowRight, Calendar, ChevronDown, Download, LayoutGrid, MessageSquare } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MetricCard } from "@/components/dashboard/metric-card"
import { LeadSourcesChart } from "@/components/dashboard/lead-sources-chart"
import { SalesTargetChart } from "@/components/dashboard/sales-target-chart"
import { SalesVolumeHeatmap } from "@/components/dashboard/sales-volume-heatmap"
import { ProfitMarginChart } from "@/components/dashboard/profit-margin-chart"
import { RevenueByChannelCard } from "@/components/dashboard/revenue-by-channel-card"
import { RevenueByCustomerChart } from "@/components/dashboard/revenue-by-customer-chart"

export function SalesPerformanceDashboard() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Performance</h1>
            <p className="text-sm text-gray-500">
              Track, analyze, and optimize your sales efforts with real-time insights and actionable metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-md border bg-white px-3 py-1.5">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">December 2024</span>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mt-2">
          <TabsList className="bg-white">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-100">
              Overview
            </TabsTrigger>
            <TabsTrigger value="metrics" className="data-[state=active]:bg-gray-100">
              Sales Metrics
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-gray-100">
              Trends & Analytics
            </TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-gray-100">
              Goals & Achievements
            </TabsTrigger>
          </TabsList>
          <div className="absolute right-6 top-[7.5rem] flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1 rounded-md">
              <LayoutGrid className="h-4 w-4" />
              <span className="text-xs font-medium">Manage Widget</span>
            </Button>
            <Button size="icon" variant="default" className="h-8 w-8 rounded-full">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </Tabs>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard title="Total Revenue" value="$950,000" change={12.55} icon="dollar" />
        <MetricCard title="Sales Pipeline Value" value="$245,000" change={12.55} icon="chart" />
        <MetricCard title="Avg. Revenue Per User" value="$200" change={-3.51} icon="user" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Lead Sources Contribution</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <LeadSourcesChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Sales Target vs Actual Performance</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1 rounded-md">
                <span className="text-xs font-medium">July - December</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <SalesTargetChart />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Sales Volume</CardTitle>
            <div className="flex items-center gap-2">
              <Select defaultValue="daily">
                <SelectTrigger className="h-8 w-[80px]">
                  <SelectValue placeholder="Daily" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <SalesVolumeHeatmap />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Revenue by Customer</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <RevenueByCustomerChart />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ProfitMarginChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Revenue by Channel</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <RevenueByChannelCard />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

