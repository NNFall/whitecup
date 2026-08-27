import { render, within } from '@testing-library/react'

import App from '../App'

const sceneHeadingContracts = [
  {
    id: 'hero',
    level: 1,
    name: 'Завтраки, кофе и свой вайб в White Cup',
  },
  {
    id: 'menu',
    level: 2,
    name: 'Завтраки, ради которых хочется заглянуть',
  },
  {
    id: 'about',
    level: 2,
    name: 'О White Cup — место, в которое хочется возвращаться',
  },
  {
    id: 'visit',
    level: 2,
    name: 'У нас есть место для вашего ритма',
  },
  {
    id: 'events',
    level: 2,
    name: 'Завтраки, встречи и тёплые события',
  },
  {
    id: 'locations',
    level: 2,
    name: 'Как нас найти',
  },
] as const

describe('live title runtime contract', () => {
  it('exposes one visible hero h1 and five visible scene h2 elements', () => {
    const { container } = render(<App />)
    const main = within(container).getByRole('main')
    const h1 = within(main).getAllByRole('heading', { level: 1 })
    const h2 = within(main).getAllByRole('heading', { level: 2 })

    expect(h1).toHaveLength(1)
    expect(h1[0]).toBeVisible()
    expect(h2).toHaveLength(5)
    h2.forEach((heading) => expect(heading).toBeVisible())
  })

  it('keeps exactly one accessible live heading in every story scene', () => {
    const { container } = render(<App />)

    for (const { id, level, name } of sceneHeadingContracts) {
      const scene = container.querySelector<HTMLElement>(`#${id}`)

      expect(scene).toBeInTheDocument()
      if (!scene) continue

      const headings = within(scene).getAllByRole('heading', { level })
      expect(headings).toHaveLength(1)
      expect(headings[0]).toBeVisible()
      expect(headings[0]).toHaveAccessibleName(name)
      expect(headings[0]).not.toHaveAttribute('aria-hidden', 'true')
      expect(headings[0].querySelector('img, picture, canvas')).not.toBeInTheDocument()
    }
  })

  it('does not mount any title-reference layer nodes in the story runtime', () => {
    const { container } = render(<App />)

    expect(container.querySelectorAll('[data-conditional-layer*="title-reference"]')).toHaveLength(0)
    expect(container.querySelectorAll('[class*="title-reference"]')).toHaveLength(0)
    expect(container.querySelectorAll('.section-frame__title-reference, .hero-scene__title-reference')).toHaveLength(0)
    expect(container.querySelectorAll('img[src*="title-reference"], img[src*="reference-title"]')).toHaveLength(0)
    expect(container.querySelectorAll('h1 img, h1 picture, h1 canvas, h2 img, h2 picture, h2 canvas')).toHaveLength(0)
  })

  it('keeps the late-scene accents as selectable text inside their semantic headings', () => {
    const { container } = render(<App />)
    const accentContracts = [
      ['#visit', '.visit-scene__accent', 'ритма'],
      ['#events', '.events-scene__accent', 'события'],
      ['#locations', '.locations-scene__title-accent', 'найти'],
    ] as const

    for (const [sceneSelector, accentSelector, text] of accentContracts) {
      const scene = container.querySelector(sceneSelector)
      const accent = scene?.querySelector(accentSelector)

      expect(accent).toBeInstanceOf(HTMLElement)
      expect(accent).toHaveTextContent(text)
      expect(accent).not.toHaveAttribute('aria-hidden', 'true')
      expect(accent?.querySelector('img, picture, canvas')).not.toBeInTheDocument()
    }
  })

  it('keeps every expressive phrase as selectable text inside the one semantic heading', () => {
    const { container } = render(<App />)

    const phraseContracts = [
      ['#hero', '.hero-scene__word--coffee', 'кофе'],
      ['#hero', '.hero-scene__word--own', 'и свой'],
      ['#hero', '.hero-scene__word--vibe', 'вайб в'],
      ['#hero', '.hero-scene__brand', 'White Cup'],
      ['#menu', '.menu-scene__title-initial', 'З'],
      ['#menu', '.menu-scene__word--look', 'заглянуть'],
      ['#about', '.about-scene__word--want', 'хочется'],
      ['#about', '.about-scene__word--return', 'возвращаться'],
      ['#visit', '.visit-scene__word--rhythm', 'ритма'],
      ['#events', '.events-scene__word--warm', 'и тёплые'],
      ['#events', '.events-scene__word--events', 'события'],
      ['#locations', '.locations-scene__word--find', 'найти'],
    ] as const

    for (const [sceneSelector, phraseSelector, text] of phraseContracts) {
      const scene = container.querySelector(sceneSelector)
      const phrase = scene?.querySelector(phraseSelector)

      expect(phrase).toBeInstanceOf(HTMLElement)
      expect(phrase).toHaveTextContent(text)
      expect(phrase).not.toHaveAttribute('aria-hidden', 'true')
      expect(phrase?.querySelector('img, picture')).not.toBeInTheDocument()
    }
  })
})
