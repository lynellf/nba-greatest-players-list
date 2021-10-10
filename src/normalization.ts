import type {
  Advanced,
  Honor,
  RawPlayerData,
  Result
} from './@types/raw-player-data'
import { getPlayers } from './file-reader'
import { Map } from 'immutable'
import {
  mean,
  standardDeviation as std,
  variance,
  zScore
} from 'simple-statistics'
import { FormattedPlayerData } from './@types/formatted-player-data'

type HonorKeys =
  | 'Most Valuable Player'
  | 'Finals Most Valuable Player'
  | 'Defensive Player of the Year'
  | 'Rookie of the Year'
  | 'All-Star Games'
  | 'All-League'
  | 'MVP Award Shares'
  | 'Points Per Game'
  | 'Rebounds Per Game'
  | 'Assists Per Game'
  | 'Steals Per Game'
  | 'Blocks Per Game'
  | 'Championships'
  | 'All-Defense'

type PlayerTotals = {
  name: string
  totalGames: number
  totalWinShareRate: number
  totalObpm: number
  totalDbpm: number
  totalVorp: number
  totalMvps: number
  totalScoring: number
  totalAssists: number
  totalRebounds: number
  totalSteals: number
  totalBlocks: number
  totalAllStars: number
  totalAllTeam: number
  totalDefTeam: number
  totalRoty: number
  totalDpoy: number
  totalChampionships: number
  totalFinalsMvp: number
}

const allPlayers = getPlayers()

const honorDefault: Honor = {
  label: 'default',
  results: []
}

function awardByKeyword(keyword: string) {
  return (award: Result) => award.honor.includes(keyword)
}

function sum(nums: number[]) {
  return nums.reduce((sum, num) => sum + num, 0)
}

function getTable(tables: Honor[], query: string) {
  return tables.find((table) => table.label === query) ?? honorDefault
}

function getAdvancedStatTotal(player: RawPlayerData) {
  return (stat: keyof Advanced) =>
    player.stats.advanced.reduce(
      (sum, table) => sum + (table[stat] as number),
      0
    )
}

function formatRanking(result: Result) {
  const regexp = /\((.*)\)/g
  const valRegexp = /[0-9]/g
  const matches = result.rank.match(regexp)
  const rank = matches?.[0] ?? '(0th)'
  const valMatches = rank.match(valRegexp)
  const val = valMatches?.[0] ?? '0'
  const isNil = val === '0'
  return isNil ? 0 : 100 - parseInt(val)
}

function awardSearch(tables: Honor[]) {
  return (query: string) => () => {
    const awards = getTable(tables, 'Awards')
    const awardTotal = awards.results.filter(awardByKeyword(query))
    return awardTotal.length
  }
}

function honorSearchWRank(tables: Honor[]) {
  return (query: string) => () => {
    const rawHonors = getTable(tables, query)
    const parsedRankings = rawHonors.results.map(formatRanking)
    const hasValues = parsedRankings.length > 0
    return hasValues ? sum(parsedRankings) : 0
  }
}

function honorSearch(tables: Honor[]) {
  return (query: string) => () => {
    const rawHonors = getTable(tables, query)
    return rawHonors.results.length
  }
}

function allTeamSearch(tables: Honor[]) {
  return () => () => {
    const allLeague = getTable(tables, 'All-League')
    const allTeam = allLeague.results.filter((item) =>
      item.rank.includes('All-NBA')
    )
    const parsedRankings = allTeam.map(formatRanking)
    const hasValues = parsedRankings.length > 0
    return hasValues ? sum(parsedRankings) : 0
  }
}

function allDefenseSearch(tables: Honor[]) {
  return () => () => {
    const allLeague = getTable(tables, 'All-League')
    const allTeam = allLeague.results.filter((item) =>
      item.rank.includes('All-Defensive')
    )
    const parsedRankings = allTeam.map(formatRanking)
    const hasValues = parsedRankings.length > 0
    return hasValues ? sum(parsedRankings) : 0
  }
}

function fallback(honor: HonorKeys) {
  console.log(`${honor} not found`)
  return () => 0
}

function parseHonors(tables: Honor[], honor: HonorKeys) {
  const findAwardTotal = awardSearch(tables)
  const findHonorRankTotal = honorSearchWRank(tables)
  const findHonorTotal = honorSearch(tables)
  const findAllNba = allTeamSearch(tables)
  const findAllDefense = allDefenseSearch(tables)

  const callbacks = Map({
    'Most Valuable Player': findHonorRankTotal('MVP Award Shares'),
    'Finals Most Valuable Player': findAwardTotal('Finals'),
    'Defensive Player of the Year': findAwardTotal('Defensive'),
    'Rookie of the Year': findAwardTotal('Rookie'),
    'All-Star Games': findHonorTotal('All-Star Games'),
    'All-League': findAllNba(),
    'All-Defense': findAllDefense(),
    'Points Per Game': findHonorRankTotal('Points Per Game'),
    'Rebounds Per Game': findHonorRankTotal('Rebounds Per Game'),
    'Assists Per Game': findHonorRankTotal('Assists Per Game'),
    'Steals Per Game': findHonorRankTotal('Steals Per Game'),
    'Blocks Per Game': findHonorRankTotal('Blocks Per Game'),
    Championships: findHonorTotal('Championships')
  })
  return (callbacks.get(honor) ?? fallback(honor))()
}

