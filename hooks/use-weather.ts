"use client"

import { useState, useCallback } from "react"
import type { WeatherData, ForecastData } from "@/types/weather"
import { fetchWeatherByCity, fetchWeatherByCoords, fetchForecast } from "@/lib/weather-api"

export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeatherByCityName = useCallback(async (city: string) => {
    setLoading(true)
    setError(null)

    try {
      const weatherResponse = await fetchWeatherByCity(city)
      const forecastResponse = await fetchForecast(weatherResponse.coord.lat, weatherResponse.coord.lon)

      setWeatherData(weatherResponse)
      setForecast(forecastResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data")
      setWeatherData(null)
      setForecast(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchWeatherByCoordinates = useCallback(async (lat: number, lon: number) => {
    setLoading(true)
    setError(null)

    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetchWeatherByCoords(lat, lon),
        fetchForecast(lat, lon),
      ])

      setWeatherData(weatherResponse)
      setForecast(forecastResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data")
      setWeatherData(null)
      setForecast(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    weatherData,
    forecast,
    loading,
    error,
    fetchWeatherByCity: fetchWeatherByCityName,
    fetchWeatherByCoords: fetchWeatherByCoordinates,
  }
}
