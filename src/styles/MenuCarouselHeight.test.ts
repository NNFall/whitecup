import { describe, expect, it } from 'vitest'

const menuCarouselModules = import.meta.glob<string>('./menu-carousel-polish*.css', {
  eager: true,
  import: 'default',
  query: '?raw',
})

const menuCarouselCss = Object.values(menuCarouselModules)[0] ?? ''

describe('menu carousel low-height continuity contract', () => {
  it('turns the desktop menu scene into an intrinsic-height paper runway', () => {
    expect(menuCarouselCss).toMatch(
      /@media\s*\(min-width:\s*1024px\)\s*and\s*\(min-height:\s*681px\)\s*and\s*\(max-height:\s*800px\)[\s\S]*?\.scene\.menu-scene\s*\{[^}]*height:\s*auto\s*!important;[^}]*min-height:\s*max\(100dvh,\s*(?:52|66)rem\);[^}]*max-height:\s*none\s*!important;[^}]*overflow-x:\s*clip\s*!important;[^}]*overflow-y:\s*visible\s*!important;/,
    )
    expect(menuCarouselCss).toMatch(
      /@media\s*\(min-width:\s*1024px\)\s*and\s*\(min-height:\s*681px\)\s*and\s*\(max-height:\s*800px\)[\s\S]*?\.menu-scene\s+\.section-frame__inner\s*\{[^}]*height:\s*auto\s*!important;[^}]*min-height:\s*max\(100dvh,\s*(?:52|66)rem\);/,
    )
  })

  it('keeps the extra-short desktop menu content vertically scrollable', () => {
    expect(menuCarouselCss).toMatch(
      /@media\s*\(min-width:\s*1024px\)\s*and\s*\(max-height:\s*680px\)[\s\S]*?\.scene\.menu-scene\s*\{[^}]*height:\s*auto\s*!important;[^}]*min-height:\s*max\(100dvh,\s*48rem\);[^}]*max-height:\s*none\s*!important;/,
    )
    expect(menuCarouselCss).toMatch(
      /@media\s*\(min-width:\s*1024px\)\s*and\s*\(max-height:\s*680px\)[\s\S]*?\.menu-scene\s+\.section-frame__inner\s*\{[^}]*height:\s*auto\s*!important;[^}]*min-height:\s*max\(100dvh,\s*48rem\);/,
    )
  })

  it('extends the desktop paper runway through the 912px viewport boundary', () => {
    expect(menuCarouselCss).toMatch(
      /@media\s*\(min-width:\s*1024px\)\s*and\s*\(min-height:\s*801px\)\s*and\s*\(max-height:\s*960px\)[\s\S]*?\.scene\.menu-scene\s*\{[^}]*height:\s*auto\s*!important;[^}]*min-height:\s*max\(100dvh,\s*60rem\);[^}]*max-height:\s*none\s*!important;[^}]*overflow-x:\s*clip\s*!important;[^}]*overflow-y:\s*visible\s*!important;/,
    )
    expect(menuCarouselCss).toMatch(
      /@media\s*\(min-width:\s*1024px\)\s*and\s*\(min-height:\s*801px\)\s*and\s*\(max-height:\s*960px\)[\s\S]*?\.menu-scene\s+\.section-frame__inner\s*\{[^}]*height:\s*auto\s*!important;[^}]*min-height:\s*max\(100dvh,\s*60rem\);/,
    )
  })

  it('keeps mobile menu descriptions readable without a hidden line clamp', () => {
    expect(menuCarouselCss).toMatch(
      /@media\s*\(max-width:\s*720px\)[\s\S]*?\.scene\.menu-scene \.menu-card__body\s*\{[^}]*height:\s*auto;[^}]*min-height:\s*0\s*!important;/,
    )
    expect(menuCarouselCss).toMatch(
      /@media\s*\(max-width:\s*720px\)[\s\S]*?\.scene\.menu-scene \.menu-card__description\s*\{[^}]*display:\s*block;[^}]*overflow:\s*visible\s*!important;[^}]*-webkit-line-clamp:\s*unset;/,
    )
  })
})
