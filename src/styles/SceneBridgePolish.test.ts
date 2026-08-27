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

  it('derives a quiet atmospheric signature from the scene pair', () => {
    const { container } = render(createElement(SceneBridge, { from: 'about', to: 'visit' }))
    const bridge = container.querySelector<HTMLElement>('[data-scene-bridge="about-visit"]')

    expect(bridge).toHaveAttribute('data-bridge-label', 'ваш ритм — ваш стол')
    expect(bridge?.querySelector('.scene-bridge__label')).toHaveTextContent('ваш ритм — ваш стол')
  })

  it('uses an intentional rounded paper interval without a raster route ribbon', () => {
    expect(bridgeCss).toMatch(
      /\.scene-bridge\s*\{[\s\S]*position:\s*relative;[\s\S]*height:\s*clamp\(5\.25rem,\s*6vw,\s*8rem\);[\s\S]*margin-block:\s*0\s*!important;[\s\S]*overflow:\s*visible\s*!important;[\s\S]*pointer-events:\s*none;/,
    )
    expect(bridgeCss).toMatch(/background:\s*linear-gradient\(/)
    expect(bridgeCss).toMatch(
      /\.scene-bridge__paper\s*\{[\s\S]*border-radius:\s*clamp\([^;]+\);[\s\S]*linear-gradient\([\s\S]*box-shadow:/,
    )
    expect(bridgeCss).toMatch(
      /\.scene-bridge__paper\s*\{[\s\S]*inset:\s*clamp\([^;]+\)\s+!important;/,
    )
    expect(bridgeCss).toMatch(
      /\.scene-bridge__paper\s*\{[\s\S]*background:[\s\S]*!important;[\s\S]*clip-path:\s*none\s*!important;/,
    )
    expect(bridgeCss).toMatch(
      /\.scene-bridge__label\s*\{[\s\S]*font-family:\s*var\(--font-script\);[\s\S]*font-weight:\s*400;[\s\S]*letter-spacing:\s*0\.04em;/,
    )
    expect(bridgeCss).toMatch(
      /\.scene-bridge__marker\s*\{[\s\S]*width:\s*min\([^;]*11rem[^;]*\);[\s\S]*var\(--orange\)/,
    )
    expect(bridgeCss).toMatch(
      /@media\s*\(max-width:\s*1023px\)[\s\S]*\.scene-bridge\s*\{[\s\S]*height:\s*clamp\(2\.5rem,\s*13vw,\s*4rem\);/,
    )
    expect(bridgeCss).not.toMatch(/margin-block:\s*calc\([^;]*\*\s*-1\)/)
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
