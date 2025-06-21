import { NextRequest, NextResponse } from "next/server"
import { generateWeatherInsights } from "@/lib/groq-ai"

export async function POST(req: NextRequest) {
  try {
    const { weatherData, forecast } = await req.json()
    const insights = await generateWeatherInsights(weatherData, forecast)
    return NextResponse.json({ insights })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to generate insights" }, { status: 500 })
  }
}
