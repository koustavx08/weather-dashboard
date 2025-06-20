"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { WeatherData } from "@/types/weather"
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Zap,
} from "lucide-react"

interface CurrentWeatherProps {
  data: WeatherData
}

const getWeatherIcon = (condition: string) => {
  const iconClass = "h-16 w-16"

  switch (condition.toLowerCase()) {
    case "clear":
      return <Sun className={`${iconClass} text-yellow-500`} />
    case "clouds":
      return <Cloud className={`${iconClass} text-gray-500`} />
    case "rain":
      return <CloudRain className={`${iconClass} text-blue-500`} />
    case "snow":
      return <CloudSnow className={`${iconClass} text-blue-200`} />
    case "thunderstorm":
      return <Zap className={`${iconClass} text-purple-500`} />
    default:
      return <Sun className={`${iconClass} text-yellow-500`} />
  }
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  const weatherStats = [
    {
      icon: <Droplets className="h-5 w-5 text-blue-500" />,
      label: "Humidity",
      value: `${data.main.humidity}%`,
    },
    {
      icon: <Wind className="h-5 w-5 text-gray-500" />,
      label: "Wind Speed",
      value: `${data.wind.speed} m/s`,
    },
    {
      icon: <Gauge className="h-5 w-5 text-purple-500" />,
      label: "Pressure",
      value: `${data.main.pressure} hPa`,
    },
    {
      icon: <Eye className="h-5 w-5 text-green-500" />,
      label: "Visibility",
      value: `${(data.visibility / 1000).toFixed(1)} km`,
    },
    {
      icon: <Sunrise className="h-5 w-5 text-orange-500" />,
      label: "Sunrise",
      value: sunrise,
    },
    {
      icon: <Sunset className="h-5 w-5 text-orange-600" />,
      label: "Sunset",
      value: sunset,
    },
  ]

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <div className="flex items-center justify-center md:justify-start mb-4">
                  {getWeatherIcon(data.weather[0].main)}
                </div>
                <h2 className="text-6xl font-bold mb-2">{Math.round(data.main.temp)}°C</h2>
                <p className="text-xl opacity-90 capitalize">{data.weather[0].description}</p>
                <p className="text-lg opacity-75">Feels like {Math.round(data.main.feels_like)}°C</p>
              </div>

              <div className="flex items-center gap-4 text-lg">
                <div className="text-center">
                  <Thermometer className="h-6 w-6 mx-auto mb-1" />
                  <div className="text-sm opacity-75">High</div>
                  <div className="font-semibold">{Math.round(data.main.temp_max)}°</div>
                </div>
                <div className="text-center">
                  <Thermometer className="h-6 w-6 mx-auto mb-1 rotate-180" />
                  <div className="text-sm opacity-75">Low</div>
                  <div className="font-semibold">{Math.round(data.main.temp_min)}°</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {weatherStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  {stat.icon}
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
