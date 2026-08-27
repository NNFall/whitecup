import { render } from '@testing-library/react'
import { createElement } from 'react'

import { SceneBridge } from '../components/SceneBridge'

const bridgeModules = import.meta.glob<string>('./scene-bridge-polish*.css', {
  eager: true,
  import: 'default',
  query: '?raw',
})

const bridgeCss = Object.values(bridgeModules)[0] ?? ''

describe('SceneBridge polish contract', () => {
  it('renders only independent paper and marker layers with decorative provenance', () => {
    const { container } = render(createElement(SceneBridge, { from: 'hero', to: 'menu' }))
    const bridge = container.querySelector<HTMLElement>('[data-scene-bridge="hero-menu"]')

    expect(bridge).toHaveAttribute('aria-hidden', 'true')
    expect(bridge).toHaveAttribute('data-bridge-layer', 'transition')
    expect(bridge).toHaveAttribute('data-media-kind', 'decorative-generated')
    expect(bridge).toHaveAttribute('data-provenance', 'local-css')
    expect(bridge?.querySelector('img, picture, svg, canvas')).toBeNull()

    const layers = Array.from(bridge?.children ?? [], (layer) => layer as HTMLElement)

    expect(layers.map((layer) => layer.dataset.bridgeLayer)).toEqual(['paper', 'marker'])
    layers.forEach((layer) => {
      expect(layer).toHaveAttribute('aria-hidden', 'true')
      expect(layer).toHaveAttribute('data-media-kind', 'decorative-generated')
      expect(layer).toHaveAttribute('data-provenance', 'local-css')
    })
  })

  it('uses a warm feathered paper crossfade without a raster route ribbon', () => {
    expect(bridgeCss).toMatch(
      /\.scene-bridge\s*\{[\s\S]*position:\s*relative;[\s\S]*height:\s*clamp\(2\.5rem,\s*[^;]+,\s*5rem\);[\s\S]*overflow:\s*clip;[\s\S]*pointer-events:\s*none;/,
    )
    expect(bridgeCss).toMatch(/background:\s*linear-gradient\(/)
    expect(bridgeCss).toMatch(/\.scene-bridge__paper\s*\{[\s\S]*linear-gradient\(/)
    expect(bridgeCss).toMatch(
      /\.scene-bridge__marker\s*\{[\s\S]*width:\s*min\([^;]*9rem[^;]*\);[\s\S]*var\(--orange\)/,
    )
    expect(bridgeCss).not.toMatch(/clip-path:\s*polygon\s*\(/)
    expect(bridgeCss).not.toMatch(/border(?:-(?:top|right|bottom|left|inline|block))?\s*:/)
    expect(bridgeCss).not.toMatch(/story-route-connector|scene-bridge__route|route-ribbon/)
  })

  it('removes bridge animation and transitions for reduced-motion visitors', () => {
    expect(bridgeCss).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.scene-bridge,[\s\S]*\.scene-bridge\s+\*[\s\S]*animation:\s*none\s*!important;[\s\S]*transition:\s*none\s*!important;/,
    )
  })
})
