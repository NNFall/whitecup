import { render, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from '../App'
import liveTypographyCss from '../styles/live-typography.css?raw'

const sceneContracts = [
  { id: 'hero', level: 1, title: /завтраки, кофе и свой вайб в white cup/i },
  { id: 'menu', level: 2, title: /завтраки, ради которых хочется заглянуть/i },
  { id: 'about', level: 2, title: /о white cup — место, в которое хочется возвращаться/i },
  { id: 'visit', level: 2, title: /у нас есть место для вашего ритма/i },
  { id: 'events', level: 2, title: /завтраки, встречи и тёплые события/i },
  { id: 'locations', level: 2, title: /как нас найти/i },
] as const

function readBlock(source: string, start: number) {
  const open = source.indexOf('{', start)
  if (open < 0) throw new Error(`Missing opening brace after offset ${start}`)

  let depth = 0
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1
    if (source[index] === '}') {
      depth -= 1
      if (depth === 0) return source.slice(start, index + 1)
    }
  }

  throw new Error(`Unclosed CSS block at offset ${start}`)
}

function desktopTypographyBlock() {
  const start = liveTypographyCss.indexOf('@media (min-width: 1024px)')
  if (start < 0) throw new Error('Missing desktop typography media block')
  return readBlock(liveTypographyCss, start)
}

