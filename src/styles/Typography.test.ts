import { describe, expect, it } from 'vitest'

import indexHtml from '../../index.html?raw'
import globalCss from './global.css?raw'
import tokensCss from './tokens.css?raw'

const localFaces = [
  {
    family: 'White Cup Hand',
    href: '/fonts/white-cup-hand-cyrillic.woff2',
    weight: '400',
  },
  {
    family: 'White Cup Body',
    href: '/fonts/golos-text-cyrillic-variable.woff2',
    weight: '400 900',
  },
] as const

describe('deterministic local typography', () => {
  it.each(localFaces)('declares and preloads $family', ({ family, href, weight }) => {
    expect(tokensCss).toMatch(
      new RegExp(
        `@font-face\\s*\\{(?=[^}]*font-family:\\s*['\"]${family}['\"])(?=[^}]*src:\\s*url\\(['\"]?${href}['\"]?\\)\\s*format\\(['\"]woff2['\"]\\))(?=[^}]*font-style:\\s*normal)(?=[^}]*font-weight:\\s*${weight})(?=[^}]*font-display:\\s*swap)[^}]*\\}`,
      ),
    )

    expect(indexHtml).toMatch(
      new RegExp(
        `<link(?=[^>]*rel=['\"]preload['\"])(?=[^>]*href=['\"]${href}['\"])(?=[^>]*as=['\"]font['\"])(?=[^>]*type=['\"]font/woff2['\"])(?=[^>]*crossorigin)[^>]*>`,
      ),
    )
  })

  it('routes primary headings through the clean body family and keeps handwriting separate', () => {
    expect(tokensCss).not.toContain("font-family: 'White Cup Display'")
    expect(indexHtml).not.toContain('/fonts/pangolin-cyrillic.woff2')
    expect(tokensCss).toMatch(
      /--font-display:\s*['"]White Cup Body['"][^;]*;/,
    )
    expect(tokensCss).toMatch(
      /--font-script:\s*['"]White Cup Hand['"][^;]*;/,
    )
    expect(tokensCss).toMatch(
      /--font-body:\s*['"]White Cup Body['"][^;]*;/,
    )
    expect(globalCss).toMatch(/html\s*\{[^}]*font-synthesis:\s*none;/)
  })

  it('keeps menu prices on the body face so the ruble glyph never uses the script subset', () => {
    expect(globalCss).toMatch(
      /\.menu-scene\s+\.menu-card__price\s*\{[^}]*font-family:\s*var\(--font-body\);/,
    )
  })
})
