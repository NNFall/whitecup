import { SceneLayer } from './SceneLayer'
import type { SceneLayerManifestEntry } from '../data/media'

export interface StaticMapLabel {
  id: string
  label: string
  hint?: string
}

export interface StaticMapCardProps {
  layer: SceneLayerManifestEntry
  labels: readonly StaticMapLabel[]
  className?: string
}

/**
 * Decorative map artwork used to mirror the supplied scene. Route links and
 * complete addresses remain semantic controls in the adjacent location cards.
 */
export function StaticMapCard({ layer, labels, className }: StaticMapCardProps) {
  return (
    <div
      className={['static-map-card', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      data-decorative-map="true"
    >
      <SceneLayer
        {...layer}
        className="locations-scene__map-image"
        loading="lazy"
        decoding="async"
      />
      <div className="locations-scene__map-copy">
        <span className="locations-scene__map-city">САМАРА</span>
        {labels.map((location) => (
          <span
            className="locations-scene__map-label"
            data-map-location={location.id}
            key={location.id}
          >
            <strong>{location.label}</strong>
            {location.hint ? <small>{location.hint}</small> : null}
          </span>
        ))}
      </div>
    </div>
  )
}
