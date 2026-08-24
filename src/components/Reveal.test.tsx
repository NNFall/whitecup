import { render, screen } from '@testing-library/react'

import { Reveal } from './Reveal'

describe('Reveal', () => {
  it('renders immediate children without a hidden state when reduced motion is preferred', () => {
    const matchMedia = vi.fn().mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: matchMedia,
    })

    render(
      <Reveal>
        <p>first child</p>
        <p>second child</p>
      </Reveal>,
    )

    expect(screen.getByText('first child')).toBeVisible()
    expect(screen.getByText('second child')).toBeVisible()
    expect(screen.getByTestId('reveal')).toHaveAttribute('data-reveal-state', 'visible')
    expect(screen.getByTestId('reveal')).toHaveAttribute('data-reveal-enhanced', 'true')
  })

  it('reveals immediately when IntersectionObserver is unavailable', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    })
    vi.stubGlobal('IntersectionObserver', undefined)

    render(
      <Reveal>
        <p>fallback content</p>
      </Reveal>,
    )

    expect(screen.getByTestId('reveal')).toHaveAttribute('data-reveal-state', 'visible')
    expect(screen.getByTestId('reveal')).toHaveAttribute('data-reveal-enhanced', 'true')
  })
})
