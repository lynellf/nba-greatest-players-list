export interface FormattedPlayerData {
  name: string
  description: string
  born: string
  died?: string
  height: string
  education?: string
  imageUrl: string
  youtubeURL: string
  relatedLinks: RelatedLink[]
  gamesPlayed: number
  winSharesPer48: number
  scoringTitles: number
  assistTitles: number
  reboundingTitles: number
  stealsTitles: number
  blocksTitles: number
  allStarSelections: number
  mvpPlacements: number
  allTeamPlacements: number
  allDefensePlacements: number
  dpoys: number
  roty: number
  championships: number
  championshipMvps: number
}

export interface RawPlayerData {
  name: string
  topVideo: string
  relatedLinks: RelatedLink[]
  bio: Bio
  stats: Stats
}

export interface Bio {
  title: string
  description: string
  born: string
  died?: string
  height: string
  current_team?: string
  career_end?: string
  salary?: string
  education?: string
  images: Image[]
}

export interface Image {
  url: string
  source: string
}

export interface RelatedLink {
  title: string
  url: string
}

export interface Stats {
  honors: Honor[]
  advanced: Advanced[]
}

export interface Advanced {
  season: string
  age: number
  team_id: string
  lg_id: string
  pos: string
  g: number
  mp: number
  per: number
  ts_pct: number
  fg3a_per_fga_pct: number
  fta_per_fga_pct: number
  orb_pct: number
  drb_pct: number
  trb_pct: number
  ast_pct: number
  stl_pct: number
  blk_pct: number
  tov_pct: number
  usg_pct: number
  ows: number
  dws: number
  ws: number
  ws_per_48: number
  obpm: number
  dbpm: number
  bpm: number
  vorp: number
}

export interface Honor {
  label: string
  results: Result[]
}

export interface Result {
  honor: string
  rank: string
}

export interface Index {
  name: string
  chunk: number
  score: number
}

export type WeightedPlayerData = FormattedPlayerData & { score: number }

export const weightedPlayers: Array<WeightedPlayerData>
export const allPlayers: Array<FormattedPlayerData>
export const chunkedIndex: Array<Index>
export const weightedChunkedIndex: Array<Index>
