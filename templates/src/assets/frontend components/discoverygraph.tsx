import { useEffect, useRef } from 'react'
import cytoscape from 'cytoscape'
import type { DiscoveryMap } from '../../discovery'

export default function DiscoveryGraph({ map, selectedId, onSelect }: {
  map: DiscoveryMap
  selectedId: number
  onSelect: (tmdbId: number) => void
}) {
  const container = useRef<HTMLDivElement>(null)
  const graph = useRef<cytoscape.Core | null>(null)

  useEffect(() => {
    if (!container.current) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nodes: cytoscape.ElementDefinition[] = [
      { data: { id: String(map.seed.tmdb_id), title: map.seed.title, poster: map.seed.poster_url ?? undefined }, position: { x: 300, y: 240 }, classes: 'seed' },
      ...map.recommendations.map(({ movie }, index) => {
        const angle = -Math.PI / 2 + index * 2 * Math.PI / map.recommendations.length
        return {
          data: { id: String(movie.tmdb_id), title: movie.title, poster: movie.poster_url ?? undefined },
          position: { x: 300 + Math.cos(angle) * 215, y: 240 + Math.sin(angle) * 185 },
        }
      }),
    ]
    const edges = map.recommendations.map(({ movie, shared_genres }) => ({
      data: { id: `edge-${movie.tmdb_id}`, source: String(map.seed.tmdb_id), target: String(movie.tmdb_id), label: shared_genres.slice(0, 2).join(' · ') },
    }))
    const instance = cytoscape({
      container: container.current,
      elements: [...nodes, ...edges],
      layout: { name: 'preset', fit: true, padding: 45 },
      minZoom: 0.35,
      maxZoom: 2,
      userZoomingEnabled: false,
      boxSelectionEnabled: false,
      autoungrabify: true,
      style: [
        { selector: 'node', style: {
          width: 66, height: 96, shape: 'round-rectangle', 'background-color': '#253b43',
          'border-width': 2, 'border-color': '#547078', label: 'data(title)', color: '#d7e4e8',
          'font-size': 12, 'font-weight': 500, 'text-valign': 'bottom', 'text-margin-y': 9,
          'text-wrap': 'wrap', 'text-max-width': '110px', 'text-outline-width': 2, 'text-outline-color': '#111e25',
          'overlay-opacity': 0, 'background-fit': 'cover',
        } },
        { selector: 'node[poster]', style: { 'background-image': 'data(poster)' } },
        { selector: '.seed', style: { width: 82, height: 120, 'border-color': '#9ee4c6', 'border-width': 3, 'font-weight': 700, color: '#ffffff' } },
        { selector: '.inspected', style: { 'border-width': 4, 'border-color': '#f3d79c', color: '#f3d79c' } },
        { selector: 'edge', style: {
          width: 1.3, 'line-color': '#476269', 'curve-style': 'straight', label: 'data(label)',
          'font-size': 9, color: '#91b1b7', 'text-rotation': 'autorotate',
          'text-background-color': '#111e25', 'text-background-opacity': 1, 'text-background-padding': '4px',
        } },
        { selector: '.connected', style: { 'line-color': '#9ee4c6', width: 2 } },
      ],
    })
    graph.current = instance
    instance.on('tap', 'node', (event) => onSelect(Number(event.target.id())))
    const observer = new ResizeObserver(() => { instance.resize(); instance.fit(undefined, 45) })
    observer.observe(container.current)
    if (!reducedMotion) instance.animate({ fit: { eles: instance.elements(), padding: 45 } }, { duration: 300 })
    return () => { observer.disconnect(); instance.destroy(); graph.current = null }
  }, [map, onSelect])

  useEffect(() => {
    const instance = graph.current
    if (!instance) return
    instance.elements().removeClass('inspected connected')
    const node = instance.getElementById(String(selectedId))
    node.addClass('inspected')
    node.connectedEdges().addClass('connected')
  }, [selectedId, map])

  return (
    <div className="discovery-graph-wrap">
      <div className="discovery-graph" ref={container} role="img" aria-label={`Movie discovery map centered on ${map.seed.title}. Use the movie buttons below to select any movie with a keyboard.`} />
      <div className="discovery-graph-tools">
        <span><i /> Starting movie <i className="inspected-key" /> Selected movie</span>
        <button type="button" onClick={() => graph.current?.fit(undefined, 45)} aria-label="Reset discovery map view">Reset view ↗</button>
      </div>
      <p className="discovery-graph-hint">Select a poster to see its story. Follow a connection to keep exploring.</p>
    </div>
  )
}
