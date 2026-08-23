import { render, screen, within } from '@testing-library/react'

import App from '../App'

describe('White Cup story scenes', () => {
  it('keeps the complete six-scene story contract and a single main heading', () => {
    render(<App />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)

    for (const id of ['hero', 'menu', 'about', 'visit', 'events', 'locations']) {
      expect(document.getElementById(id)).toBeInTheDocument()
    }

    expect(screen.getByRole('group', { name: 'Основные действия' })).toBeInTheDocument()
  })

  it('uses verified contact, location and source links', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: /красноармейская, 15/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /куйбышева, 128\/1/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /\+7 \(937\) 235-57-15/i })).toHaveAttribute('href', 'tel:+79372355715')
    expect(screen.getAllByRole('link', { name: /маршрут|яндекс карт/i }).some((link) => link.getAttribute('href')?.includes('yandex.ru'))).toBe(true)
    expect(screen.getByRole('link', { name: /white cup в vk/i })).toHaveAttribute('href', 'https://vk.ru/white_cup')
  })

  it('keeps documentary photo alternatives meaningful and doodles decorative', () => {
    render(<App />)

    const images = document.querySelectorAll('.organic-photo img')
    expect(images.length).toBeGreaterThanOrEqual(3)
    expect(Array.from(images).every((image) => (image.getAttribute('alt') ?? '').trim().length > 12)).toBe(true)

    const doodleContainers = document.querySelectorAll('[data-doodle]')
    expect(doodleContainers.length).toBeGreaterThan(0)
    doodleContainers.forEach((doodle) => expect(doodle).toHaveAttribute('aria-hidden', 'true'))
  })

  it('keeps the entrance clarification with both factual address variants', () => {
    render(<App />)

    const locations = screen.getByRole('region', { name: /адреса/i })
    expect(within(locations).getAllByText(/Красноармейская, 15/i).length).toBeGreaterThan(0)
    expect(within(locations).getByText(/Яндекс.*17|17.*Яндекс/i)).toBeInTheDocument()
  })
})
