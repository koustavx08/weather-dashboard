import axios from "axios"
import type { WeatherData, ForecastData } from "@/types/weather"

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "YOUR_API_KEY"
const BASE_URL = "https://api.openweathermap.org/data/2.5"

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: "metric",
  },
})

export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  try {
    const response = await api.get("/weather", {
      params: { q: city },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("City not found. Please check the spelling and try again.")
      }
      if (error.response?.status === 401) {
        throw new Error("Invalid API key. Please check your OpenWeatherMap API key.")
      }
    }
    throw new Error("Failed to fetch weather data. Please try again.")
  }
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  try {
    const response = await api.get("/weather", {
      params: { lat, lon },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("Invalid API key. Please check your OpenWeatherMap API key.")
      }
    }
    throw new Error("Failed to fetch weather data. Please try again.")
  }
}

export async function fetchForecast(lat: number, lon: number): Promise<ForecastData> {
  try {
    // Using the free 5-day forecast API instead of One Call API
    const response = await api.get("/forecast", {
      params: { lat, lon },
    })

    // Transform the 5-day forecast data to match our ForecastData interface
    const forecastData = response.data
    const dailyData: any[] = []

    // Group forecast data by day (every 8th item represents a new day in 3-hour intervals)
    for (let i = 0; i < Math.min(forecastData.list.length, 40); i += 8) {
      const dayData = forecastData.list[i]
      if (dayData) {
        dailyData.push({
          dt: dayData.dt,
          sunrise: 0, // Not available in 5-day forecast
          sunset: 0, // Not available in 5-day forecast
          temp: {
            day: dayData.main.temp,
            min: dayData.main.temp_min,
            max: dayData.main.temp_max,
            night: dayData.main.temp,
            eve: dayData.main.temp,
            morn: dayData.main.temp,
          },
          feels_like: {
            day: dayData.main.feels_like,
            night: dayData.main.feels_like,
            eve: dayData.main.feels_like,
            morn: dayData.main.feels_like,
          },
          pressure: dayData.main.pressure,
          humidity: dayData.main.humidity,
          wind_speed: dayData.wind.speed,
          wind_deg: dayData.wind.deg,
          weather: dayData.weather,
          clouds: dayData.clouds.all,
          pop: dayData.pop || 0,
          uvi: 0, // Not available in 5-day forecast
        })
      }
    }

    return {
      lat: forecastData.city.coord.lat,
      lon: forecastData.city.coord.lon,
      timezone: forecastData.city.timezone,
      timezone_offset: forecastData.city.timezone,
      current: {
        dt: Date.now() / 1000,
        sunrise: 0,
        sunset: 0,
        temp: dailyData[0]?.temp.day || 0,
        feels_like: dailyData[0]?.feels_like.day || 0,
        pressure: dailyData[0]?.pressure || 0,
        humidity: dailyData[0]?.humidity || 0,
        dew_point: 0,
        uvi: 0,
        clouds: dailyData[0]?.clouds || 0,
        visibility: 10000,
        wind_speed: dailyData[0]?.wind_speed || 0,
        wind_deg: dailyData[0]?.wind_deg || 0,
        weather: dailyData[0]?.weather || [],
      },
      hourly: [], // Not implementing hourly for simplicity
      daily: dailyData,
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("Invalid API key. Please check your OpenWeatherMap API key.")
      }
    }
    throw new Error("Failed to fetch forecast data. Please try again.")
  }
}
