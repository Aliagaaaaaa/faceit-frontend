"use client"

import { useState } from "react"
import type { Match } from "@/lib/types"
import { Clock, ExternalLink } from "lucide-react"
import { PlayerModal } from "./player-modal"

interface MatchCardProps {
  match: Match
}

export function MatchCard({ match }: MatchCardProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCurrentScore = () => {
    if (match.results.length > 0) {
      const latestResult = match.results[match.results.length - 1]
      return {
        faction1: latestResult.factions.faction1.score,
        faction2: latestResult.factions.faction2.score,
      }
    }
    return { faction1: 0, faction2: 0 }
  }

  const getFaceitUrl = () => {
    return `https://www.faceit.com/en/cs2/room/${match.id}`
  }

  const handlePlayerClick = (nickname: string) => {
    setSelectedPlayer(nickname)
  }

  const currentScore = getCurrentScore()

  return (
    <>
      <div className="bg-gray-50 dark:bg-[oklch(18%_0_0)] rounded-lg p-6 w-full">
        {/* Header */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatTime(match.createdAt)}</span>
          </div>
          <a
            href={getFaceitUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer"
          >
            <ExternalLink className="h-4 w-4" />
            <span>FACEIT</span>
          </a>
        </div>

        {/* Score */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-gray-800 dark:text-gray-200">
            {currentScore.faction1} - {currentScore.faction2}
          </div>
        </div>

        {/* Teams */}
        <div className="grid grid-cols-2 gap-8">
          {/* Team 1 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">{match.teams.faction1.name}</h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(match.teams.faction1.stats.winProbability * 100)}%
              </span>
            </div>
            <div className="space-y-1">
              {match.teams.faction1.roster.map((player) => (
                <div key={player.id} className="flex justify-between text-sm">
                  <button
                    onClick={() => handlePlayerClick(player.nickname)}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer text-left"
                  >
                    {player.nickname}
                  </button>
                  <span className="text-gray-600 dark:text-gray-400">{player.elo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team 2 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">{match.teams.faction2.name}</h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(match.teams.faction2.stats.winProbability * 100)}%
              </span>
            </div>
            <div className="space-y-1">
              {match.teams.faction2.roster.map((player) => (
                <div key={player.id} className="flex justify-between text-sm">
                  <button
                    onClick={() => handlePlayerClick(player.nickname)}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer text-left"
                  >
                    {player.nickname}
                  </button>
                  <span className="text-gray-600 dark:text-gray-400">{player.elo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PlayerModal nickname={selectedPlayer || ""} isOpen={!!selectedPlayer} onClose={() => setSelectedPlayer(null)} />
    </>
  )
}
