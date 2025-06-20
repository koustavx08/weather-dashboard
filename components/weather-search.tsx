"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Search, MapPin, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { debounce } from "@/lib/utils"

interface WeatherSearchProps {
  onSearch: (city: string) => void
  onLocationClick: () => void
  loading: boolean
}

export function WeatherSearch({ onSearch, onLocationClick, loading }: WeatherSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term.trim()) {
        onSearch(term.trim())
      }
    }, 500),
    [onSearch],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim())
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for a city..."
                value={searchTerm}
                onChange={handleInputChange}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading || !searchTerm.trim()} className="flex-1 sm:flex-none">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onLocationClick}
                disabled={loading}
                className="flex-1 sm:flex-none"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Use Location
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
