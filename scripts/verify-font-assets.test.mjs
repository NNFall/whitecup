import { describe, expect, it } from 'vitest'

import {
  requiredFontAssets,
  verifyFontAssets,
} from './verify-font-assets.mjs'

describe('required public font assets', () => {
  it('fails hard when a required font path is missing', () => {
    expect(() =>
      verifyFontAssets({
        rootDir: process.cwd(),
        files: ['public/fonts/__missing-white-cup-font__.woff2'],
      }),
    ).toThrow(/Missing required font assets/)
  })

  it('includes and verifies the production display, script, and body faces', () => {
    expect(requiredFontAssets).toEqual([
      'public/fonts/white-cup-display-cyrillic.woff2',
      'public/fonts/white-cup-hand-cyrillic.woff2',
      'public/fonts/golos-text-cyrillic-variable.woff2',
    ])
    expect(verifyFontAssets({ rootDir: process.cwd() })).toEqual(requiredFontAssets)
  })
})
