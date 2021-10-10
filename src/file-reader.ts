import { readFileSync, readdirSync } from 'fs'
import type { RawPlayerData } from './@types/raw-player-data'

const CACHE_DIR = './cache'

export function getPlayers(): RawPlayerData[] {
  const files = readdirSync(CACHE_DIR)
  return files.map((player) => {
    const playerData = readFileSync(`${CACHE_DIR}/${player}`)
    return JSON.parse(playerData.toString())
  })
}
