import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { siteData } from '../data/site'
import { MenuCarousel } from './MenuCarousel'

const defineDesktopGeometry = (viewport: HTMLElement, cards: HTMLElement[]) => {
  Object.defineProperties(viewport, {
    clientWidth: { configurable: true, value: 2560 },
    scrollWidth: { configurable: true, value: 5120 },
    offsetLeft: { configurable: true, value: 0 },
    scrollLeft: { configurable: true, writable: true, value: 0 },
    scrollTo: {
      configurable: true,
      value: vi.fn(({ left }: ScrollToOptions) => {
        ;(viewport as HTMLElement).scrollLeft = left ?? 0
      }),
    },
  })

  cards.forEach((card, index) => {
    Object.defineProperty(card, 'offsetLeft', {
      configurable: true,
      value: index * 640,
    })
    Object.defineProperty(card, 'offsetParent', {
      configurable: true,
      value: viewport,
    })
  })
}

describe('MenuCarousel', () => {
  it('renders one finite track with decorative responsive artwork and no stale facts', () => {
    render(<MenuCarousel items={siteData.menuItems} />)

    const region = screen.getByRole('region', { name: 'Меню White Cup' })
    const cards = within(region).getAllByRole('listitem')

    expect(cards).toHaveLength(siteData.menuItems.length)
    expect(cards.map((card) => within(card).getByRole('heading').textContent)).toEqual(
      siteData.menuItems.map((item) => item.name),
    )
    expect(region.querySelectorAll('[data-menu-clone], [data-menu-copy]')).toHaveLength(0)
    expect(region.querySelectorAll('.menu-carousel__dot, .menu-card__facts')).toHaveLength(0)

    const photos = region.querySelectorAll<HTMLImageElement>('[data-scene-card-image]')
    expect(photos).toHaveLength(siteData.menuItems.length)
    photos.forEach((photo) => {
      expect(photo).toHaveAttribute('alt', '')
      expect(photo).toHaveAttribute('aria-hidden', 'true')
      expect(photo).toHaveAttribute('loading', 'lazy')
      expect(photo.getAttribute('src')).toMatch(/^\/media\/menu-.+-768\.webp$/)
      expect(photo.getAttribute('srcset')?.split(',')).toHaveLength(2)
    })
  })

  it('updates the count from native scroll and disables next at the final desktop page', () => {
    render(<MenuCarousel items={siteData.menuItems} />)

    const region = screen.getByRole('region', { name: 'Меню White Cup' })
    const viewport = within(region).getByTestId('menu-carousel-viewport')
    const cards = within(region).getAllByRole('listitem')
    const next = within(region).getByRole('button', { name: 'Следующая позиция меню' })
    const position = region.querySelector<HTMLElement>('.menu-carousel__position')
    expect(position).not.toBeNull()

    defineDesktopGeometry(viewport, cards)
    fireEvent(window, new Event('resize'))
    expect(next).not.toBeDisabled()

    for (let firstVisibleIndex = 1; firstVisibleIndex <= 4; firstVisibleIndex += 1) {
      fireEvent.click(next)
      viewport.scrollLeft = firstVisibleIndex * 640
      fireEvent.scroll(viewport)
    }

    expect(position).toHaveTextContent('05 / 08')
    expect(next).toBeDisabled()
    expect(within(region).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '5')
  })

  it('keeps keyboard navigation bounded and respects reduced motion', () => {
    const originalMatchMedia = window.matchMedia
    const matchMedia = vi.fn().mockReturnValue({ matches: true })
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: matchMedia })

    try {
      render(<MenuCarousel items={siteData.menuItems.slice(0, 3)} />)

      const region = screen.getByRole('region', { name: 'Меню White Cup' })
      const viewport = within(region).getByTestId('menu-carousel-viewport')
      const cards = within(region).getAllByRole('listitem')
      const next = within(region).getByRole('button', { name: 'Следующая позиция меню' })
      const previous = within(region).getByRole('button', { name: 'Предыдущая позиция меню' })
      const scrollTo = vi.fn()

      Object.defineProperties(viewport, {
        clientWidth: { configurable: true, value: 300 },
        scrollWidth: { configurable: true, value: 900 },
        offsetLeft: { configurable: true, value: 0 },
        scrollTo: { configurable: true, value: scrollTo },
      })
      cards.forEach((card, index) => {
        Object.defineProperty(card, 'offsetLeft', { configurable: true, value: index * 300 })
      })

      expect(previous).toBeDisabled()
      fireEvent.keyDown(viewport, { key: 'ArrowRight' })
      expect(region.querySelector('.menu-carousel__position')).toHaveTextContent('02 / 03')
      expect(scrollTo).toHaveBeenCalledWith({ left: 300, behavior: 'auto' })

      fireEvent.keyDown(viewport, { key: 'ArrowLeft' })
      expect(region.querySelector('.menu-carousel__position')).toHaveTextContent('01 / 03')
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, behavior: 'auto' })
    } finally {
      Object.defineProperty(window, 'matchMedia', { configurable: true, value: originalMatchMedia })
    }
  })

  it('renders a concise empty state when no menu items are available', () => {
    render(<MenuCarousel items={[]} />)

    expect(screen.getByText('Актуальное меню скоро появится.')).toBeInTheDocument()
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })
})
