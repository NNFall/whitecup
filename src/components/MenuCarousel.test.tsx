import { act, fireEvent, render, screen, within } from '@testing-library/react'

import { MenuCarousel } from './MenuCarousel'
import { siteData } from '../data/site'

const legacyFiveItems = siteData.menuItems.slice(0, 5)

describe('MenuCarousel', () => {
  it('exposes a labelled carousel with every item and a safe price fallback', () => {
    render(<MenuCarousel items={siteData.menuItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    expect(region).toBeInTheDocument()
    const cards = within(region).getAllByRole('listitem')
    expect(cards).toHaveLength(siteData.menuItems.length)
    expect(
      cards.map((card) => within(card).getByRole('heading').textContent),
    ).toEqual(siteData.menuItems.map((item) => item.name))

    const decorativePhotos = region.querySelectorAll<HTMLImageElement>(
      '[data-menu-copy="middle"] img[data-scene-card-image]',
    )
    expect(decorativePhotos).toHaveLength(siteData.menuItems.length)
    decorativePhotos.forEach((photo) => {
      expect(photo).toHaveAttribute('alt', '')
      expect(photo).toHaveAttribute('aria-hidden', 'true')
      expect(photo.getAttribute('src')).toMatch(/^\/media\/menu-.+-768\.webp$/)
      expect(photo.getAttribute('srcset')?.split(',')).toHaveLength(2)
    })

    expect(within(cards[0]).getByText('270–320 ₽')).toBeInTheDocument()
    expect(region.querySelectorAll('[data-menu-copy="middle"] .menu-card__facts'))
      .toHaveLength(siteData.menuItems.length)
    expect(
      [...region.querySelectorAll('[data-menu-copy="middle"] .menu-card__facts')]
        .filter((facts) => /актуальная цена — в меню/i.test(facts.textContent ?? '')),
    ).toHaveLength(siteData.menuItems.length - 1)
  })

  it('uses the viewport native scroll offset for the next card', () => {
    render(<MenuCarousel items={legacyFiveItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    const viewport = within(region).getByTestId('menu-carousel-viewport')
    const cards = within(region).getAllByRole('listitem')
    const next = within(region).getByRole('button', { name: /следующая позиция/i })
    const scrollTo = vi.fn()

    Object.defineProperties(viewport, {
      clientWidth: { configurable: true, value: 960 },
      offsetLeft: { configurable: true, value: 0 },
      scrollTo: { configurable: true, value: scrollTo },
    })
    Object.defineProperty(cards[1], 'offsetLeft', { configurable: true, value: 640 })

    fireEvent.click(next)

    expect(scrollTo).toHaveBeenCalledWith({ left: 640, behavior: 'smooth' })
  })

  it('moves a finite rendered viewport when the next control is clicked', () => {
    render(<MenuCarousel items={legacyFiveItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    const viewport = within(region).getByTestId('menu-carousel-viewport')
    const cards = within(region).getAllByRole('listitem')
    const dots = within(region).getAllByRole('button', { name: /перейти к/i })
    const next = within(region).getByRole('button', { name: /следующая позиция/i })
    const viewportOffset = 128
    const cardOffsets = [128, 582.4, 1036.8, 1491.2, 1945.6]
    const scrollTo = vi.fn(({ left }: ScrollToOptions) => {
      // Model the browser's native scrollTo side effect rather than asserting
      // only that a method was invoked.
      viewport.scrollLeft = left ?? 0
    })

    Object.defineProperties(viewport, {
      clientWidth: { configurable: true, value: 1664 },
      scrollWidth: { configurable: true, value: 3482 },
      offsetLeft: { configurable: true, value: viewportOffset },
      scrollLeft: { configurable: true, writable: true, value: 0 },
      scrollTo: { configurable: true, value: scrollTo },
    })
    cards.forEach((card, index) => {
      Object.defineProperty(card, 'offsetLeft', {
        configurable: true,
        value: cardOffsets[index],
      })
    })

    fireEvent.click(next)
    fireEvent.scroll(viewport)
    fireEvent(viewport, new Event('scrollend'))

    expect(scrollTo).toHaveBeenCalledWith({ left: 454.4, behavior: 'smooth' })
    expect(viewport.scrollLeft).toBeCloseTo(454.4, 5)
    expect(viewport.scrollLeft).toBeGreaterThan(0)
    expect(dots[1]).toHaveAttribute('aria-current', 'true')
  })

  it('keeps a later card at its exact offset when the current native range is too short', () => {
    render(<MenuCarousel items={legacyFiveItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    const viewport = within(region).getByTestId('menu-carousel-viewport')
    const cards = within(region).getAllByRole('listitem')
    const dots = within(region).getAllByRole('button', { name: /перейти к/i })
    const scrollTo = vi.fn()

    Object.defineProperties(viewport, {
      clientWidth: { configurable: true, value: 960 },
      scrollWidth: { configurable: true, value: 1700 },
      offsetLeft: { configurable: true, value: 0 },
      scrollTo: { configurable: true, value: scrollTo },
    })
    cards.forEach((card, index) => {
      Object.defineProperty(card, 'offsetLeft', {
        configurable: true,
        value: [0, 640, 1280, 1920, 2560][index],
      })
    })

    fireEvent.click(dots[2])

    expect(scrollTo).toHaveBeenCalledWith({ left: 1280, behavior: 'smooth' })
  })

  it('uses the exact final card offset when trailing native range is available', () => {
    render(<MenuCarousel items={legacyFiveItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    const viewport = within(region).getByTestId('menu-carousel-viewport')
    const cards = within(region).getAllByRole('listitem')
    const dots = within(region).getAllByRole('button', { name: /перейти к/i })
    const next = within(region).getByRole('button', { name: /следующая позиция/i })
    const scrollTo = vi.fn()
    const viewportWidth = 960
    const cardWidth = 480
    const trailingPadding = viewportWidth - cardWidth
    const cardOffsets = [0, 640, 1280, 1920, 2560]
    const lastCardOffset = cardOffsets.at(-1) as number
    const scrollWidth = lastCardOffset + cardWidth + trailingPadding

    // This is the physical range created by the CSS trailing padding: the
    // last card's exact offset must equal the viewport's native max scroll.
    expect(scrollWidth - viewportWidth).toBe(lastCardOffset)

    Object.defineProperties(viewport, {
      clientWidth: { configurable: true, value: viewportWidth },
      offsetLeft: { configurable: true, value: 0 },
      scrollWidth: { configurable: true, value: scrollWidth },
      scrollTo: { configurable: true, value: scrollTo },
    })
    cards.forEach((card, index) => {
      Object.defineProperty(card, 'offsetLeft', {
        configurable: true,
        value: cardOffsets[index],
      })
    })

    fireEvent.click(dots.at(-1) as HTMLButtonElement)

    expect(scrollTo).toHaveBeenCalledWith({ left: lastCardOffset, behavior: 'smooth' })
    expect(dots.at(-1)).toHaveAttribute('aria-current', 'true')
    expect(next).not.toBeDisabled()
  })

  it('syncs the active dot to the nearest card after native scrolling', () => {
    render(<MenuCarousel items={legacyFiveItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    const viewport = within(region).getByTestId('menu-carousel-viewport')
    const cards = within(region).getAllByRole('listitem')
    const dots = within(region).getAllByRole('button', { name: /перейти к/i })

    Object.defineProperties(viewport, {
      clientWidth: { configurable: true, value: 960 },
      offsetLeft: { configurable: true, value: 0 },
      scrollWidth: { configurable: true, value: 3520 },
      scrollLeft: { configurable: true, writable: true, value: 640 },
    })
    cards.forEach((card, index) => {
      Object.defineProperty(card, 'offsetLeft', {
        configurable: true,
        value: [0, 640, 1296, 1952, 2608][index],
      })
    })

    fireEvent.scroll(viewport)
    expect(dots[1]).toHaveAttribute('aria-current', 'true')

    viewport.scrollLeft = 2560
    fireEvent.scroll(viewport)
    expect(dots.at(-1)).toHaveAttribute('aria-current', 'true')
  })

  it('uses instant native movement when reduced motion is preferred', () => {
    const originalMatchMedia = window.matchMedia
    const matchMedia = vi.fn().mockReturnValue({ matches: true })
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: matchMedia,
    })

    try {
      render(<MenuCarousel items={legacyFiveItems} />)

      const region = screen.getByRole('region', { name: /избранное меню white cup/i })
      const viewport = within(region).getByTestId('menu-carousel-viewport')
      const cards = within(region).getAllByRole('listitem')
      const next = within(region).getByRole('button', { name: /следующая позиция/i })
      const scrollTo = vi.fn()

      Object.defineProperties(viewport, {
        offsetLeft: { configurable: true, value: 0 },
        scrollTo: { configurable: true, value: scrollTo },
      })
      Object.defineProperty(cards[1], 'offsetLeft', { configurable: true, value: 640 })

      fireEvent.click(next)

      expect(scrollTo).toHaveBeenCalledWith({ left: 640, behavior: 'auto' })
    } finally {
      if (originalMatchMedia) {
        Object.defineProperty(window, 'matchMedia', {
          configurable: true,
          value: originalMatchMedia,
        })
      } else {
        Reflect.deleteProperty(window, 'matchMedia')
      }
    }
  })

  it('keeps a non-adjacent dot active through intermediate native scroll events until scrollend', () => {
    render(<MenuCarousel items={legacyFiveItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    const viewport = within(region).getByTestId('menu-carousel-viewport')
    const cards = within(region).getAllByRole('listitem')
    const dots = within(region).getAllByRole('button', { name: /перейти к/i })
    const scrollTo = vi.fn()
    const cardOffsets = [0, 640, 1280, 1920, 2560]

    Object.defineProperties(viewport, {
      clientWidth: { configurable: true, value: 960 },
      scrollWidth: { configurable: true, value: 3520 },
      offsetLeft: { configurable: true, value: 0 },
      scrollLeft: { configurable: true, writable: true, value: 0 },
      scrollTo: { configurable: true, value: scrollTo },
    })
    cards.forEach((card, index) => {
      Object.defineProperty(card, 'offsetLeft', {
        configurable: true,
        value: cardOffsets[index],
      })
    })

    fireEvent.click(dots.at(-1) as HTMLButtonElement)
    expect(dots.at(-1)).toHaveAttribute('aria-current', 'true')

    // A smooth native jump emits intermediate scroll positions. They must not
    // make the requested final dot flicker before the scroll settles.
    viewport.scrollLeft = 96
    fireEvent.scroll(viewport)
    expect(dots.at(-1)).toHaveAttribute('aria-current', 'true')

    viewport.scrollLeft = 2560
    fireEvent(viewport, new Event('scrollend'))
    expect(dots.at(-1)).toHaveAttribute('aria-current', 'true')
    expect(scrollTo).toHaveBeenCalledWith({ left: 2560, behavior: 'smooth' })
  })

  it('cancels a pending programmatic target when native pointer scrolling begins', () => {
    render(<MenuCarousel items={legacyFiveItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    const viewport = within(region).getByTestId('menu-carousel-viewport')
    const cards = within(region).getAllByRole('listitem')
    const dots = within(region).getAllByRole('button', { name: /перейти к/i })

    Object.defineProperties(viewport, {
      clientWidth: { configurable: true, value: 960 },
      scrollWidth: { configurable: true, value: 3520 },
      offsetLeft: { configurable: true, value: 0 },
      scrollLeft: { configurable: true, writable: true, value: 0 },
    })
    cards.forEach((card, index) => {
      Object.defineProperty(card, 'offsetLeft', {
        configurable: true,
        value: [0, 640, 1280, 1920, 2560][index],
      })
    })

    fireEvent.click(dots.at(-1) as HTMLButtonElement)
    fireEvent.pointerDown(viewport)
    viewport.scrollLeft = 640
    fireEvent.scroll(viewport)
    expect(dots[1]).toHaveAttribute('aria-current', 'true')

    // A later scrollend from the cancelled request must not restore the old
    // programmatic final-dot target.
    fireEvent(viewport, new Event('scrollend'))
    expect(dots[1]).toHaveAttribute('aria-current', 'true')
  })

  it('reconciles a stalled programmatic target through the scrollend fallback timer', () => {
    vi.useFakeTimers()

    try {
      render(<MenuCarousel items={legacyFiveItems} />)

      const region = screen.getByRole('region', { name: /избранное меню white cup/i })
      const viewport = within(region).getByTestId('menu-carousel-viewport')
      const cards = within(region).getAllByRole('listitem')
      const dots = within(region).getAllByRole('button', { name: /перейти к/i })
      const scrollTo = vi.fn()

      Object.defineProperties(viewport, {
        clientWidth: { configurable: true, value: 960 },
        scrollWidth: { configurable: true, value: 3520 },
        offsetLeft: { configurable: true, value: 0 },
        scrollLeft: { configurable: true, writable: true, value: 0 },
        scrollTo: { configurable: true, value: scrollTo },
      })
      cards.forEach((card, index) => {
        Object.defineProperty(card, 'offsetLeft', {
          configurable: true,
          value: [0, 640, 1280, 1920, 2560][index],
        })
      })

      fireEvent.click(dots[1])
      expect(dots[1]).toHaveAttribute('aria-current', 'true')

      // Simulate a browser that did not complete the requested native move.
      viewport.scrollLeft = 0
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(dots[0]).toHaveAttribute('aria-current', 'true')
    } finally {
      vi.useRealTimers()
    }
  })

  it('reconciles the active dot when ResizeObserver reports viewport geometry changes', () => {
    const originalResizeObserver = globalThis.ResizeObserver
    let resizeCallback: ResizeObserverCallback | undefined
    const observe = vi.fn()
    const disconnect = vi.fn()

    class MockResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback
      }

      observe = observe
      disconnect = disconnect
    }

    Object.defineProperty(globalThis, 'ResizeObserver', {
      configurable: true,
      value: MockResizeObserver,
    })

    try {
      const { unmount } = render(<MenuCarousel items={legacyFiveItems} />)

      const region = screen.getByRole('region', { name: /избранное меню white cup/i })
      const viewport = within(region).getByTestId('menu-carousel-viewport')
      const cards = within(region).getAllByRole('listitem')
      const dots = within(region).getAllByRole('button', { name: /перейти к/i })

      Object.defineProperties(viewport, {
        clientWidth: { configurable: true, value: 960 },
        scrollWidth: { configurable: true, value: 3520 },
        offsetLeft: { configurable: true, value: 0 },
        scrollLeft: { configurable: true, writable: true, value: 640 },
      })
      cards.forEach((card, index) => {
        Object.defineProperty(card, 'offsetLeft', {
          configurable: true,
          value: [0, 640, 1280, 1920, 2560][index],
        })
      })

      expect(observe).toHaveBeenCalledWith(viewport)
      viewport.scrollLeft = 1280
      act(() => {
        resizeCallback?.([] as ResizeObserverEntry[], {} as ResizeObserver)
      })
      expect(dots[2]).toHaveAttribute('aria-current', 'true')

      unmount()
      expect(disconnect).toHaveBeenCalled()
    } finally {
      if (originalResizeObserver) {
        Object.defineProperty(globalThis, 'ResizeObserver', {
          configurable: true,
          value: originalResizeObserver,
        })
      } else {
        Reflect.deleteProperty(globalThis, 'ResizeObserver')
      }
    }
  })

  it('changes the active dot with keyboard arrows and can reach the final card', () => {
    render(<MenuCarousel items={legacyFiveItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    const viewport = within(region).getByTestId('menu-carousel-viewport')
    const dots = within(region).getAllByRole('button', { name: /перейти к/i })
    const next = within(region).getByRole('button', { name: /следующая позиция/i })

    expect(dots[0]).toHaveAttribute('aria-current', 'true')
    fireEvent.keyDown(viewport, { key: 'ArrowRight' })
    expect(dots[1]).toHaveAttribute('aria-current', 'true')

    for (let index = 1; index < legacyFiveItems.length - 1; index += 1) {
      fireEvent.click(next)
    }

    expect(dots.at(-1)).toHaveAttribute('aria-current', 'true')
    expect(next).not.toBeDisabled()
  })

  it('supports previous/next controls and keeps every control keyboard reachable', () => {
    render(<MenuCarousel items={legacyFiveItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    const previous = within(region).getByRole('button', { name: /предыдущая позиция/i })
    const next = within(region).getByRole('button', { name: /следующая позиция/i })

    expect(previous).toHaveClass('menu-carousel__control')
    expect(next).toHaveClass('menu-carousel__control')
    expect(previous).toHaveAttribute('data-touch-target', '44')
    expect(next).toHaveAttribute('data-touch-target', '44')
    expect(previous).not.toBeDisabled()

    fireEvent.click(next)
    expect(previous).not.toBeDisabled()
    fireEvent.click(previous)
    expect(previous).not.toBeDisabled()
  })

  it('keeps the final item active at the real desktop maximum scroll boundary', () => {
    render(<MenuCarousel items={legacyFiveItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    const viewport = within(region).getByTestId('menu-carousel-viewport')
    const cards = within(region).getAllByRole('listitem')
    const dots = within(region).getAllByRole('button', { name: /перейти к/i })
    const next = within(region).getByRole('button', { name: /следующая позиция/i })

    Object.defineProperties(viewport, {
      clientWidth: { configurable: true, value: 960 },
      scrollWidth: { configurable: true, value: 3520 },
      scrollLeft: { configurable: true, writable: true, value: 2560 },
    })
    cards.forEach((card, index) => {
      Object.defineProperty(card, 'offsetLeft', {
        configurable: true,
        value: [0, 640, 1280, 1920, 2560][index],
      })
    })

    fireEvent.wheel(viewport)
    fireEvent.scroll(viewport)

    expect(dots.at(-1)).toHaveAttribute('aria-current', 'true')
    expect(next).not.toBeDisabled()

    fireEvent.click(dots.at(-1) as HTMLButtonElement)
    fireEvent.scroll(viewport)

    expect(dots.at(-1)).toHaveAttribute('aria-current', 'true')
    expect(next).not.toBeDisabled()
  })
})
