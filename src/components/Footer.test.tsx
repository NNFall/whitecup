import { render, screen, within } from '@testing-library/react'

import { siteData } from '../data/site'

import { Footer } from './Footer'

describe('Footer', () => {
  it('keeps the final CTA and contact links discoverable', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo', { name: /зайдём на кофе/i })

    expect(within(footer).getByRole('link', { name: /открыть меню/i })).toHaveAttribute('href', siteData.menuUrl)
    expect(within(footer).getByRole('link', { name: /как нас найти/i })).toHaveAttribute('href', '#locations')
    expect(within(footer).getByRole('link', { name: /\+7 \(937\) 235-57-15/i })).toHaveAttribute('href', siteData.phoneHref)
  })

  it('labels the public VK and Yandex source links', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')

    expect(within(footer).getByRole('link', { name: /группа white cup во vk/i })).toHaveAttribute('href', siteData.vkUrl)
    expect(within(footer).getByRole('link', { name: /white cup в яндекс картах/i })).toHaveAttribute('href', siteData.yandexCardUrl)
    expect(within(footer).getByText(/публичная галерея яндекс карт/i)).toBeInTheDocument()
  })
})
