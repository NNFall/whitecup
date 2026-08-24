import { render, screen } from '@testing-library/react'

import { BrandMark } from './BrandMark'

describe('BrandMark', () => {
  it('provides a text alternative for the inline logo mark', () => {
    render(<BrandMark />)

    expect(screen.getByRole('img', { name: /white cup/i })).toBeInTheDocument()
  })

  it('uses the supplied-reference badge asset for the hero header mark', () => {
    render(<BrandMark variant="badge" />)

    expect(screen.getByRole('img', { name: /white cup/i })).toHaveAttribute('src', '/media/hero-logo-reference.png')
    expect(screen.getByRole('img', { name: /white cup/i })).toHaveAttribute('data-media-kind', 'decorative-reference')
    expect(screen.getByRole('img', { name: /white cup/i }).parentElement).toHaveAttribute('data-media-kind', 'decorative-reference')
  })
})
