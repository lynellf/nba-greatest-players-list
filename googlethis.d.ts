declare module 'googlethis' {
  export interface GoogleSearchResults {
    results: FeaturedSnippet[]
    knowledge_panel: KnowledgePanel
    featured_snippet: FeaturedSnippet
    top_stories: TopStory[]
    people_also_ask: string[]
  }

  export interface FeaturedSnippet {
    title: string
    description: string
    url: string
    favicons?: Favicons
  }

  export interface Favicons {
    high_res: string
    low_res: string
  }

  export interface KnowledgePanel {
    title: string
    description: string
    url: string
    born: string
    height: string
    spouse: string
    nba_draft: string
    salary: string
    current_teams: string
    children: string
    type: string
    images: Image[]
  }

  export interface Image {
    url: string
    source: string
  }

  export interface TopStory {
    description: string
    url: string
  }

  export interface Options {
    page?: number
    safe?: boolean
    addditional_params?: Record<string, unknown>
  }

  export function search(
    query: string,
    options?: Options
  ): Promise<GoogleSearchResults>
}
