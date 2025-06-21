import { NextRequest, NextResponse } from "next/server"
import { generateSmartAlerts } from "@/lib/groq-ai"

export async function POST(req: NextRequest) {
  try {
    const { weatherData, forecast } = await req.json()
    const alerts = await generateSmartAlerts(weatherData, forecast)
    return NextResponse.json({ alerts })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to generate smart alerts" }, { status: 500 })
  }
}
