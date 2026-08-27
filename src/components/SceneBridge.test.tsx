import { render } from '@testing-library/react'

import { SceneBridge } from './SceneBridge'

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
    expect(bridge).toHaveAttribute('data-bridge-layer', 'transition')
    expect(bridge).toHaveClass('scene-bridge')
    expect(bridge).not.toHaveAttribute('tabindex')
    expect(bridge?.querySelector('h1, h2, h3, h4, h5, h6, [role="heading"]')).toBeNull()
    expect(bridge?.querySelector('a, button, input, select, textarea')).toBeNull()
  })

  it('orders the paper wash beneath the generated route art', () => {
    const { container } = render(<SceneBridge from="menu" to="about" />)

    const bridge = container.querySelector<HTMLElement>('[data-scene-bridge="menu-about"]')
    const layers = Array.from(
      bridge?.querySelectorAll<HTMLElement>('[data-bridge-layer]') ?? [],
      (layer) => layer.dataset.bridgeLayer,
    )

    expect(layers).toEqual(['paper', 'route'])
    expect(bridge?.querySelector('[data-bridge-layer="paper"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })

  it.each(bridgePairs)('binds the %s-%s paper and route layers to their CSS hooks', (from, to) => {
    const { container } = render(<SceneBridge from={from} to={to} />)

    const bridge = container.querySelector<HTMLElement>(`[data-scene-bridge="${from}-${to}"]`)
    const paper = bridge?.querySelector<HTMLElement>('[data-bridge-layer="paper"]')
    const route = bridge?.querySelector<HTMLImageElement>('[data-bridge-layer="route"]')

    expect(paper).toHaveClass('scene-bridge__paper')
    expect(route).toHaveClass('scene-bridge__route')
    expect(paper?.parentElement).toBe(bridge)
    expect(route?.parentElement).toBe(bridge)
  })

  it('renders the responsive generated route as an explicitly decorative image', () => {
    const { container } = render(<SceneBridge from="hero" to="menu" />)

    const route = container.querySelector<HTMLImageElement>('.scene-bridge__route')

    expect(route).toHaveAttribute('src', '/media/story-route-connector-1200.webp')
    expect(route).toHaveAttribute(
      'srcset',
      '/media/story-route-connector-720.webp 720w, /media/story-route-connector-1200.webp 1200w, /media/story-route-connector-2400.webp 2400w',
    )
    expect(route).toHaveAttribute(
      'sizes',
      '(max-width: 433px) 155vw, (max-width: 1023px) 42rem, (max-width: 1304px) 92vw, 75rem',
    )
    expect(route).toHaveAttribute('alt', '')
    expect(route).toHaveAttribute('aria-hidden', 'true')
    expect(route).toHaveAttribute('data-bridge-layer', 'route')
  })

  it('loads the first connector eagerly without blocking image decoding', () => {
    const { container } = render(<SceneBridge from="hero" to="menu" />)

    const route = container.querySelector<HTMLImageElement>('.scene-bridge__route')

    expect(route).toHaveAttribute('loading', 'eager')
    expect(route).toHaveAttribute('decoding', 'async')
  })

  it.each(bridgePairs.slice(1))(
    'defers the below-fold %s-%s connector and decodes it asynchronously',
    (from, to) => {
      const { container } = render(<SceneBridge from={from} to={to} />)

      const route = container.querySelector<HTMLImageElement>('.scene-bridge__route')

      expect(route).toHaveAttribute('loading', 'lazy')
      expect(route).toHaveAttribute('decoding', 'async')
    },
  )
})
