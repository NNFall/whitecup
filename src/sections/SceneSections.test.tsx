import { fireEvent, render, screen, within } from '@testing-library/react'

import App from '../App'
import { SceneLayer } from '../components/SceneLayer'

function LayeredHeroContractFixture() {
  return (
    <section aria-label="Layered hero contract">
      <SceneLayer
        layer="backdrop"
        mediaKind="decorative-reference-edit"
        src="/media/hero-clean-base-edit-poc.png"
      />
      <SceneLayer
        layer="foreground"
        mediaKind="decorative-reference-edit"
        src="/media/hero-bagel-cutout-poc.png"
      />
      <SceneLayer
        layer="foreground"
        mediaKind="decorative-reference-edit"
        src="/media/hero-coffee-cutout-poc.png"
      />
      <SceneLayer
        layer="decoration"
        mediaKind="decorative-reference-extract"
        src="/media/hero-doodles-exact.png"
      />
      <h1>Завтраки, кофе и свой вайб в White Cup</h1>
    </section>
  )
}

describe('White Cup story scenes', () => {
  it('keeps the complete six-scene story contract and a single main heading', () => {
    render(<App />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)

    for (const id of ['hero', 'menu', 'about', 'visit', 'events', 'locations']) {
      expect(document.getElementById(id)).toBeInTheDocument()
    }

    expect(screen.getByRole('group', { name: 'Основные действия' })).toBeInTheDocument()
  })

  it('defines the layered hero contract without mounting a supplied full-screen reference', () => {
    render(<LayeredHeroContractFixture />)

    const hero = screen.getByRole('region', { name: 'Layered hero contract' })
    expect(hero.querySelector('[data-layer="backdrop"]')).toHaveAttribute(
      'data-media-kind',
      'decorative-reference-edit',
    )
    expect(hero.querySelectorAll('[data-layer="foreground"]')).toHaveLength(2)
    expect(hero.querySelector('[src*="3679ac8b"]')).not.toBeInTheDocument()
    expect(hero.querySelector('[src*="ChatGPT Image"]')).not.toBeInTheDocument()
    expect(within(hero).getByRole('heading', { level: 1 })).toHaveTextContent('Завтраки')
  })

  it('matches the supplied first-screen hero contract', () => {
    render(<App />)

    const hero = screen.getByRole('region', { name: /завтраки, кофе и свой вайб/i })
    expect(hero.querySelector('.hero-reference-frame')).toBeInTheDocument()
    expect(within(hero).getByRole('heading', { level: 1 })).toHaveTextContent(
      'Завтраки, кофе и свой вайб в White Cup',
    )
    expect(within(hero).getByText('кофе')).toHaveClass('hero-scene__accent')
    expect(within(hero).getByRole('link', { name: /посмотреть меню/i })).toBeInTheDocument()
    expect(within(hero).getByRole('link', { name: /выбрать локацию/i })).toBeInTheDocument()
    expect(screen.getAllByRole('img', { name: /white cup/i }).some((image) => image.getAttribute('src') === '/media/hero-logo-reference.png')).toBe(true)

    const decorativeLayers = [
      ['.hero-cafe-backdrop', '/media/hero-reference-cafe-crop.png', 'decorative-reference'],
      ['.hero-doodle-layer', '/media/hero-doodles-exact.png', 'decorative-reference'],
      ['.hero-skyline-layer', '/media/hero-skyline-exact.png', 'decorative-reference'],
    ] as const

    decorativeLayers.forEach(([selector, src, mediaKind]) => {
      const layer = hero.querySelector(selector)
      expect(layer).toBeInTheDocument()
      expect(layer).toHaveAttribute('aria-hidden', 'true')
      expect(layer).toHaveAttribute('data-media-kind', mediaKind)
      expect(layer).toHaveAttribute('src', src)
    })

    expect(hero.querySelector('.hero-scene__documentary-fallback img')).not.toBeInTheDocument()

    expect(hero.querySelector('.hero-scene__heart')).toHaveAttribute('aria-hidden', 'true')
    expect(hero.querySelector('.hero-scene__pin')).toHaveAttribute('aria-hidden', 'true')
  })

  it('defers the documentary hero fallback until the reference crop fails', () => {
    render(<App />)

    const hero = screen.getByRole('region', { name: /завтраки, кофе и свой вайб/i })
    const backdrop = hero.querySelector<HTMLImageElement>('.hero-cafe-backdrop')
    expect(backdrop).toBeInTheDocument()
    expect(hero.querySelector('.hero-scene__documentary-fallback img')).not.toBeInTheDocument()
    expect(hero.querySelector('[src="/media/hero-food-cutout.png"]')).not.toBeInTheDocument()

    fireEvent.error(backdrop as HTMLImageElement)

    expect(hero.querySelector('.hero-scene__documentary-fallback')).toHaveAttribute('data-fallback-visible', 'true')
    expect(hero.querySelector('.hero-scene__documentary-fallback img')).toHaveAttribute('src', '/media/interior-01.webp')
  })

  it('uses verified contact, location and source links', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: /красноармейская, 15/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /куйбышева, 128\/1/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /\+7 \(937\) 235-57-15/i }).every((link) => link.getAttribute('href') === 'tel:+79372355715')).toBe(true)
    expect(screen.getAllByRole('link', { name: /маршрут|яндекс карт/i }).some((link) => link.getAttribute('href')?.includes('yandex.ru'))).toBe(true)
    expect(screen.getAllByRole('link', { name: /white cup.*vk/i }).every((link) => link.getAttribute('href') === 'https://vk.ru/white_cup')).toBe(true)
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
