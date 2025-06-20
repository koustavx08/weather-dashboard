"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain, FileText } from "lucide-react"
import { useWeatherSummary } from "@/hooks/use-weather-ai"
import type { WeatherData, ForecastData } from "@/types/weather"

interface WeatherSummaryProps {
  weatherData: WeatherData
  forecast: ForecastData | null
}

export function WeatherSummary({ weatherData, forecast }: WeatherSummaryProps) {
  const { summary, loading, error } = useWeatherSummary(weatherData, forecast)

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Weather Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm">Unable to generate weather summary. Please try again later.</div>
          )}

          {summary && !loading && (
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{summary}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
