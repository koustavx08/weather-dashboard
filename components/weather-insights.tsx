"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Lightbulb, Shirt, MapPin, Activity } from "lucide-react"
import { useWeatherInsights } from "@/hooks/use-weather-ai"
import type { WeatherData, ForecastData } from "@/types/weather"

interface WeatherInsightsProps {
  weatherData: WeatherData
  forecast: ForecastData | null
}

export function WeatherInsights({ weatherData, forecast }: WeatherInsightsProps) {
  const { insights, loading, error } = useWeatherInsights(weatherData, forecast)

  const getInsightIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "clothing":
        return <Shirt className="h-4 w-4" />
      case "activity":
        return <Activity className="h-4 w-4" />
      case "travel":
        return <MapPin className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "clothing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "activity":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "travel":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Personalized Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm">Unable to generate weather insights. Please try again later.</div>
          )}

          {insights && insights.length > 0 && !loading && (
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Badge className={getInsightColor(insight.type)}>
                      {getInsightIcon(insight.type)}
                      <span className="ml-1 capitalize">{insight.type}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{insight.recommendation}</p>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
