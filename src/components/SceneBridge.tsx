export interface SceneBridgeProps {
  from: string
  to: string
}

const bridgeMediaKind = 'decorative-generated'
const bridgeProvenance = 'local-css'

const bridgeLabels: Record<string, string> = {
  'hero-menu': 'сделайте паузу',
  'menu-about': 'здесь остаются надолго',
  'about-visit': 'ваш ритм — ваш стол',
  'visit-events': 'встречаемся за кофе',
  'events-locations': 'до скорой встречи',
}

function getBridgeLabel(from: string, to: string) {
  return bridgeLabels[`${from}-${to}`] ?? `${from} — ${to}`
}

export function SceneBridge({ from, to }: SceneBridgeProps) {
  const label = getBridgeLabel(from, to)

  return (
    <div
      aria-hidden="true"
      className="scene-bridge"
      data-bridge-layer="transition"
      data-media-kind={bridgeMediaKind}
      data-provenance={bridgeProvenance}
      data-bridge-label={label}
      data-scene-bridge={`${from}-${to}`}
    >
      <span
        aria-hidden="true"
        className="scene-bridge__paper"
        data-bridge-layer="paper"
        data-media-kind={bridgeMediaKind}
        data-provenance={bridgeProvenance}
      >
        <span className="scene-bridge__label">{label}</span>
      </span>
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
