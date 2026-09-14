import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MenuCarousel } from './MenuCarousel'
import { siteData } from '../data/site'

describe('MenuCarousel looping contract', () => {
  it('renders leading, middle, and trailing copies while exposing only the middle copy', () => {
    render(<MenuCarousel items={siteData.menuItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    const copies = [...region.querySelectorAll<HTMLElement>('[data-menu-copy]')]
    const copyNames = [...new Set(copies.map((copy) => copy.dataset.menuCopy))]

    expect(copyNames).toEqual(['leading', 'middle', 'trailing'])
    expect(copies).toHaveLength(siteData.menuItems.length * 3)

    const middle = region.querySelector<HTMLElement>('[data-menu-copy="middle"]')
    expect(middle).toBeInTheDocument()
    expect(middle).not.toHaveAttribute('aria-hidden', 'true')

    const clones = region.querySelectorAll<HTMLElement>('[data-menu-clone="true"]')
    expect(clones).toHaveLength(siteData.menuItems.length * 2)
    clones.forEach((clone) => {
      expect(clone).toHaveAttribute('aria-hidden', 'true')
      expect(clone).toHaveAttribute('tabindex', '-1')
    })
  })

  it('keeps the canonical cards accessible and preserves their image semantics', () => {
    render(<MenuCarousel items={siteData.menuItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    const cards = within(region).getAllByRole('listitem')

    expect(cards).toHaveLength(siteData.menuItems.length)
    cards.forEach((card, index) => {
      expect(card).toHaveAttribute('data-menu-copy', 'middle')
      expect(card).toHaveAttribute('aria-posinset', String(index + 1))
      expect(card).toHaveAttribute('aria-setsize', String(siteData.menuItems.length))
      expect(within(card).getByRole('heading')).toHaveTextContent(siteData.menuItems[index].name)
      const image = card.querySelector('img')
      expect(image).toHaveAttribute('alt', '')
      expect(image).toHaveAttribute('loading', 'lazy')
    })
  })

  it('wraps previous and next controls modulo the item count without disabling either edge', () => {
    render(<MenuCarousel items={siteData.menuItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    const previous = within(region).getByRole('button', { name: /предыдущая позиция/i })
    const next = within(region).getByRole('button', { name: /следующая позиция/i })
    const dots = within(region).getAllByRole('button', { name: /перейти к/i })

    expect(previous).not.toBeDisabled()
    expect(next).not.toBeDisabled()

    fireEvent.click(previous)
    expect(dots.at(-1)).toHaveAttribute('aria-current', 'true')

    fireEvent.click(next)
    expect(dots[0]).toHaveAttribute('aria-current', 'true')

    fireEvent.click(dots.at(-1) as HTMLButtonElement)
    fireEvent.click(next)
    expect(dots[0]).toHaveAttribute('aria-current', 'true')
  })

  it('wraps keyboard arrows in both directions', () => {
    render(<MenuCarousel items={siteData.menuItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    const viewport = within(region).getByTestId('menu-carousel-viewport')
    const dots = within(region).getAllByRole('button', { name: /перейти к/i })

    fireEvent.keyDown(viewport, { key: 'ArrowLeft' })
    expect(dots.at(-1)).toHaveAttribute('aria-current', 'true')

    fireEvent.keyDown(viewport, { key: 'ArrowRight' })
    expect(dots[0]).toHaveAttribute('aria-current', 'true')
  })

  it('lets vertical arrows remain page-navigation keys without changing the carousel index', () => {
    render(<MenuCarousel items={siteData.menuItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    const viewport = within(region).getByTestId('menu-carousel-viewport')
    const dots = within(region).getAllByRole('button', { name: /перейти к/i })

    for (const key of ['ArrowUp', 'ArrowDown']) {
      const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key })
      act(() => {
        viewport.dispatchEvent(event)
      })

      expect(event.defaultPrevented).toBe(false)
      expect(dots[0]).toHaveAttribute('aria-current', 'true')
    }
  })

  it('recenters an outer-copy snap into the middle copy after scrollend', () => {
    render(<MenuCarousel items={siteData.menuItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    const viewport = within(region).getByTestId('menu-carousel-viewport')
    const physicalCards = [...region.querySelectorAll<HTMLLIElement>('[data-menu-physical-index]')]
    const dots = within(region).getAllByRole('button', { name: /перейти к/i })
    const itemCount = siteData.menuItems.length
    const physicalCount = itemCount * 3

    Object.defineProperties(viewport, {
      clientWidth: { configurable: true, value: 200 },
      scrollWidth: { configurable: true, value: physicalCount * 100 + 200 },
      offsetLeft: { configurable: true, value: 0 },
      scrollLeft: { configurable: true, writable: true, value: itemCount * 100 },
    })
    physicalCards.forEach((card, index) => {
      Object.defineProperty(card, 'offsetLeft', {
        configurable: true,
        value: index * 100,
      })
    })

    // The previous item from canonical item 0 is the leading-copy last item.
    viewport.scrollLeft = (itemCount - 1) * 100
    fireEvent.scroll(viewport)
    expect(dots.at(-1)).toHaveAttribute('aria-current', 'true')

    fireEvent(viewport, new Event('scrollend'))
    expect(viewport.scrollLeft).toBe((itemCount * 2 - 1) * 100)
    expect(dots.at(-1)).toHaveAttribute('aria-current', 'true')

    // The next item from canonical item n-1 is the trailing-copy first item.
    fireEvent.click(dots.at(-1) as HTMLButtonElement)
    viewport.scrollLeft = (itemCount * 2 - 1) * 100
    fireEvent(viewport, new Event('scrollend'))
    fireEvent.click(within(region).getByRole('button', { name: /следующая позиция/i }))
    viewport.scrollLeft = itemCount * 2 * 100
    fireEvent(viewport, new Event('scrollend'))

    expect(viewport.scrollLeft).toBe(itemCount * 100)
    expect(dots[0]).toHaveAttribute('aria-current', 'true')
  })

  it('does not advance without an interaction timer', () => {
    vi.useFakeTimers()

    try {
      render(<MenuCarousel items={siteData.menuItems} />)

      const region = screen.getByRole('region', { name: /избранное меню white cup/i })
      const dots = within(region).getAllByRole('button', { name: /перейти к/i })

      act(() => {
        vi.advanceTimersByTime(10_000)
      })

      expect(dots[0]).toHaveAttribute('aria-current', 'true')
      dots.slice(1).forEach((button) => {
        expect(button).not.toHaveAttribute('aria-current', 'true')
      })
    } finally {
      vi.useRealTimers()
    }
  })

  it('uses instant movement when reduced motion is preferred', () => {
    const originalMatchMedia = window.matchMedia
    const matchMedia = vi.fn().mockReturnValue({ matches: true })
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: matchMedia,
    })

    try {
      render(<MenuCarousel items={siteData.menuItems} />)

      const region = screen.getByRole('region', { name: /избранное меню white cup/i })
      const viewport = within(region).getByTestId('menu-carousel-viewport')
      const middleCards = [...region.querySelectorAll<HTMLLIElement>('[data-menu-copy="middle"][data-menu-index]')]
      const scrollTo = vi.fn()

      Object.defineProperties(viewport, {
        offsetLeft: { configurable: true, value: 0 },
        scrollTo: { configurable: true, value: scrollTo },
      })
      Object.defineProperty(middleCards[1], 'offsetLeft', { configurable: true, value: 640 })

      fireEvent.click(within(region).getByRole('button', { name: /следующая позиция/i }))

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
})
