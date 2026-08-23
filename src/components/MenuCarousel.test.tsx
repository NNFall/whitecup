import { fireEvent, render, screen, within } from '@testing-library/react'

import { MenuCarousel } from './MenuCarousel'
import { siteData } from '../data/site'

describe('MenuCarousel', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    })
  })

  it('exposes a labelled carousel with every item and a safe price fallback', () => {
    render(<MenuCarousel items={siteData.menuItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    expect(region).toBeInTheDocument()
    expect(within(region).getAllByRole('listitem')).toHaveLength(siteData.menuItems.length)
    expect(within(region).getByRole('heading', { name: 'Капучино' })).toBeInTheDocument()
    expect(within(region).getByText('270–320 ₽')).toBeInTheDocument()
    expect(within(region).getAllByText(/актуальная цена — в меню/i)).toHaveLength(siteData.menuItems.length - 1)
  })

  it('changes the active dot with keyboard arrows and can reach the final card', () => {
    render(<MenuCarousel items={siteData.menuItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    const viewport = within(region).getByTestId('menu-carousel-viewport')
    const dots = within(region).getAllByRole('button', { name: /перейти к/i })
    const next = within(region).getByRole('button', { name: /следующая позиция/i })

    expect(dots[0]).toHaveAttribute('aria-current', 'true')
    fireEvent.keyDown(viewport, { key: 'ArrowRight' })
    expect(dots[1]).toHaveAttribute('aria-current', 'true')

    for (let index = 1; index < siteData.menuItems.length; index += 1) {
      fireEvent.click(next)
    }

    expect(dots.at(-1)).toHaveAttribute('aria-current', 'true')
    expect(next).toBeDisabled()
  })

  it('supports previous/next controls and keeps every control keyboard reachable', () => {
    render(<MenuCarousel items={siteData.menuItems} />)

    const region = screen.getByRole('region', { name: /избранное меню white cup/i })
    const previous = within(region).getByRole('button', { name: /предыдущая позиция/i })
    const next = within(region).getByRole('button', { name: /следующая позиция/i })

    expect(previous).toHaveClass('menu-carousel__control')
    expect(next).toHaveClass('menu-carousel__control')
    expect(previous).toHaveAttribute('data-touch-target', '44')
    expect(next).toHaveAttribute('data-touch-target', '44')
    expect(previous).toBeDisabled()

    fireEvent.click(next)
    expect(previous).not.toBeDisabled()
    fireEvent.click(previous)
    expect(previous).toBeDisabled()
  })
})
