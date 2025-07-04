"use client"

import { useState, useEffect } from "react"
import type { RankingResponse, RankingPlayer } from "@/lib/types"
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { PlayerModal } from "./player-modal"

export function RankingTable() {
  const [ranking, setRanking] = useState<RankingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)
  const itemsPerPage = 100

  const fetchRanking = async (page: number) => {
    setLoading(true)
    try {
      const offset = (page - 1) * itemsPerPage
      const response = await fetch(`https://faceitdata.lmao.cl/faceit/ranking?limit=${itemsPerPage}&offset=${offset}`)
      const data = await response.json()
      setRanking(data)
    } catch (error) {
      console.error("Error fetching ranking:", error)
    } finally {
      setLoading(false)
    }
  }

  const getFlagUrl = (countryCode: string) => {
    return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`
  }

  const handlePlayerClick = (nickname: string) => {
    setSelectedPlayer(nickname)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchRanking(page)
  }

  useEffect(() => {
    fetchRanking(currentPage)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading ranking...</span>
        </div>
      </div>
    )
  }

  if (!ranking || !ranking.results?.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 dark:text-gray-400">No ranking data available.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">CS2 Global Ranking</h1>
          <p className="text-gray-600 dark:text-gray-400">Top players worldwide</p>
        </div>

        {/* Table */}
        <div className="bg-gray-50 dark:bg-[oklch(18%_0_0)] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-[oklch(22%_0_0)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ELO
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-[oklch(22%_0_0)]">
                {(ranking?.results ?? []).map((player: RankingPlayer) => (
                  <tr key={player.id} className="hover:bg-gray-100 dark:hover:bg-[oklch(22%_0_0)] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                          #{player.globalPosition}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handlePlayerClick(player.nickname)}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline cursor-pointer"
                      >
                        {player.nickname}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          src={getFlagUrl(player.country) || "/placeholder.svg"}
                          alt={player.country.toUpperCase()}
                          className="w-5 h-4"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                        <span className="text-sm text-gray-900 dark:text-gray-200">{player.country.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">{player.elo}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {ranking?.offset ? ranking.offset + 1 : 1} to{" "}
            {ranking?.offset ? ranking.offset + (ranking?.results.length || 0) : ranking?.results.length || 0} of many
            players
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-[oklch(22%_0_0)] border border-gray-300 dark:border-[oklch(26%_0_0)] rounded-md hover:bg-gray-50 dark:hover:bg-[oklch(26%_0_0)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Page {currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!ranking?.results || (ranking.results?.length ?? 0) < itemsPerPage}
              className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-[oklch(22%_0_0)] border border-gray-300 dark:border-[oklch(26%_0_0)] rounded-md hover:bg-gray-50 dark:hover:bg-[oklch(26%_0_0)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <PlayerModal nickname={selectedPlayer || ""} isOpen={!!selectedPlayer} onClose={() => setSelectedPlayer(null)} />
    </>
  )
}
