import { render, screen, within } from '@testing-library/react'

import sceneLayoutCss from '../styles/scene-layout-polish.css?raw'
import eventsSource from './EventsSection.tsx?raw'
import locationsSource from './LocationsSection.tsx?raw'
import { EventsSection } from './EventsSection'
import { LocationsSection } from './LocationsSection'

describe('Events and Locations independent scene layouts', () => {
  it('builds Events from semantic content, documentary photo, and independent decorative layers', () => {
    render(<EventsSection />)

    const scene = screen.getByRole('region', {
      name: /завтраки, встречи и тёплые события/i,
    })

    expect(scene).toHaveAttribute('data-scene-layout', 'independent')
    expect(scene.querySelector('[data-scene-paper]')).toHaveAttribute('aria-hidden', 'true')

    for (const layer of ['title', 'copy', 'photo', 'doodles', 'props', 'cards']) {
      expect(scene.querySelector(`[data-scene-layer="${layer}"]`)).toBeInTheDocument()
    }

    const documentaryPhoto = within(scene).getByRole('img', {
      name: /зал white cup с креслами, столами и посетительницей у окна/i,
    })
    expect(documentaryPhoto.closest('[data-media-kind="documentary"]')).toBeInTheDocument()
    expect(documentaryPhoto).toHaveAttribute('src', '/media/interior-03.webp')

    scene.querySelectorAll('[data-scene-layer="doodles"] img, [data-scene-layer="props"] img')
      .forEach((image) => {
        expect(image).toHaveAttribute('alt', '')
        expect(image).toHaveAttribute('aria-hidden', 'true')
      })

    expect(scene.querySelector('.events-scene__backdrop')).not.toBeInTheDocument()
  })

  it('builds Locations from independent map, documentary photo, cards, and actions', () => {
    render(<LocationsSection />)

    const scene = screen.getByRole('region', { name: /как нас найти/i })

    expect(scene).toHaveAttribute('data-scene-layout', 'independent')
    expect(scene.querySelector('[data-scene-paper]')).toHaveAttribute('aria-hidden', 'true')

    for (const layer of ['title', 'copy', 'map', 'photo', 'doodles', 'cards']) {
      expect(scene.querySelector(`[data-scene-layer="${layer}"]`)).toBeInTheDocument()
    }

    const documentaryPhoto = within(scene).getByRole('img', {
      name: /зал white cup с красным потолком, картой на потолке и креслами/i,
    })
    expect(documentaryPhoto.closest('[data-media-kind="documentary"]')).toBeInTheDocument()
    expect(documentaryPhoto).toHaveAttribute('src', '/media/interior-02.webp')

    const map = scene.querySelector('[data-scene-layer="map"]')
    expect(map?.querySelector('[data-decorative-map="true"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    )

    const cards = within(scene).getAllByRole('article')
    expect(cards).toHaveLength(2)
    cards.forEach((card) => {
      const actions = card.querySelector('[data-scene-layer="actions"]')
      expect(actions).toBeInTheDocument()
      expect(within(actions as HTMLElement).getByRole('link', { name: /построить маршрут/i }))
        .toHaveAttribute('href', expect.stringContaining('yandex.ru'))
      expect(within(actions as HTMLElement).getByRole('link', { name: /связаться/i }))
        .toHaveAttribute('href', 'tel:+79372355715')
    })

    expect(scene.querySelector('.locations-scene__interior')).not.toBeInTheDocument()
  })

  it('does not render a monolithic scene image as either section backdrop', () => {
    expect(eventsSource).not.toContain('eventsSceneLayerManifest.backdrop')
    expect(eventsSource).not.toContain('events-scene__backdrop')
    expect(locationsSource).not.toContain('locationsSceneLayerManifest.interior')
    expect(locationsSource).not.toContain('locations-scene__interior')
  })

  it('uses named grids and short-viewport/mobile flow instead of absolute content overlap', () => {
    expect(sceneLayoutCss).toMatch(
      /\.scene\.events-scene\[data-scene-layout='independent'\][\s\S]*display:\s*grid;[\s\S]*grid-template-areas:/,
    )
    expect(sceneLayoutCss).toMatch(
      /\.scene\.locations-scene\[data-scene-layout='independent'\][\s\S]*display:\s*grid;[\s\S]*grid-template-areas:/,
    )
    expect(sceneLayoutCss).toMatch(
      /@media \(min-width:\s*1024px\) and \(max-height:\s*760px\)[\s\S]*min-height:\s*48rem;/,
    )
    expect(sceneLayoutCss).toMatch(
      /@media \(max-width:\s*1023px\)[\s\S]*grid-template-areas:[\s\S]*'title'[\s\S]*'copy'[\s\S]*'photo'/,
    )
    expect(sceneLayoutCss).toMatch(/@media \(max-width:\s*400px\)/)
    expect(sceneLayoutCss).toMatch(/@media \(max-width:\s*340px\)/)
    expect(sceneLayoutCss).not.toMatch(
      /(?:section-frame__heading|scene__intro|scene__cards|location-card__actions)[^{]*\{[^}]*position:\s*absolute;/,
    )
  })

  it('keeps the Events card runway intrinsic on short desktop viewports', () => {
    const shortDesktopGuard = sceneLayoutCss.match(
      /@media \(min-width:\s*1024px\) and \(max-height:\s*760px\)[\s\S]*?(?=\/\* Tablet and mobile)/,
    )?.[0]

    expect(shortDesktopGuard).toBeDefined()
    expect(shortDesktopGuard).toMatch(
      /\.scene\.events-scene\[data-scene-layout='independent'\] \.section-frame__inner[\s\S]*grid-template-rows:\s*auto auto auto;/,
    )
    expect(shortDesktopGuard).toMatch(/align-content:\s*start;/)
    expect(shortDesktopGuard).toMatch(
      /\.scene\.events-scene\[data-scene-layout='independent'\] \.events-scene__cards[\s\S]*align-self:\s*start;/,
    )
    expect(shortDesktopGuard).toMatch(
      /\.scene\.locations-scene\[data-scene-layout='independent'\] \.section-frame__inner[\s\S]*grid-template-rows:\s*auto auto auto;/,
    )
    expect(shortDesktopGuard).toMatch(
      /\.scene\.locations-scene\[data-scene-layout='independent'\] \.locations-scene__cards[\s\S]*align-self:\s*start;/,
    )
  })
})
