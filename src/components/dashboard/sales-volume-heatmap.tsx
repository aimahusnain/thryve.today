"use client"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const devices = ["Laptop", "Monitor", "Audio", "Phone", "Wearables"]

// Generate sample data for the heatmap
const generateHeatmapData = () => {
  const data: number[][] = []
  for (let i = 0; i < devices.length; i++) {
    const row: number[] = []
    for (let j = 0; j < days.length; j++) {
      // Generate random values between 0 and 3
      const value = Math.floor(Math.random() * 3)
      row.push(value)
    }
    data.push(row)
  }
  return data
}

const heatmapData = generateHeatmapData()

export function SalesVolumeHeatmap() {
  const getColor = (value: number) => {
    if (value === 0) return "bg-blue-50"
    if (value === 1) return "bg-blue-200"
    return "bg-blue-600"
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <div key={day} className="text-center text-xs font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col gap-1 pr-2">
          {devices.map((device) => (
            <div key={device} className="flex h-8 items-center text-xs font-medium">
              {device}
            </div>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-7 gap-1">
          {heatmapData.flatMap((row, i) =>
            row.map((value, j) => <div key={`${i}-${j}`} className={`h-8 rounded ${getColor(value)}`} />),
          )}
        </div>
      </div>
      <div className="mt-2 flex justify-end gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-50" />
          <span className="text-xs">0-100</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-200" />
          <span className="text-xs">100-500</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-600" />
          <span className="text-xs">500-1000</span>
        </div>
      </div>
    </div>
  )
}

