import { storyRouteConnectorGenerated } from '../data/media'

export interface SceneBridgeProps {
  from: string
  to: string
}

export function SceneBridge({ from, to }: SceneBridgeProps) {
  const isFirstConnector = from === 'hero' && to === 'menu'

  return (
    <div
      aria-hidden="true"
      className="scene-bridge"
      data-bridge-layer="transition"
      data-media-kind="decorative-generated"
      data-scene-bridge={`${from}-${to}`}
    >
      <span
        aria-hidden="true"
        className="scene-bridge__paper"
        data-bridge-layer="paper"
      />
      <img
        aria-hidden="true"
        className="scene-bridge__route"
        data-bridge-layer="route"
        src={storyRouteConnectorGenerated.src}
        srcSet={storyRouteConnectorGenerated.srcSet}
        sizes={storyRouteConnectorGenerated.sizes}
        loading={isFirstConnector ? 'eager' : 'lazy'}
        decoding="async"
        alt=""
      />
    </div>
  )
}
