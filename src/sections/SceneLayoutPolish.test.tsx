import { render, screen, within } from '@testing-library/react'

import sceneLayoutCss from '../styles/scene-layout-polish.css?raw'
import eventsSource from './EventsSection.tsx?raw'
import locationsSource from './LocationsSection.tsx?raw'
import { EventsSection } from './EventsSection'
import { LocationsSection } from './LocationsSection'

function extractCssAtRule(css: string, atRule: string) {
  const start = css.indexOf(atRule)
  if (start < 0) return ''

  const open = css.indexOf('{', start)
  if (open < 0) return ''

  let depth = 0
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === '{') depth += 1
    if (css[index] !== '}') continue

    depth -= 1
    if (depth === 0) return css.slice(start, index + 1)
  }

  return ''
}

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

  it('relaxes the independent grids and media bounds for narrow desktop widths', () => {
    const narrowDesktopGuard = sceneLayoutCss.match(
      /@media\s*\(min-width:\s*1024px\)\s*and\s*\(max-width:\s*1199px\)[\s\S]*$/,
    )?.[0]

    expect(narrowDesktopGuard).toBeTruthy()
    expect(narrowDesktopGuard).toMatch(
      /\.scene\.events-scene\[data-scene-layout='independent'\] \.section-frame__inner\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*0\.95fr\)\s+minmax\(0,\s*1\.05fr\);/,
    )
    expect(narrowDesktopGuard).toMatch(
      /\.scene\.locations-scene\[data-scene-layout='independent'\] \.section-frame__inner\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*0\.92fr\)\s+minmax\(0,\s*1\.08fr\);/,
    )
    expect(narrowDesktopGuard).toMatch(
      /\.scene\.events-scene\[data-scene-layout='independent'\] \.events-scene__(?:photo|props|documentary|doodles)[\s\S]*min-width:\s*0;[\s\S]*max-width:\s*100%;/,
    )
    expect(narrowDesktopGuard).toMatch(
      /\.scene\.locations-scene\[data-scene-layout='independent'\] \.locations-scene__(?:map-layer|photo|documentary|doodles)[\s\S]*min-width:\s*0;[\s\S]*max-width:\s*100%;/,
    )
  })

  it('keeps Menu and Events paper runways visible at low desktop heights', () => {
    const wideShortGuard = extractCssAtRule(
      sceneLayoutCss,
      '@media (min-width: 1600px) and (min-height: 681px) and (max-height: 800px)',
    )
    const compactShortGuard = extractCssAtRule(
      sceneLayoutCss,
      '@media (min-width: 1024px) and (max-width: 1599px) and (min-height: 681px) and (max-height: 800px)',
    )

    expect(wideShortGuard).toBeDefined()
    expect(wideShortGuard).toMatch(
      /\.scene\.menu-scene,\s*\.scene\.events-scene\[data-scene-layout='independent'\]\s*\{[^}]*height:\s*auto\s*!important;[^}]*min-height:\s*max\(100dvh,\s*66rem\);[^}]*max-height:\s*none\s*!important;[^}]*overflow-x:\s*clip\s*!important;[^}]*overflow-y:\s*visible\s*!important;/s,
    )
    expect(wideShortGuard).toMatch(
      /\.menu-scene \.section-frame__inner,\s*\.scene\.events-scene\[data-scene-layout='independent'\] \.section-frame__inner\s*\{[^}]*height:\s*auto\s*!important;[^}]*min-height:\s*max\(100dvh,\s*66rem\);/s,
    )

    expect(compactShortGuard).toBeDefined()
    expect(compactShortGuard).toMatch(
      /\.scene\.menu-scene,\s*\.scene\.events-scene\[data-scene-layout='independent'\]\s*\{[^}]*height:\s*auto\s*!important;[^}]*min-height:\s*max\(100dvh,\s*52rem\);[^}]*max-height:\s*none\s*!important;[^}]*overflow-x:\s*clip\s*!important;[^}]*overflow-y:\s*visible\s*!important;/s,
    )
    expect(compactShortGuard).toMatch(
      /\.menu-scene \.section-frame__inner,\s*\.scene\.events-scene\[data-scene-layout='independent'\] \.section-frame__inner\s*\{[^}]*height:\s*auto\s*!important;[^}]*min-height:\s*max\(100dvh,\s*52rem\);/s,
    )
  })
})
