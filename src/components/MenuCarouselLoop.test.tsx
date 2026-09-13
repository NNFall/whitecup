import { render, screen, within } from '@testing-library/react'

import { siteData } from '../data/site'
import { MenuCarousel } from './MenuCarousel'

describe('MenuCarousel native rail', () => {
  it('keeps every source item in one accessible scroll-snap track', () => {
    render(<MenuCarousel items={siteData.menuItems} />)

    const region = screen.getByRole('region', { name: 'Меню White Cup' })
    const viewport = within(region).getByTestId('menu-carousel-viewport')
    const track = within(viewport).getByRole('list', { name: 'Позиции меню' })

    expect(track.children).toHaveLength(siteData.menuItems.length)
    expect(track.querySelectorAll('[data-menu-clone="true"]')).toHaveLength(0)
    expect(track.querySelectorAll('[data-menu-copy]')).toHaveLength(0)
    expect(viewport).toHaveAttribute('tabindex', '0')
    expect(within(region).getByRole('group', { name: 'Навигация по меню' })).toBeInTheDocument()
  })
})
