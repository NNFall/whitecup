import { render, screen, within } from '@testing-library/react'

import { siteData } from '../data/site'

import { Footer } from './Footer'

describe('Footer', () => {
  it('keeps one clear menu CTA and the final contact links discoverable', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo', { name: /зайдём на кофе/i })
    const menuLink = within(footer).getByRole('link', { name: /открыть меню/i })

    expect(menuLink).toHaveAttribute('href', siteData.menuUrl)
    expect(menuLink).toHaveAttribute('target', '_blank')
    expect(within(footer).getByRole('link', { name: /\+7 \(937\) 235-57-15/i })).toHaveAttribute(
      'href',
      siteData.phoneHref,
    )
    expect(within(footer).getByRole('link', { name: /white cup во vk/i })).toHaveAttribute(
      'href',
      siteData.vkUrl,
    )
  })

  it('retains real map and home links alongside the provenance note', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')

    expect(within(footer).getByRole('link', { name: /яндекс карты/i })).toHaveAttribute(
      'href',
      siteData.yandexCardUrl,
    )
    expect(within(footer).getByRole('link', { name: /адреса кофеен/i })).toHaveAttribute(
      'href',
      '#locations',
    )
    expect(within(footer).getByRole('link', { name: /white cup — на главную/i })).toHaveAttribute(
      'href',
      '#hero',
    )
    expect(within(footer).getByText('Фото кофейни — из публичной галереи Яндекс Карт.')).toBeInTheDocument()
    expect(within(footer).queryByRole('form')).not.toBeInTheDocument()
  })
})
