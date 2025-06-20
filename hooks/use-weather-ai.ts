"use client"

import { useState, useEffect } from "react"
import type { WeatherData, ForecastData, WeatherInsight, WeatherAlert } from "@/types/weather"
import {
  generateWeatherSummary,
  generateWeatherInsights,
  processNaturalLanguageQuery as processQuery,
  generateSmartAlerts,
} from "@/lib/groq-ai"

export function useWeatherSummary(weatherData: WeatherData, forecast: ForecastData | null) {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!weatherData) return

    const fetchSummary = async () => {
      setLoading(true)
      setError(null)

      try {
        const generatedSummary = await generateWeatherSummary(weatherData, forecast)
        setSummary(generatedSummary)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate summary")
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [weatherData, forecast])

  return { summary, loading, error }
}

export function useWeatherInsights(weatherData: WeatherData, forecast: ForecastData | null) {
  const [insights, setInsights] = useState<WeatherInsight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!weatherData) return

    const fetchInsights = async () => {
      setLoading(true)
      setError(null)

      try {
        const generatedInsights = await generateWeatherInsights(weatherData, forecast)
        setInsights(generatedInsights)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate insights")
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [weatherData, forecast])

  return { insights, loading, error }
}

export function useNaturalLanguageSearch() {
  const [loading, setLoading] = useState(false)

  const processNaturalLanguageQuery = async (query: string): Promise<string | null> => {
    setLoading(true)

    try {
      const result = await processQuery(query)
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { processNaturalLanguageQuery, loading }
}

export function useSmartAlerts(weatherData: WeatherData, forecast: ForecastData | null) {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!weatherData) return

    const fetchAlerts = async () => {
      setLoading(true)

      try {
        const generatedAlerts = await generateSmartAlerts(weatherData, forecast)
        setAlerts(generatedAlerts)
      } catch (err) {
        console.error("Failed to generate alerts:", err)
        setAlerts([])
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [weatherData, forecast])

  return { alerts, loading }
}
