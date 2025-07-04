"use client"

import { useState, useEffect } from "react"
import type { PlayerDetails } from "@/lib/types"
import { X, RefreshCw } from "lucide-react"
import { SiSteam } from "react-icons/si"

interface PlayerModalProps {
  nickname: string
  isOpen: boolean
  onClose: () => void
}

const FaceitIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path
      d="M21 4.134c0-.143-.17-.18-.238-.071-2.177 3.553-3.436 5.563-4.525 7.429H3.174c-.17 0-.238.215-.102.287 5.41 2.153 13.233 5.42 17.622 7.214.102.036.306-.072.306-.144V4.134z"
      fill="currentColor"
    />
  </svg>
)

export function PlayerModal({ nickname, isOpen, onClose }: PlayerModalProps) {
  const [playerData, setPlayerData] = useState<PlayerDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPlayerData = async () => {
    if (!nickname) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://faceitdata.lmao.cl/faceit/${nickname}`)
      if (!response.ok) {
        throw new Error("Player not found")
      }
      const data = await response.json()
      setPlayerData(data)
    } catch (error) {
      setError("Failed to load player data")
      console.error("Error fetching player data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getFlagUrl = (countryCode: string) => {
    return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`
  }

  const getSteamProfileUrl = (steamId: string) => {
    return `https://steamcommunity.com/profiles/${steamId}`
  }

  const getFaceitProfileUrl = (nickname: string) => {
    return `https://www.faceit.com/en/players/${nickname}`
  }

  useEffect(() => {
    if (isOpen && nickname) {
      fetchPlayerData()
    }
  }, [isOpen, nickname])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-[oklch(18%_0_0)] rounded-lg p-6 w-80 max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Player Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-6">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-6">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {playerData && !loading && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={playerData.avatar || "/placeholder.svg"} alt={nickname} className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{nickname}</h3>
                <div className="flex items-center gap-2">
                  <img
                    src={getFlagUrl(playerData.country) || "/placeholder.svg"}
                    alt={playerData.country.toUpperCase()}
                    className="w-5 h-4"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{playerData.country.toUpperCase()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={getFaceitProfileUrl(nickname)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center justify-center transition-colors"
                  title="View FACEIT Profile"
                >
                  <FaceitIcon />
                </a>
                <a
                  href={getSteamProfileUrl(playerData.cs2.game_id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 dark:bg-[oklch(22%_0_0)] hover:bg-gray-700 dark:hover:bg-[oklch(26%_0_0)] rounded-lg flex items-center justify-center transition-colors"
                  title="View Steam Profile"
                >
                  <SiSteam className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{playerData.cs2.faceit_elo}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">ELO</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
