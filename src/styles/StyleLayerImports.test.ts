import { describe, expect, it } from 'vitest'

import mainSource from '../main.tsx?raw'

const expectedCssImportOrder = [
  './styles/tokens.css',
  './styles/global.css',
  './styles/footer.css',
  './styles/live-typography.css',
  './styles/menu-carousel-polish.css',
  './styles/scene-continuity-polish.css',
  './styles/mobile-hero-polish.css',
]

describe('runtime style layer imports', () => {
  it('loads the layered CSS after legacy styles in override order', () => {
    const cssImports = Array.from(
      mainSource.matchAll(/import\s+['"](\.\/styles\/[^'"]+\.css)['"]/g),
      (match) => match[1],
    )

    expect(cssImports).toEqual(expectedCssImportOrder)
  })
})
