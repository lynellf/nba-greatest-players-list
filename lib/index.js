const { weights: weightedPlayers } = require('./weighted-players')
const { allPlayers } = require('./all-players')
const chunkedIndex = require('./chunked/indexList')
const weightedChunkedIndex = require('./weighted-chunked/indexList')

module.exports = {
  weightedPlayers,
  allPlayers,
  chunkedIndex,
  weightedChunkedIndex
}
