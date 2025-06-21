"use client"

import { useState, useEffect } from "react"
import type { WeatherData, ForecastData, WeatherInsight, WeatherAlert } from "@/types/weather"

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
        const res = await fetch("/api/weather-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ weatherData, forecast }),
        })
        const data = await res.json()
        if (res.ok) {
          setSummary(data.summary)
        } else {
          setError(data.error || "Failed to generate summary")
        }
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
        const res = await fetch("/api/weather-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ weatherData, forecast }),
        })
        const data = await res.json()
        if (res.ok) {
          setInsights(data.insights)
        } else {
          setError(data.error || "Failed to generate insights")
        }
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
      const res = await fetch("/api/nl-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      if (res.ok) {
        return data.city
      } else {
        throw new Error(data.error || "Failed to process query")
      }
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
        const res = await fetch("/api/smart-alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ weatherData, forecast }),
        })
        const data = await res.json()
        if (res.ok) {
          setAlerts(data.alerts)
        } else {
          setAlerts([])
        }
      } catch (err) {
        setAlerts([])
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [weatherData, forecast])

  return { alerts, loading }
}
