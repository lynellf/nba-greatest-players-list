# nba-greatest-players-list

A list of the greatest players to ever play the game. Over 300 players ranked.

Great if you want a data source to reference within your front-end applications.

### Installation

`npm install nba-greatest-players-list`

```js
const { allPlayers, weightedPlayers } = require('nba-greatest-players-list')
```

### Each Player has a good amount of info attached to them

```typescript
export interface FormattedPlayerData {
  name: string // lastname, firstname
  description: string // brief bio pulled from google
  born: string
  died?: string // rip kobe
  height: string
  education?: string
  imageUrl: string // random profile pic url
  youtubeURL: string
  relatedLinks: RelatedLink[] // top 7 links if one performed a google search

  // The following are z-scored rankings against one another
  // using stats pulled from basketball-reference
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
```

```md
'James, LeBron',  
'Jordan, Michael',  
'Abdul-Jabbar, Kareem',
'Duncan, Tim',  
"O'Neal, Shaquille",  
'Olajuwon, Hakeem',
'Bryant, Kobe',  
'Garnett, Kevin',  
'Chamberlain, Wilt',
'Bird, Larry',  
'Malone, Karl',  
'Robinson, David',
'Malone, Moses',  
'Johnson, Magic',  
'Paul, Chris',
'Nowitzki, Dirk',  
'Stockton, John',  
'Havlicek, John',
'Kidd, Jason',  
'Erving, Julius',  
'Howard, Dwight',
'Payton, Gary',  
'Mutombo, Dikembe',  
'Durant, Kevin',
'Russell, Bill',  
'Gilmore, Artis',  
'Robertson, Oscar',
'Leonard, Kawhi',  
'Wallace, Ben',  
'Ewing, Patrick',
'Parish, Robert',  
'Barry, Rick',  
'West, Jerry',
'Wade, Dwyane',  
'Barkley, Charles',  
'Carter, Vince',
'Pippen, Scottie',  
'Parker, Tony',  
'Gasol, Pau',
... and many more
```

### Extras

The total file sizes of the playerlist is roughly 700kb, which is extremely large.

So, to help out a tad, I've chunked the player list, and modules can be imported dynamically (at least, that's the theory).

```javascript
import { chunkedIndex, weightedChunkedIndex } from 'nba-greatest-players-list'

const basePath = 'nba-greatest-players-list'

chunkedIndex.forEach(async (player) => {
  const mod = await import(`${basePath}/lib/chunked/${player.chunk}`)
  console.log(mod)
})

chunkedIndex.forEach(async (player) => {
  const mod = await import(`${basePath}/lib/weighted-chunked/${player.chunk}`)
  console.log(mod)
})
```
