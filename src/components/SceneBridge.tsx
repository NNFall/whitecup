import { storyRouteConnectorGenerated } from '../data/media'

export interface SceneBridgeProps {
  from: string
  to: string
}

export function SceneBridge({ from, to }: SceneBridgeProps) {
  return (
    <div
      aria-hidden="true"
      className="scene-bridge"
      data-media-kind="decorative-generated"
      data-scene-bridge={`${from}-${to}`}
    >
      <img
        className="scene-bridge__route"
        src={storyRouteConnectorGenerated.src}
        srcSet={storyRouteConnectorGenerated.srcSet}
        sizes={storyRouteConnectorGenerated.sizes}
        alt=""
        aria-hidden="true"
      />
    </div>
  )
}
