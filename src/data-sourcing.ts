import { writeFileSync } from 'fs'
import playerlist from './playerlist'
import { search } from 'googlethis'
import { getPlayer } from 'basketball-reference-player-scraper/lib'
import { searchVideo } from 'usetube'

function fetchPlayer(playerName: string, delay = 6_000) {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(async () => {
        const flippedName = playerName.split(' ').reverse().join(', ')

        const videoResults = await searchVideo(
          `${flippedName} NBA career highlights`
        )
        const searchResults = await search(`${flippedName} NBA`)

        const bbrefResults = await getPlayer(playerName, {
          tableIDs: ['advanced'],
          bio: false,
          honors: true,
          contract: false
        })

        // formatting results
        const topVideo = `https://youtube.com/watch?v=${videoResults.videos[0].id}`

        const relatedLinks = searchResults.results.map((result) => ({
          title: result.title,
          url: result.url
        }))

        const bio = searchResults?.knowledge_panel ?? {}
        const stats = {
          honors: bbrefResults.honors,
          advanced: bbrefResults?.advanced ?? []
        }
        const output = {
          name: playerName,
          topVideo,
          relatedLinks,
          bio,
          stats
        }
        writeFileSync(`./cache/${playerName}.json`, JSON.stringify(output))
        resolve(output)
      }, delay)
    } catch (error) {
      reject(error)
    }
  })
}

export async function main() {
  const playerData = []

  for await (const playerName of playerlist) {
    console.log(`Fetching ${playerName}`)
    const result = await fetchPlayer(playerName).catch((e) => {
      console.error(e)
      return {
        name: playerName,
        topVideo: '',
        relatedLinks: [],
        bio: {},
        stats: {
          honors: [],
          advanced: []
        }
      }
    })
    playerData.push(result)
  }

  writeFileSync('./all-players.ts', `export default ${playerData}`)
}
