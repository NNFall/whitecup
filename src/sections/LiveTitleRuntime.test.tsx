import { render, within } from '@testing-library/react'

import App from '../App'

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

  it('does not mount any title-reference layer nodes in the story runtime', () => {
    const { container } = render(<App />)

    expect(container.querySelectorAll('[data-conditional-layer*="title-reference"]')).toHaveLength(0)
    expect(container.querySelectorAll('[class*="title-reference"]')).toHaveLength(0)
    expect(container.querySelectorAll('.section-frame__title-reference, .hero-scene__title-reference')).toHaveLength(0)
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
