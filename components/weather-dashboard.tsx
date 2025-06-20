"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { WeatherSearch } from "./weather-search"
import { NaturalLanguageSearch } from "./natural-language-search"
import { CurrentWeather } from "./current-weather"
import { WeatherSummary } from "./weather-summary"
import { WeatherInsights } from "./weather-insights"
import { ForecastChart } from "./forecast-chart"
import { ForecastList } from "./forecast-list"
import { SmartAlerts } from "./smart-alerts"
import { ThemeToggle } from "./theme-toggle"
import { WeatherSkeleton } from "./weather-skeleton"
import { useWeather } from "@/hooks/use-weather"
import { useGeolocation } from "@/hooks/use-geolocation"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, AlertCircle, Brain, Search } from "lucide-react"

export function WeatherDashboard() {
  const [city, setCity] = useState("")
  const { location, error: locationError, getCurrentLocation } = useGeolocation()
  const { weatherData, forecast, loading, error, fetchWeatherByCity, fetchWeatherByCoords } = useWeather()

  useEffect(() => {
    // Try to get user's location on first load
    getCurrentLocation()
  }, [getCurrentLocation])

  useEffect(() => {
    // Fetch weather when location is available
    if (location) {
      fetchWeatherByCoords(location.latitude, location.longitude)
    }
  }, [location, fetchWeatherByCoords])

  const handleCitySearch = (cityName: string) => {
    setCity(cityName)
    fetchWeatherByCity(cityName)
  }

  const handleLocationClick = () => {
    getCurrentLocation()
  }

  const handleNaturalLanguageSearch = (query: string) => {
    // The natural language search component will handle the AI processing
    // and call handleCitySearch with the extracted city name
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Brain className="h-10 w-10 text-blue-500" />
              AI Weather Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Get intelligent weather insights powered by AI</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Search Tabs */}
        <Tabs defaultValue="traditional" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="traditional" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Traditional Search
            </TabsTrigger>
            <TabsTrigger value="natural" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="traditional" className="mt-4">
            <WeatherSearch onSearch={handleCitySearch} onLocationClick={handleLocationClick} loading={loading} />
          </TabsContent>

          <TabsContent value="natural" className="mt-4">
            <NaturalLanguageSearch onSearch={handleCitySearch} loading={loading} />
          </TabsContent>
        </Tabs>

        {/* Location Error */}
        {locationError && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{locationError}. Please search for a city manually.</AlertDescription>
          </Alert>
        )}

        {/* API Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && <WeatherSkeleton />}

        {/* Weather Data */}
        {weatherData && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Current Location */}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>
                {weatherData.name}, {weatherData.sys.country}
              </span>
            </div>

            {/* Smart Alerts */}
            <SmartAlerts weatherData={weatherData} forecast={forecast} />

            {/* Current Weather */}
            <CurrentWeather data={weatherData} />

            {/* AI-Powered Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <WeatherSummary weatherData={weatherData} forecast={forecast} />
              <WeatherInsights weatherData={weatherData} forecast={forecast} />
            </div>

            {/* Forecast Chart */}
            {forecast && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">7-Day Temperature Forecast</h3>
                  <ForecastChart data={forecast} />
                </CardContent>
              </Card>
            )}

            {/* Forecast List */}
            {forecast && <ForecastList data={forecast} />}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
