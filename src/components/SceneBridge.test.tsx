import { render } from '@testing-library/react'

import { SceneBridge } from './SceneBridge'

describe('SceneBridge', () => {
  it('renders a scene pair as an inert decorative bridge', () => {
    const { container } = render(<SceneBridge from="hero" to="menu" />)

    const bridge = container.querySelector<HTMLElement>('[data-scene-bridge="hero-menu"]')

    expect(bridge).toHaveAttribute('aria-hidden', 'true')
    expect(bridge).toHaveAttribute('data-media-kind', 'decorative-generated')
    expect(bridge).toHaveClass('scene-bridge')
    expect(bridge).not.toHaveAttribute('tabindex')
    expect(bridge?.querySelector('h1, h2, h3, h4, h5, h6, [role="heading"]')).toBeNull()
    expect(bridge?.querySelector('a, button, input, select, textarea')).toBeNull()
  })

  it('renders the responsive generated route as an explicitly decorative image', () => {
    const { container } = render(<SceneBridge from="hero" to="menu" />)

    const route = container.querySelector<HTMLImageElement>('.scene-bridge__route')

    expect(route).toHaveAttribute('src', '/media/story-route-connector-1200.webp')
    expect(route).toHaveAttribute(
      'srcset',
      '/media/story-route-connector-720.webp 720w, /media/story-route-connector-1200.webp 1200w, /media/story-route-connector-2400.webp 2400w',
    )
    expect(route).toHaveAttribute('sizes', '(max-width: 1023px) 150vw, 75rem')
    expect(route).toHaveAttribute('alt', '')
    expect(route).toHaveAttribute('aria-hidden', 'true')
  })
})
