import { write } from './file-writer'
import { getDescriptiveStats, formattedPlayers } from './normalization'
import { applyWeights } from './weights'
import { chunk } from 'lodash'

const chunkedPlayers = chunk(formattedPlayers, 13)
const weightedPlayers = formattedPlayers
  .map((player) => applyWeights(player))
  .sort((a, b) => b.score - a.score)

const chunkedWeightedPlayers = chunk(weightedPlayers, 13)

function writeChunks(chunks: any[][], dir: string, prefix: string) {
  chunks.forEach((players, index) => {
    write(
      `./lib/${dir}/${prefix}-${index}.js`,
      `module.exports = ${JSON.stringify(players)}`
    )
  })
}

function writeIndex(players: any[], chunks: any[][], dir: string) {
  const indexList = players.map((player, index) => ({
    name: player.name,
    chunk: chunks.findIndex((chunk) =>
      chunk.find((p) => player.name === p.name)
    ),
    score: player?.score ?? index + 1
  }))

  write(
    `./lib/${dir}/indexList.js`,
    `module.exports = ${JSON.stringify(indexList)}`
  )
}

export function compile() {
  write(
    './lib/all-players.js',
    `module.exports.allPlayers = ${JSON.stringify(formattedPlayers)}`
  )

  write(
    './lib/descriptive-stats.js',
    `module.exports.descriptiveStats = ${JSON.stringify(getDescriptiveStats())}`
  )

  write(
    './lib/weighted-players.js',
    `module.exports.weights = ${JSON.stringify(weightedPlayers)}`
  )

  writeChunks(chunkedPlayers, 'chunked', 'all-players')
  writeChunks(chunkedWeightedPlayers, 'weighted-chunked', 'weighted-players')
  writeIndex(formattedPlayers, chunkedPlayers, 'chunked')
  writeIndex(weightedPlayers, chunkedWeightedPlayers, 'weighted-chunked')
}
