import { render, screen } from '@testing-library/react'

import { BrandMark } from './BrandMark'

describe('BrandMark', () => {
  it('provides a text alternative for the inline logo mark', () => {
    render(<BrandMark />)

    expect(screen.getByRole('img', { name: /white cup/i })).toBeInTheDocument()
  })
})
