"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jul", target: 4000, actual: 2400 },
  { name: "Aug", target: 3000, actual: 1398 },
  { name: "Sep", target: 2000, actual: 9800 },
  { name: "Oct", target: 2780, actual: 3908 },
  { name: "Nov", target: 1890, actual: 4800 },
  { name: "Dec", target: 2390, actual: 3800 },
]

export function SalesTargetChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="target" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="actual" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

