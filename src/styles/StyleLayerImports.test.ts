import { describe, expect, it } from 'vitest'

import eventsSectionSource from '../sections/EventsSection.tsx?raw'
import locationsSectionSource from '../sections/LocationsSection.tsx?raw'
import mainSource from '../main.tsx?raw'
import sceneBridgeSource from '../components/SceneBridge.tsx?raw'
import stickyNavSource from '../components/StickyNav.tsx?raw'

const expectedCssImportOrder = [
  './styles/tokens.css',
  './styles/global.css',
  './styles/footer.css',
  './styles/scene-continuity-polish.css',
  './styles/mobile-hero-polish.css',
  './styles/menu-carousel-polish.css',
  './styles/navigation-polish.css',
  './styles/scene-bridge-polish.css',
  './styles/scene-layout-polish.css',
  './styles/scene-frame-polish.css',
  './styles/live-typography.css',
]

const componentStyleOwners = [
  ['SceneBridge', sceneBridgeSource],
  ['StickyNav', stickyNavSource],
  ['EventsSection', eventsSectionSource],
  ['LocationsSection', locationsSectionSource],
] as const

describe('runtime style layer imports', () => {
  it('loads the layered CSS after legacy styles in override order', () => {
    const cssImports = Array.from(
      mainSource.matchAll(/import\s+['"](\.\/styles\/[^'"]+\.css)['"]/g),
      (match) => match[1],
    )

    expect(cssImports).toEqual(expectedCssImportOrder)
  })

  it('evaluates the complete entrypoint CSS block before App dependencies', () => {
    const appImportIndex = mainSource.indexOf("import App from './App'")
    const lastCssImportIndex = Math.max(
      ...expectedCssImportOrder.map((path) => mainSource.indexOf(`import '${path}'`)),
    )

    expect(appImportIndex).toBeGreaterThan(lastCssImportIndex)
  })

  it('keeps runtime polish CSS imports in the entrypoint, not dependency modules', () => {
    componentStyleOwners.forEach(([owner, source]) => {
      expect(source, `${owner} should not import runtime CSS`).not.toMatch(
        /import\s+['"]\.\.?\/styles\/[^'"]+\.css['"]/
      )
    })
  })
})
