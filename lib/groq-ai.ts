import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import type { WeatherData, ForecastData, WeatherInsight, WeatherAlert } from "@/types/weather"

const GROQ_API_KEY = process.env.GROQ_API_KEY || "YOUR_GROQ_API_KEY"

export async function generateWeatherSummary(weatherData: WeatherData, forecast: ForecastData | null): Promise<string> {
  try {
    const weatherContext = `
Current weather in ${weatherData.name}, ${weatherData.sys.country}:
- Temperature: ${weatherData.main.temp}°C (feels like ${weatherData.main.feels_like}°C)
- Condition: ${weatherData.weather[0].description}
- Humidity: ${weatherData.main.humidity}%
- Wind: ${weatherData.wind.speed} m/s
- Pressure: ${weatherData.main.pressure} hPa
- Visibility: ${weatherData.visibility / 1000} km

${forecast ? `7-day forecast available with temperatures ranging from ${Math.min(...forecast.daily.map((d) => d.temp.min))}°C to ${Math.max(...forecast.daily.map((d) => d.temp.max))}°C` : ""}
    `

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: `You are a professional meteorologist. Provide a concise, human-readable weather summary based on the following data. Make it informative yet easy to understand, highlighting the most important aspects of the current weather and any notable patterns in the forecast. Keep it under 150 words.

${weatherContext}

Generate a weather summary:`,
    })

    return text
  } catch (error) {
    console.error("Error generating weather summary:", error)
    throw new Error("Failed to generate weather summary")
  }
}

export async function generateWeatherInsights(
  weatherData: WeatherData,
  forecast: ForecastData | null,
): Promise<WeatherInsight[]> {
  try {
    const weatherContext = `
Current weather in ${weatherData.name}, ${weatherData.sys.country}:
- Temperature: ${weatherData.main.temp}°C (feels like ${weatherData.main.feels_like}°C)
- Condition: ${weatherData.weather[0].description}
- Humidity: ${weatherData.main.humidity}%
- Wind: ${weatherData.wind.speed} m/s
- Pressure: ${weatherData.main.pressure} hPa

${
  forecast
    ? `Upcoming weather: ${forecast.daily
        .slice(0, 3)
        .map(
          (d) =>
            `${new Date(d.dt * 1000).toLocaleDateString()}: ${d.temp.max}°C/${d.temp.min}°C, ${d.weather[0].description}`,
        )
        .join("; ")}`
    : ""
}
    `

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: `You are a helpful weather assistant. Based on the weather data, provide 3-4 personalized insights in the following categories: clothing, activity, and travel. Each insight should be practical and actionable.

${weatherContext}

Return your response as a JSON array with objects containing "type" (clothing/activity/travel) and "recommendation" fields. Example:
[
  {"type": "clothing", "recommendation": "Wear a light jacket as temperatures will drop in the evening"},
  {"type": "activity", "recommendation": "Perfect weather for outdoor activities like hiking or cycling"},
  {"type": "travel", "recommendation": "Good visibility for driving, but check for rain later today"}
]

Generate insights:`,
    })

    try {
      const insights = JSON.parse(text)
      return Array.isArray(insights) ? insights : []
    } catch {
      // Fallback if JSON parsing fails
      return [
        {
          type: "general",
          recommendation: text.slice(0, 200) + "...",
        },
      ]
    }
  } catch (error) {
    console.error("Error generating weather insights:", error)
    throw new Error("Failed to generate weather insights")
  }
}

export async function processNaturalLanguageQuery(query: string): Promise<string | null> {
  try {
    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: `You are a weather query processor. Extract the city name from natural language weather queries. If no city is mentioned, return null.

Examples:
- "What's the weather like in London?" → "London"
- "How's the weather in New York City today?" → "New York City"
- "Will it rain in Tokyo tomorrow?" → "Tokyo"
- "Is it sunny?" → null (no city mentioned)
- "Weather forecast for Paris, France" → "Paris"

Query: "${query}"

Return only the city name or null:`,
    })

    const cityName = text.trim()
    return cityName.toLowerCase() === "null" ? null : cityName
  } catch (error) {
    console.error("Error processing natural language query:", error)
    throw new Error("Failed to process query")
  }
}

export async function generateSmartAlerts(
  weatherData: WeatherData,
  forecast: ForecastData | null,
): Promise<WeatherAlert[]> {
  try {
    const weatherContext = `
Current weather in ${weatherData.name}:
- Temperature: ${weatherData.main.temp}°C
- Condition: ${weatherData.weather[0].main}
- Wind: ${weatherData.wind.speed} m/s
- Humidity: ${weatherData.main.humidity}%
- Pressure: ${weatherData.main.pressure} hPa

${
  forecast
    ? `Forecast: ${forecast.daily
        .slice(0, 2)
        .map(
          (d) => `${new Date(d.dt * 1000).toLocaleDateString()}: ${d.weather[0].main}, ${d.temp.max}°C/${d.temp.min}°C`,
        )
        .join("; ")}`
    : ""
}
    `

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: `You are a weather alert system. Analyze the weather data and generate relevant alerts for severe or notable conditions. Consider:

- Extreme temperatures (below 0°C or above 35°C)
- High wind speeds (above 10 m/s)
- Severe weather conditions (thunderstorms, heavy rain, snow)
- High UV index or other health concerns

${weatherContext}

Return alerts as a JSON array with objects containing "type", "severity" (mild/moderate/severe/extreme), and "message" fields. Only include alerts for significant conditions. If no alerts are needed, return an empty array.

Example:
[
  {"type": "temperature", "severity": "severe", "message": "Extreme heat warning: Temperature expected to reach 38°C. Stay hydrated and avoid prolonged sun exposure."},
  {"type": "wind", "severity": "moderate", "message": "Strong winds up to 15 m/s expected. Secure loose objects outdoors."}
]

Generate alerts:`,
    })

    try {
      const alerts = JSON.parse(text)
      return Array.isArray(alerts) ? alerts : []
    } catch {
      // Return empty array if JSON parsing fails
      return []
    }
  } catch (error) {
    console.error("Error generating smart alerts:", error)
    return []
  }
}
