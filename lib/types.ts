export interface Player {
  nickname: string
  id: string
  gameSkillLevel: number
  elo: number
}

export interface TeamStats {
  winProbability: number
  skillLevel: {
    average: number
    range: {
      min: number
      max: number
    }
  }
}

export interface Team {
  name: string
  leader: string
  score: number
  roster: Player[]
  stats: TeamStats
}

export interface MatchResult {
  ascScore: boolean
  partial: boolean
  factions: {
    faction1: { score: number }
    faction2: { score: number }
  }
  afk: string[]
  leavers: string[]
  voteKicked: string[]
  disqualified: string[]
}

export interface Match {
  id: string
  game: string
  region: string
  status: string
  tags: string[]
  teams: {
    faction1: Team
    faction2: Team
  }
  createdAt: string
  results: MatchResult[]
}

export interface PlayerDetails {
  id: string
  avatar: string
  country: string
  cs2: {
    game_id: string
    faceit_elo: number
    region: string
  }
}

export interface RankingPlayer {
  position: number
  id: string
  nickname: string
  country: string
  elo: number
  skillLevel: number
  globalPosition: number
}

export interface RankingResponse {
  offset: number
  limit: number
  results: RankingPlayer[]
}
