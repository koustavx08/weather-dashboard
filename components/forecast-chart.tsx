"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import type { ForecastData } from "@/types/weather"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ForecastChartProps {
  data: ForecastData
}

export function ForecastChart({ data }: ForecastChartProps) {
  const chartData = data.daily.slice(0, 7).map((day, index) => ({
    day: new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" }),
    high: Math.round(day.temp.max),
    low: Math.round(day.temp.min),
    date: new Date(day.dt * 1000).toLocaleDateString(),
  }))

  return (
    <ChartContainer
      config={{
        high: {
          label: "High Temperature",
          color: "hsl(var(--chart-1))",
        },
        low: {
          label: "Low Temperature",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="day" className="text-muted-foreground" fontSize={12} />
          <YAxis
            className="text-muted-foreground"
            fontSize={12}
            label={{ value: "°C", angle: -90, position: "insideLeft" }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="high"
            stroke="var(--color-high)"
            strokeWidth={3}
            dot={{ fill: "var(--color-high)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="low"
            stroke="var(--color-low)"
            strokeWidth={3}
            dot={{ fill: "var(--color-low)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
