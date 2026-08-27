import '../styles/scene-bridge-polish.css'

export interface SceneBridgeProps {
  from: string
  to: string
}

const bridgeMediaKind = 'decorative-generated'
const bridgeProvenance = 'local-css'

export function SceneBridge({ from, to }: SceneBridgeProps) {
  return (
    <div
      aria-hidden="true"
      className="scene-bridge"
      data-bridge-layer="transition"
      data-media-kind={bridgeMediaKind}
      data-provenance={bridgeProvenance}
      data-scene-bridge={`${from}-${to}`}
    >
      <span
        aria-hidden="true"
        className="scene-bridge__paper"
        data-bridge-layer="paper"
        data-media-kind={bridgeMediaKind}
        data-provenance={bridgeProvenance}
      />
      <span
        aria-hidden="true"
        className="scene-bridge__marker"
        data-bridge-layer="marker"
        data-media-kind={bridgeMediaKind}
        data-provenance={bridgeProvenance}
      />
    </div>
  )
}
