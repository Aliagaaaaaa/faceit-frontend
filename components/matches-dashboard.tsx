"use client"

import { useState, useEffect, useRef } from "react"
import type { Match } from "@/lib/types"
import { MatchCard } from "./match-card"
import { RefreshCw, Wifi, WifiOff } from "lucide-react"

export function MatchesDashboard() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket("wss://faceitdata.lmao.cl/ws/livematches")
      wsRef.current = ws

      ws.onopen = () => {
        console.log("WebSocket connected")
        setConnected(true)
        setLoading(false)
        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
          reconnectTimeoutRef.current = null
        }
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          // Ordenar las partidas por fecha de creación, las más antiguas primero
          const sortedMatches = data.sort((a: Match, b: Match) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          })

          setMatches(sortedMatches)
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      ws.onclose = () => {
        console.log("WebSocket disconnected")
        setConnected(false)

        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("Attempting to reconnect...")
          connectWebSocket()
        }, 3000)
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        setConnected(false)
      }
    } catch (error) {
      console.error("Error creating WebSocket connection:", error)
      setConnected(false)

      // Fallback to REST API if WebSocket fails
      fetchMatchesREST()
    }
  }

  const fetchMatchesREST = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://faceitdata.lmao.cl/faceit/livematches")
      const data = await response.json()

      // Ordenar las partidas por fecha de creación, las más antiguas primero
      const sortedMatches = data.sort((a: Match, b: Match) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })

      setMatches(sortedMatches)
    } catch (error) {
      console.error("Error fetching matches:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Try WebSocket first
    connectWebSocket()

    // Cleanup function
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading matches...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">CS2 SA - Super Matches</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {matches.length} live matches
        </p>
      </div>

      {/* Matches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  )
}
