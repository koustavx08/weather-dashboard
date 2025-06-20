"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ForecastData } from "@/types/weather"
import { Cloud, Sun, CloudRain, CloudSnow, Zap, Droplets, Wind } from "lucide-react"

interface ForecastListProps {
  data: ForecastData
}

const getWeatherIcon = (condition: string, size = "h-8 w-8") => {
  switch (condition.toLowerCase()) {
    case "clear":
      return <Sun className={`${size} text-yellow-500`} />
    case "clouds":
      return <Cloud className={`${size} text-gray-500`} />
    case "rain":
      return <CloudRain className={`${size} text-blue-500`} />
    case "snow":
      return <CloudSnow className={`${size} text-blue-200`} />
    case "thunderstorm":
      return <Zap className={`${size} text-purple-500`} />
    default:
      return <Sun className={`${size} text-yellow-500`} />
  }
}

export function ForecastList({ data }: ForecastListProps) {
  const dailyForecast = data.daily.slice(0, 7)

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dailyForecast.map((day, index) => {
            const date = new Date(day.dt * 1000)
            const dayName = index === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "long" })
            const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

            return (
              <motion.div
                key={day.dt}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  {getWeatherIcon(day.weather[0].main)}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{dayName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{dateStr}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{day.weather[0].description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Droplets className="h-4 w-4" />
                      <span>{Math.round(day.pop * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind className="h-4 w-4" />
                      <span>{Math.round(day.wind_speed)} m/s</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {Math.round(day.temp.max)}°
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">{Math.round(day.temp.min)}°</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
