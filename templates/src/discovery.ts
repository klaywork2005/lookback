export type DiscoveryMovie = {
  tmdb_id: number
  title: string
  overview: string
  release_date: string | null
  runtime_minutes: number | null
  vote_average: number | null
  poster_url: string | null
  genres: string[]
}

export type Recommendation = {
  movie: DiscoveryMovie
  score: number
  shared_genres: string[]
  reasons: string[]
}

export type DiscoveryMap = {
  seed: DiscoveryMovie
  recommendations: Recommendation[]
}

export type DiscoveryRequest = { tmdbId?: number; sequence: number }
