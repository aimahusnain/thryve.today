"use client"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", profit: 4000 },
  { name: "Feb", profit: 3000 },
  { name: "Mar", profit: 2000 },
  { name: "Apr", profit: 2780 },
  { name: "May", profit: 1890 },
  { name: "Jun", profit: 2390 },
  { name: "Jul", profit: 3490 },
]

export function ProfitMarginChart() {
  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="profit" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

