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
})
