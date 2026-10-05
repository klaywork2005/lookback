import { lazy, Suspense, useEffect, useState } from 'react'
import type { DiscoveryMap, DiscoveryMovie, DiscoveryRequest } from '../../discovery'
import DiscoveryGraphBoundary from './discoverygraphboundary'

const DiscoveryGraph = lazy(() => import('./discoverygraph'))

type Props = {
  request: DiscoveryRequest | null
  onExplore: (tmdbId?: number) => void
}

const movieYear = (movie: DiscoveryMovie) => movie.release_date?.slice(0, 4) ?? 'Year unknown'
const movieRuntime = (movie: DiscoveryMovie) => movie.runtime_minutes ? `${movie.runtime_minutes} min` : 'Runtime unknown'

function MoviePoster({ movie }: { movie: DiscoveryMovie }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  return movie.poster_url && failedUrl !== movie.poster_url ? (
    <img className="discovery-poster" src={movie.poster_url} alt="" loading="lazy" onError={() => setFailedUrl(movie.poster_url)} />
  ) : <span className="discovery-poster discovery-poster-fallback" aria-hidden="true">{movie.title.slice(0, 1)}</span>
}

export default function MovieDiscoverySection({ request, onExplore }: Props) {
  const [result, setResult] = useState<{ request: DiscoveryRequest; map: DiscoveryMap } | null>(null)
  const [failure, setFailure] = useState<{ request: DiscoveryRequest; message: string } | null>(null)
  const [selectedId, setSelectedId] = useState(0)
  const [trail, setTrail] = useState<DiscoveryMovie[]>([])
  const map = result?.map
  const loading = request !== null && result?.request !== request && failure?.request !== request
  const error = failure?.request === request ? failure?.message : null

  useEffect(() => {
    if (!request) return
    const controller = new AbortController()
    const timeout = window.setTimeout(() => {
      if (!controller.signal.aborted) {
        setFailure({ request, message: 'Finding connections took too long. Please try again.' })
        controller.abort()
      }
    }, 20_000)
    async function load() {
      try {
        const query = request?.tmdbId === undefined ? '' : `?tmdb_id=${request.tmdbId}`
        const response = await fetch(`/api/movies/discover/${query}`, { signal: controller.signal })
        if (!response.headers.get('content-type')?.includes('application/json')) {
          throw new Error('The movie catalogue is unavailable right now. Please try again.')
        }
        const data = await response.json() as DiscoveryMap & { error?: string }
        if (!response.ok) throw new Error(data.error ?? 'Unable to load related movies.')
        if (!data.seed || !Array.isArray(data.recommendations)) throw new Error('Unable to read the movie catalogue. Please try again.')
        if (controller.signal.aborted || !request) return
        setResult({ request, map: data })
        setSelectedId(data.seed.tmdb_id)
        setTrail((current) => {
          if (request.tmdbId === undefined) return [data.seed]
          const existing = current.findIndex((movie) => movie.tmdb_id === data.seed.tmdb_id)
          return existing >= 0 ? current.slice(0, existing + 1) : [...current, data.seed].slice(-6)
        })
      } catch (err) {
        if (!controller.signal.aborted && request) setFailure({ request, message: err instanceof Error ? err.message : 'Unable to load related movies.' })
      } finally {
        window.clearTimeout(timeout)
      }
    }
    void load()
    return () => { window.clearTimeout(timeout); controller.abort() }
  }, [request])

  const recommendation = map?.recommendations.find(({ movie }) => movie.tmdb_id === selectedId)
  const selected = recommendation?.movie ?? map?.seed

  return (
    <section id="movie-discovery" className="movie-discovery" aria-labelledby="discovery-title">
      <div className="discovery-heading">
        <div>
          <p className="discovery-eyebrow"><span /> THE DISCOVERY MAP</p>
          <h2 id="discovery-title">One movie.<br /><span>A whole new direction.</span></h2>
          <p className="discovery-intro">Loved the idea of a movie? Follow the connections and find your next favorite.</p>
        </div>
        <button className="discovery-button discovery-surprise" type="button" disabled={loading} onClick={() => onExplore()}>
          <span aria-hidden="true">✦</span> {loading ? 'Finding connections…' : map ? 'Surprise me again' : 'Explore a surprise pick'}
        </button>
      </div>

      <div role="status" aria-live="polite" className="discovery-status">
        {loading ? 'Finding movies connected to your pick…' : !error && map ? `Exploring ${map.seed.title}. ${map.recommendations.length} related movies found.` : ''}
      </div>
      {error && <div className="discovery-error" role="alert"><p>{error}</p><button type="button" className="discovery-button" onClick={() => onExplore(request?.tmdbId)}>Try again</button></div>}

      {map && selected ? <>
        <nav className="discovery-trail" aria-label="Movie exploration history">
          <span>YOUR TRAIL</span>
          {trail.map((movie, index) => <span className="discovery-trail-item" key={movie.tmdb_id}>
            {index > 0 && <span aria-hidden="true">→</span>}
            <button type="button" disabled={loading} aria-current={movie.tmdb_id === map.seed.tmdb_id ? 'step' : undefined} onClick={() => onExplore(movie.tmdb_id)}>{movie.title}</button>
          </span>)}
        </nav>

        <div className={`discovery-workspace${loading ? ' is-loading' : ''}`} aria-busy={loading}>
          <DiscoveryGraphBoundary key={result?.request.sequence}>
            <Suspense fallback={<div className="discovery-graph-loading" role="status">Drawing your discovery map…</div>}><DiscoveryGraph map={map} selectedId={selectedId} onSelect={setSelectedId} /></Suspense>
          </DiscoveryGraphBoundary>
          <article className="discovery-detail" aria-label="Selected movie details" aria-live="polite" aria-atomic="true">
            <div className="discovery-detail-top"><MoviePoster movie={selected} /><div>
              <p className="discovery-eyebrow">{recommendation ? 'A NEW CONNECTION' : 'YOUR STARTING POINT'}</p>
              <h3>{selected.title}</h3>
              <p className="discovery-meta">{movieYear(selected)} · {movieRuntime(selected)}</p>
              <p className="discovery-rating"><span aria-hidden="true">★</span> {selected.vote_average?.toFixed(1) ?? 'Unrated'}{selected.vote_average !== null && <span> / 10 on TMDB</span>}</p>
            </div></div>
            <div className="discovery-genres">{selected.genres.map((genre) => <span key={genre}>{genre}</span>)}</div>
            <p className="discovery-overview" tabIndex={0}>{selected.overview || 'A synopsis is not available for this movie yet.'}</p>
            {recommendation ? <div className="discovery-reasons">
              <div className="discovery-reasons-heading"><h4>Why this connection?</h4><span>{recommendation.score} / 100</span></div>
              <ul>{recommendation.reasons.map((reason) => <li key={reason}><span aria-hidden="true">↳</span> {reason}</li>)}</ul>
            </div> : <p className="discovery-seed-note">Every line leads to a movie with shared genres. Select a connection to discover what else they have in common.</p>}
            <button className="discovery-button discovery-follow" type="button" disabled={loading || !recommendation} onClick={() => onExplore(selected.tmdb_id)}>{recommendation ? 'Explore from this movie →' : 'Select a connected movie to continue'}</button>
          </article>
        </div>

        <div className="discovery-movie-list" role="group" aria-label="Select a movie in the discovery map">
          {[map.seed, ...map.recommendations.map(({ movie }) => movie)].map((movie) => <button type="button" key={movie.tmdb_id} aria-pressed={selectedId === movie.tmdb_id} disabled={loading} onClick={() => setSelectedId(movie.tmdb_id)}>
            <span className="discovery-movie-number">{movie.tmdb_id === map.seed.tmdb_id ? '◎' : '↗'}</span><span>{movie.title}</span>
          </button>)}
        </div>
        {map.recommendations.length === 0 && <p className="discovery-empty-note">This movie has no related titles in the catalogue yet. Try a surprise pick to discover another starting point.</p>}
      </> : <div className="discovery-welcome" aria-busy={loading}>
        <div className="discovery-orbit" aria-hidden="true"><div className="discovery-orbit-ring" /><div className="discovery-orbit-ring inner" /><span className="orbit-center">✦</span><span className="orbit-dot one" /><span className="orbit-dot two" /><span className="orbit-dot three" /><span className="orbit-dot four" /></div>
        <div><p className="discovery-eyebrow">LET CURIOSITY PICK THE NEXT ONE</p><h3>There’s always another story.</h3><p>Start with a surprise pick, or use “Explore similar” on your movie above. Then select a poster and see where it takes you.</p><div className="discovery-welcome-tags"><span>Shared genres</span><span>Similar runtimes</span><span>Nearby release years</span></div></div>
      </div>}

      <div className="discovery-footer"><span>Six connections. Endless directions.</span><details><summary>How are movies connected?</summary><p>Each recommendation shares at least one genre. Its similarity score uses genre overlap (up to 70 points), runtime within 20 minutes (15 points), and release years within five years (15 points). Missing data earns no bonus. These are similarities, not a prediction of your taste. Movies come from LookBack’s stored TMDB catalogue.</p></details></div>
    </section>
  )
}
