import { Map } from 'immutable'
import type { FormattedPlayerData } from './@types/formatted-player-data'

const baseWeights = Map({
  gamesPlayed: 1,
  winSharesPer48: 1,
  scoringTitles: 0.25,
  assistTitles: 0.25,
  reboundingTitles: 0.25,
  stealsTitles: 0.25,
  blocksTitles: 0.25,
  allStarSelections: 0.25,
  mvpPlacements: 0.5,
  allTeamPlacements: 0.4,
  allDefensePlacements: 0.3,
  dpoys: 0.45,
  roty: 0.5,
  championships: 0.5,
  championshipMvps: 0.75
})

export function applyWeights(
  player: FormattedPlayerData,
  weights = baseWeights
) {
  const score = weights.reduce((output, weight, key) => {
    const playerValue = player[key]
    const isStier = playerValue >= 2
    const isATier = playerValue >= 1
    const isBTier = playerValue >= 0
    const isCTier = playerValue >= -1

    if (isStier) return playerValue * weight + output
    if (isATier) return playerValue * weight + output
    if (isBTier) return playerValue * weight + output
    if (isCTier) return playerValue * weight + output

    return 0 + output
  }, 0)

  return { ...player, score }
}