function getHonorPlacementTotal(player: RawPlayerData) {
  return (honor: HonorKeys) => parseHonors(player.stats.honors, honor)
}

function getTotals(player: RawPlayerData): PlayerTotals {
  const { name } = player
  const getTotals = getAdvancedStatTotal(player)
  const getHonorTotals = getHonorPlacementTotal(player)
  const totalGames = getTotals('g')
  const totalWinShareRate = getTotals('ws_per_48')
  const totalObpm = getTotals('obpm')
  const totalDbpm = getTotals('dbpm')
  const totalVorp = getTotals('vorp')
  const totalMvps = getHonorTotals('Most Valuable Player')
  const totalScoring = getHonorTotals('Points Per Game')
  const totalAssists = getHonorTotals('Assists Per Game')
  const totalRebounds = getHonorTotals('Rebounds Per Game')
  const totalSteals = getHonorTotals('Steals Per Game')
  const totalBlocks = getHonorTotals('Blocks Per Game')
  const totalAllStars = getHonorTotals('All-Star Games')
  const totalAllTeam = getHonorTotals('All-League')
  const totalDefTeam = getHonorTotals('All-Defense')
  const totalRoty = getHonorTotals('Rookie of the Year')
  const totalDpoy = getHonorTotals('Defensive Player of the Year')
  const totalChampionships = getHonorTotals('Championships')
  const totalFinalsMvp = getHonorTotals('Finals Most Valuable Player')

  return {
    name,
    totalGames,
    totalWinShareRate,
    totalObpm,
    totalDbpm,
    totalVorp,
    totalMvps,
    totalScoring,
    totalAssists,
    totalRebounds,
    totalAllStars,
    totalSteals,
    totalBlocks,
    totalAllTeam,
    totalDefTeam,
    totalRoty,
    totalDpoy,
    totalChampionships,
    totalFinalsMvp
  }
}

function parseTotals(playerTotals: PlayerTotals[]) {
  return (key: keyof PlayerTotals) => {
    if (key === 'name') {
      return playerTotals.map((_, index) => index)
    }

    return playerTotals.map((player) => player[key])
  }
}

const playerTotals = allPlayers.map(getTotals)
const totalsByKey = parseTotals(playerTotals)

const meanGames = mean(totalsByKey('totalGames'))
const meanWinShares = mean(totalsByKey('totalWinShareRate'))
const meanObpm = mean(totalsByKey('totalObpm'))
const meanDbpm = mean(totalsByKey('totalDbpm'))
const meanVorp = mean(totalsByKey('totalVorp'))
const meanMvps = mean(totalsByKey('totalMvps'))
const meanScoring = mean(totalsByKey('totalScoring'))
const meanAssists = mean(totalsByKey('totalAssists'))
const meanRebounds = mean(totalsByKey('totalRebounds'))
const meanSteals = mean(totalsByKey('totalSteals'))
const meanBlocks = mean(totalsByKey('totalBlocks'))
const meanAllStars = mean(totalsByKey('totalAllStars'))
const meanAllTeam = mean(totalsByKey('totalAllTeam'))
const meanDefTeam = mean(totalsByKey('totalDefTeam'))
const meanRoty = mean(totalsByKey('totalRoty'))
const meanDpoy = mean(totalsByKey('totalDpoy'))
const meanChampionships = mean(totalsByKey('totalChampionships'))
const meanFinalsMvp = mean(totalsByKey('totalFinalsMvp'))

const stdGames = std(totalsByKey('totalGames'))
const stdWinShares = std(totalsByKey('totalWinShareRate'))
const stdObpm = std(totalsByKey('totalObpm'))
const stdDbpm = std(totalsByKey('totalDbpm'))
const stdVorp = std(totalsByKey('totalVorp'))
const stdMvps = std(totalsByKey('totalMvps'))
const stdScoring = std(totalsByKey('totalScoring'))
const stdAssists = std(totalsByKey('totalAssists'))
const stdRebounds = std(totalsByKey('totalRebounds'))
const stdSteals = std(totalsByKey('totalSteals'))
const stdBlocks = std(totalsByKey('totalBlocks'))
const stdAllStars = std(totalsByKey('totalAllStars'))
const stdAllTeam = std(totalsByKey('totalAllTeam'))
const stdDefTeam = std(totalsByKey('totalDefTeam'))
const stdRoty = std(totalsByKey('totalRoty'))
const stdDpoy = std(totalsByKey('totalDpoy'))
const stdChampionships = std(totalsByKey('totalChampionships'))
const stdFinalsMvp = std(totalsByKey('totalFinalsMvp'))

