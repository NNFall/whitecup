import { render } from '@testing-library/react'

import { SceneBridge } from './SceneBridge'

const bridgeCss = (await import('../styles/scene-bridge-polish.css?raw')).default as string

const bridgePairs = [
  ['hero', 'menu'],
  ['menu', 'about'],
  ['about', 'visit'],
  ['visit', 'events'],
  ['events', 'locations'],
] as const

describe('SceneBridge', () => {
  it('renders a scene pair as an inert decorative bridge', () => {
    const { container } = render(<SceneBridge from="hero" to="menu" />)

    const bridge = container.querySelector<HTMLElement>('[data-scene-bridge="hero-menu"]')

    expect(bridge).toHaveAttribute('aria-hidden', 'true')
    expect(bridge).toHaveAttribute('data-media-kind', 'decorative-generated')
    expect(bridge).toHaveAttribute('data-provenance', 'local-css')
    expect(bridge).toHaveAttribute('data-bridge-layer', 'transition')
    expect(bridge).toHaveClass('scene-bridge')
    expect(bridge).not.toHaveAttribute('tabindex')
    expect(bridge?.querySelector('h1, h2, h3, h4, h5, h6, [role="heading"]')).toBeNull()
    expect(bridge?.querySelector('a, button, input, select, textarea')).toBeNull()
  })

  it('orders the paper wash beneath the minimal CSS marker', () => {
    const { container } = render(<SceneBridge from="menu" to="about" />)

    const bridge = container.querySelector<HTMLElement>('[data-scene-bridge="menu-about"]')
    const layers = Array.from(
      bridge?.querySelectorAll<HTMLElement>('[data-bridge-layer]') ?? [],
      (layer) => layer.dataset.bridgeLayer,
    )

    expect(layers).toEqual(['paper', 'marker'])
    expect(bridge?.querySelector('[data-bridge-layer="paper"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })

  it.each(bridgePairs)('binds the %s-%s paper and marker layers to their CSS hooks', (from, to) => {
    const { container } = render(<SceneBridge from={from} to={to} />)

    const bridge = container.querySelector<HTMLElement>(`[data-scene-bridge="${from}-${to}"]`)
    const paper = bridge?.querySelector<HTMLElement>('[data-bridge-layer="paper"]')
    const marker = bridge?.querySelector<HTMLElement>('[data-bridge-layer="marker"]')

    expect(paper).toHaveClass('scene-bridge__paper')
    expect(marker).toHaveClass('scene-bridge__marker')
    expect(paper?.parentElement).toBe(bridge)
    expect(marker?.parentElement).toBe(bridge)
    expect(paper).toHaveAttribute('aria-hidden', 'true')
    expect(marker).toHaveAttribute('aria-hidden', 'true')
    expect(paper).toHaveAttribute('data-media-kind', 'decorative-generated')
    expect(marker).toHaveAttribute('data-media-kind', 'decorative-generated')
    expect(paper).toHaveAttribute('data-provenance', 'local-css')
    expect(marker).toHaveAttribute('data-provenance', 'local-css')
  })

  it('does not render a route image or media URL', () => {
    const { container } = render(<SceneBridge from="hero" to="menu" />)

    expect(container.querySelector('img, picture, [src], [srcset]')).toBeNull()
  })

  it('removes bridge animation and transitions for reduced-motion visitors', () => {
    expect(bridgeCss).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.scene-bridge,[\s\S]*\.scene-bridge\s+\*[\s\S]*animation:\s*none\s*!important;[\s\S]*transition:\s*none\s*!important;/,
    )
  })
})
