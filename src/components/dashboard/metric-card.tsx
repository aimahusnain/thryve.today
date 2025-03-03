import { ArrowUpRight, ArrowDownRight, BarChart3, DollarSign, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: "dollar" | "chart" | "user"
}

export function MetricCard({ title, value, change, icon }: MetricCardProps) {
  const isPositive = change >= 0

  const getIcon = () => {
    switch (icon) {
      case "dollar":
        return <DollarSign className="h-5 w-5 text-white" />
      case "chart":
        return <BarChart3 className="h-5 w-5 text-white" />
      case "user":
        return <User className="h-5 w-5 text-white" />
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn("flex items-center text-xs font-medium", isPositive ? "text-green-600" : "text-red-600")}
              >
                {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(change).toFixed(2)}%
              </span>
              <span className="text-xs text-gray-500">from previous month</span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">{getIcon()}</div>
        </div>
      </CardContent>
    </Card>
  )
}