const varGames = variance(totalsByKey('totalGames'))
const varWinShares = variance(totalsByKey('totalWinShareRate'))
const varObpm = variance(totalsByKey('totalObpm'))
const varDbpm = variance(totalsByKey('totalDbpm'))
const varVorp = variance(totalsByKey('totalVorp'))
const varMvps = variance(totalsByKey('totalMvps'))
const varScoring = variance(totalsByKey('totalScoring'))
const varAssists = variance(totalsByKey('totalAssists'))
const varRebounds = variance(totalsByKey('totalRebounds'))
const varSteals = variance(totalsByKey('totalSteals'))
const varBlocks = variance(totalsByKey('totalBlocks'))
const varAllStars = variance(totalsByKey('totalAllStars'))
const varAllTeam = variance(totalsByKey('totalAllTeam'))
const varDefTeam = variance(totalsByKey('totalDefTeam'))
const varRoty = variance(totalsByKey('totalRoty'))
const varDpoy = variance(totalsByKey('totalDpoy'))
const varChampionships = variance(totalsByKey('totalChampionships'))
const varFinalsMvp = variance(totalsByKey('totalFinalsMvp'))

export function getDescriptiveStats() {
  return {
    games: { mean: meanGames, std: stdGames, var: varGames },
    winShares: { mean: meanWinShares, std: stdWinShares, var: varWinShares },
    obpm: { mean: meanObpm, std: stdObpm, var: varObpm },
    dbpm: { mean: meanDbpm, std: stdDbpm, var: varDbpm },
    vorp: { mean: meanVorp, std: stdVorp, var: varVorp },
    mvps: { mean: meanMvps, std: stdMvps, var: varMvps },
    scoring: { mean: meanScoring, std: stdScoring, var: varScoring },
    assists: { mean: meanAssists, std: stdAssists, var: varAssists },
    rebounds: { mean: meanRebounds, std: stdRebounds, var: varRebounds },
    steals: { mean: meanSteals, std: stdSteals, var: varSteals },
    blocks: { mean: meanBlocks, std: stdBlocks, var: varBlocks },
    allStars: { mean: meanAllStars, std: stdAllStars, var: varAllStars },
    allTeam: { mean: meanAllTeam, std: stdAllTeam, var: varAllTeam },
    defTeam: { mean: meanDefTeam, std: stdDefTeam, var: varDefTeam },
    roty: { mean: meanRoty, std: stdRoty, var: varRoty },
    dpoy: { mean: meanDpoy, std: stdDpoy, var: varDpoy },
    championships: {
      mean: meanChampionships,
      std: stdChampionships,
      var: varChampionships
    },
    finalsMvp: { mean: meanFinalsMvp, std: stdFinalsMvp, var: varFinalsMvp }
  }
}

export const formattedPlayers: FormattedPlayerData[] = playerTotals.map(
  (player) => {
    const fullPlayer = allPlayers.find((p) => p.name === player.name)
    return {
      name: player.name,
      description: fullPlayer.bio.description,
      born: fullPlayer.bio.born,
      died: fullPlayer.bio.died,
      height: fullPlayer.bio.height,
      education: fullPlayer.bio.education,
      imageUrl: fullPlayer.bio.images?.[0]?.url ?? '',
      youtubeURL: fullPlayer.topVideo,
      relatedLinks: fullPlayer.relatedLinks,
      gamesPlayed: zScore(player.totalGames, meanGames, stdGames),
      winSharesPer48: zScore(
        player.totalWinShareRate,
        meanWinShares,
        stdWinShares
      ),
      scoringTitles: zScore(player.totalScoring, meanScoring, stdScoring),
      assistTitles: zScore(player.totalAssists, meanAssists, stdAssists),
      reboundingTitles: zScore(player.totalRebounds, meanRebounds, stdRebounds),
      stealsTitles: zScore(player.totalSteals, meanSteals, stdSteals),
      blocksTitles: zScore(player.totalBlocks, meanBlocks, stdBlocks),
      allStarSelections: zScore(
        player.totalAllStars,
        meanAllStars,
        stdAllStars
      ),
      mvpPlacements: zScore(player.totalMvps, meanMvps, stdMvps),
      allTeamPlacements: zScore(player.totalAllTeam, meanAllTeam, stdAllTeam),
      allDefensePlacements: zScore(
        player.totalDefTeam,
        meanDefTeam,
        stdDefTeam
      ),
      dpoys: zScore(player.totalDpoy, meanDpoy, stdDpoy),
      championships: zScore(
        player.totalChampionships,
        meanChampionships,
        stdChampionships
      ),
      championshipMvps: zScore(
        player.totalFinalsMvp,
        meanFinalsMvp,
        stdFinalsMvp
      ),
      roty: zScore(player.totalRoty, meanRoty, stdRoty)
    }
  }
)
