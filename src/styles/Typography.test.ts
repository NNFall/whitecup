import { describe, expect, it } from 'vitest'

import indexHtml from '../../index.html?raw'
import globalCss from './global.css?raw'
import liveTypographyCss from './live-typography.css?raw'
import tokensCss from './tokens.css?raw'

const localFaces = [
  {
    family: 'White Cup Display',
    href: '/fonts/white-cup-display-cyrillic.woff2',
    weight: '400',
  },
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

  it('routes display, body, and short accent text through their intended local families', () => {
    expect(tokensCss).toMatch(
      /@font-face\s*\{(?=[^}]*font-family:\s*['"]White Cup Display['"])(?=[^}]*src:\s*url\(['"]?\/fonts\/white-cup-display-cyrillic\.woff2['"]?\)\s*format\(['"]woff2['"]\))(?=[^}]*font-style:\s*normal)(?=[^}]*font-weight:\s*400)(?=[^}]*font-display:\s*swap)[^}]*\}/s,
    )
    expect(indexHtml).not.toContain('/fonts/pangolin-cyrillic.woff2')
    expect(tokensCss).toMatch(
      /--font-display:\s*['"]White Cup Display['"]\s*,\s*['"]White Cup Body['"][^;]*;/,
    )
    expect(tokensCss).toMatch(
      /--font-script:\s*['"]White Cup Hand['"][^;]*['"]Marck Script['"][^;]*;/,
    )
    expect(tokensCss).toMatch(
      /--font-body:\s*['"]White Cup Body['"][^;]*['"]Golos Text['"][^;]*;/,
    )
    expect(tokensCss).not.toMatch(/--font-display:[^;]*(?:Pangolin|Marck Script)/i)
    expect(liveTypographyCss).toMatch(
      /\.hero-scene h1,\s*\.section-frame__heading h2\s*\{[^}]*font-family:\s*var\(--font-display\);/s,
    )
    expect(liveTypographyCss).toMatch(
      /\.site-shell \.site-nav__desktop a,[\s\S]*?\.site-footer__phone\s*\{[^}]*font-family:\s*var\(--font-body\);/s,
    )
    expect(liveTypographyCss).toMatch(
      /\.site-shell \.brand-mark\s*\{[^}]*font-family:\s*var\(--font-script\);/s,
    )
    expect(liveTypographyCss).toMatch(
      /\.about-scene__title-line--brand\s*\{[^}]*font-family:\s*var\(--font-script\);/s,
    )
    expect(globalCss).toMatch(/html\s*\{[^}]*font-synthesis:\s*none;/)
  })

  it('keeps menu prices on the body face so the ruble glyph never uses the script subset', () => {
    expect(globalCss).toMatch(
      /\.menu-scene\s+\.menu-card__price\s*\{[^}]*font-family:\s*var\(--font-body\);/,
    )
  })
})
