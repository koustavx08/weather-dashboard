import { NextRequest, NextResponse } from "next/server"
import { processNaturalLanguageQuery } from "@/lib/groq-ai"

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()
    const city = await processNaturalLanguageQuery(query)
    return NextResponse.json({ city })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to process query" }, { status: 500 })
  }
}