function declarationsFor(selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const rulePattern = new RegExp(`${escapedSelector}\\s*\\{([^{}]*)\\}`, 'g')
  const desktopMatches = [...desktopTypographyBlock().matchAll(rulePattern)]
  const desktopStart = liveTypographyCss.indexOf('@media (min-width: 1024px)')
  const baseMatches = [...liveTypographyCss.slice(0, desktopStart).matchAll(rulePattern)]
  const match =
    [...desktopMatches].reverse().find((candidate) => /font-size:\s*clamp\(/.test(candidate[1])) ??
    [...baseMatches].reverse().find((candidate) => /font-size:\s*clamp\(/.test(candidate[1]))
  if (!match) throw new Error(`Missing desktop typography rule for ${selector}`)
  return match[1]
}

function maxClampRem(selector: string) {
  const declarations = declarationsFor(selector)
  const match = declarations.match(/font-size:\s*clamp\([^,]+,[^,]+,\s*([\d.]+)rem\)/)
  if (!match) throw new Error(`Missing clamp font-size for ${selector}`)
  return Number(match[1])
}

describe('reference-fit live heading rebuild contract', () => {
  it('keeps exactly one accessible semantic heading in every story scene', () => {
    const { container } = render(<App />)

    for (const { id, level, title } of sceneContracts) {
      const scene = container.querySelector(`#${id}`)
      expect(scene).toBeInTheDocument()

      const headings = within(scene as HTMLElement).getAllByRole('heading', { level })
      expect(headings).toHaveLength(1)
      expect(headings[0]).toBeVisible()
      expect(headings[0]).toHaveTextContent(title)
      expect(headings[0]).not.toHaveAttribute('aria-hidden', 'true')
      expect(headings[0].querySelector('img, picture, canvas')).not.toBeInTheDocument()
    }
  })

  it('keeps the hero title assembled from explicit live lines and a selectable brand accent', () => {
    const { container } = render(<App />)
    const heading = within(container.querySelector('#hero') as HTMLElement).getByRole('heading', {
      level: 1,
    })
    const lines = heading.querySelectorAll('.hero-scene__title-line')

    expect(lines).toHaveLength(3)
    expect(lines[0]).toHaveClass('hero-scene__title-line--first')
    expect(lines[1]).toHaveClass('hero-scene__title-line--second')
    expect(lines[2]).toHaveClass('hero-scene__title-line--third')
    expect(lines[0]).toHaveTextContent('Завтраки,')
    expect(lines[1]).toHaveTextContent('кофе и свой')
    expect(lines[2]).toHaveTextContent('вайб в White Cup')

    const brand = heading.querySelector('.hero-scene__brand')
    expect(brand).toBeInstanceOf(HTMLElement)
    expect(brand).toHaveTextContent('White Cup')
    expect(brand).not.toHaveAttribute('aria-hidden', 'true')
    expect(brand?.querySelector('img, picture')).not.toBeInTheDocument()
  })

  it('keeps the menu initial and accent word as separate editable heading pieces', () => {
    const { container } = render(<App />)
    const heading = within(container.querySelector('#menu') as HTMLElement).getByRole('heading', {
      level: 2,
    })
    const lines = heading.querySelectorAll('.menu-scene__title-line')
    const initial = heading.querySelector('.menu-scene__title-initial')
    const accent = heading.querySelector('.menu-scene__word--look')

    expect(lines).toHaveLength(2)
    expect(lines[0]).toHaveClass('menu-scene__title-line--first')
    expect(lines[1]).toHaveClass('menu-scene__title-line--second')
    expect(lines[0]).toHaveTextContent('Завтраки, ради которых')
    expect(lines[1]).toHaveTextContent('хочется заглянуть')
    expect(initial).toHaveTextContent('З')
    expect(accent).toHaveTextContent('заглянуть')
    expect(accent).not.toHaveAttribute('aria-hidden', 'true')
  })

  it('keeps About, Visit, Events, and Locations accents as live text hooks', () => {
    const { container } = render(<App />)
    const phraseContracts = [
      ['#about', '.about-scene__title-line--brand', 'О White Cup —'],
      ['#about', '.about-scene__word--want', 'хочется'],
      ['#about', '.about-scene__word--return', 'возвращаться'],
      ['#visit', '.visit-scene__word--rhythm', 'ритма'],
      ['#events', '.events-scene__word--warm', 'и тёплые'],
      ['#events', '.events-scene__word--events', 'события'],
      ['#locations', '.locations-scene__word--find', 'найти'],
    ] as const

    for (const [sceneSelector, phraseSelector, text] of phraseContracts) {
      const phrase = container.querySelector(`${sceneSelector} ${phraseSelector}`)
      expect(phrase).toBeInstanceOf(HTMLElement)
      expect(phrase).toHaveTextContent(text)
      expect(phrase).not.toHaveAttribute('aria-hidden', 'true')
      expect(phrase?.querySelector('img, picture, canvas')).not.toBeInTheDocument()
    }
  })

  it('does not put reference title artwork or rasterized text into the runtime story', () => {
    const { container } = render(<App />)

    expect(container.querySelectorAll('[data-conditional-layer*="title-reference"]')).toHaveLength(0)
    expect(container.querySelectorAll('[class*="title-reference"]')).toHaveLength(0)
    expect(container.querySelectorAll('img[src*="title-reference"], img[src*="reference-title"]')).toHaveLength(0)
    expect(container.querySelectorAll('h1 img, h1 picture, h2 img, h2 picture')).toHaveLength(0)
  })

  it.each([
    ['.hero-scene h1', 7],
    ['.menu-scene .section-frame__heading h2', 6.25],
    ['.about-scene .section-frame__heading h2', 6],
    ['.visit-scene .section-frame__heading h2', 6],
    ['.events-scene .section-frame__heading h2', 5.9],
    ['.locations-scene .section-frame__heading h2', 6.2],
  ] as const)('raises %s to a reference-fit desktop scale without pixel-locking', (selector, minimumRem) => {
    expect(maxClampRem(selector)).toBeGreaterThanOrEqual(minimumRem)
  })

  it('makes desktop line breaks explicit instead of relying on incidental wrapping', () => {
    const desktopCss = desktopTypographyBlock()

    expect(desktopCss).toMatch(
      /\.hero-scene__title-line\s*\{[^}]*display:\s*(?:block|inline-block);[^}]*white-space:\s*nowrap;/s,
    )
    expect(desktopCss).toMatch(
      /\.menu-scene__title-line\s*\{[^}]*display:\s*(?:block|inline-block);[^}]*white-space:\s*nowrap;/s,
    )
  })
})
