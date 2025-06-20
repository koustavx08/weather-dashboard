"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Brain, Loader2, Send } from "lucide-react"
import { useNaturalLanguageSearch } from "@/hooks/use-weather-ai"
import { useToast } from "@/hooks/use-toast"

interface NaturalLanguageSearchProps {
  onSearch: (city: string) => void
  loading: boolean
}

export function NaturalLanguageSearch({ onSearch, loading }: NaturalLanguageSearchProps) {
  const [query, setQuery] = useState("")
  const { processNaturalLanguageQuery, loading: aiLoading } = useNaturalLanguageSearch()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    try {
      const extractedCity = await processNaturalLanguageQuery(query)
      if (extractedCity) {
        onSearch(extractedCity)
        setQuery("")
      } else {
        toast({
          title: "Unable to understand query",
          description: "Please try rephrasing your weather question.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "There was an error processing your query. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isLoading = loading || aiLoading

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">AI-Powered Search</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Ask me anything about weather... e.g., 'What's the weather like in London?' or 'Will it rain in Tokyo tomorrow?'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
                className="pr-12"
              />
              <Button
                type="submit"
                size="sm"
                disabled={isLoading || !query.trim()}
                className="absolute right-1 top-1 h-8 w-8 p-0"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium mb-1">Try asking:</p>
              <ul className="space-y-1 text-xs">
                <li>• "What's the weather like in Paris?"</li>
                <li>• "Will it be sunny in New York tomorrow?"</li>
                <li>• "Should I bring an umbrella in London?"</li>
                <li>• "What's the temperature in Tokyo right now?"</li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
