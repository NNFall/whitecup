import { describe, expect, it } from 'vitest'

import viteConfigSource from '../vite.config.ts?raw'

describe('Vite deployment base', () => {
  it('uses the site base for production builds and root base for dev/preview', () => {
    expect(viteConfigSource).toMatch(
      /base:\s*command\s*===\s*['"]build['"]\s*\|\|\s*isPreview\s*\?\s*['"]\/site\/whitecup\/['"]\s*:\s*['"]\/['"]/
    )
  })
})
