import { NextRequest, NextResponse } from "next/server"
import { generateWeatherSummary } from "@/lib/groq-ai"

export async function POST(req: NextRequest) {
  try {
    const { weatherData, forecast } = await req.json()
    const summary = await generateWeatherSummary(weatherData, forecast)
    return NextResponse.json({ summary })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to generate summary" }, { status: 500 })
  }
}
