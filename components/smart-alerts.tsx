"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useSmartAlerts } from "@/hooks/use-weather-ai"
import { useToast } from "@/hooks/use-toast"
import type { WeatherData, ForecastData } from "@/types/weather"
import { AlertTriangle, CloudRain, Zap, Snowflake, Wind, Thermometer, Sun } from "lucide-react"

interface SmartAlertsProps {
  weatherData: WeatherData
  forecast: ForecastData | null
}

export function SmartAlerts({ weatherData, forecast }: SmartAlertsProps) {
  const { alerts, loading } = useSmartAlerts(weatherData, forecast)
  const { toast } = useToast()

  useEffect(() => {
    // Show toast notifications for severe alerts
    alerts.forEach((alert) => {
      if (alert.severity === "severe" || alert.severity === "extreme") {
        toast({
          title: `Weather Alert: ${alert.type}`,
          description: alert.message,
          variant: "destructive",
        })
      }
    })
  }, [alerts, toast])

  const getAlertIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "rain":
      case "heavy rain":
        return <CloudRain className="h-4 w-4" />
      case "thunderstorm":
        return <Zap className="h-4 w-4" />
      case "snow":
        return <Snowflake className="h-4 w-4" />
      case "wind":
        return <Wind className="h-4 w-4" />
      case "temperature":
      case "extreme temperature":
        return <Thermometer className="h-4 w-4" />
      case "uv":
        return <Sun className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getAlertVariant = (severity: string) => {
    switch (severity) {
      case "extreme":
      case "severe":
        return "destructive"
      default:
        return "default"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "extreme":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "severe":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    }
  }

  if (loading || alerts.length === 0) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="space-y-3"
      >
        {alerts.map((alert, index) => (
          <motion.div
            key={`${alert.type}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Alert variant={getAlertVariant(alert.severity)}>
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold capitalize">{alert.type} Alert</span>
                    <Badge className={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                  </div>
                  <AlertDescription className="text-sm">{alert.message}</AlertDescription>
                </div>
              </div>
            </Alert>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
