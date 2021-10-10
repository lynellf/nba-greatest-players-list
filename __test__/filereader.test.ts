import { getPlayers } from '../src/file-reader'

describe('filereader', () => {
  it('gets a list of players from within the cache', () => {
    const players = getPlayers()
    const isArray = Array.isArray(players)
    expect(isArray).toBe(true)
  })
})
