import { RelatedLink } from './raw-player-data'

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
