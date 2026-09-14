import { describe, expect, it } from 'vitest'

import globalCss from './global.css?raw'
import carouselCss from './menu-carousel-polish.css?raw'

describe('menu carousel polish contracts', () => {
  it('gives desktop a native snap viewport and an intentionally partial card track', () => {
    expect(carouselCss).toMatch(
      /\.menu-carousel__viewport\s*\{[^}]*overflow-x:\s*auto;[^}]*scroll-snap-type:\s*x mandatory;/s,
    )
    expect(carouselCss).toContain('width: var(--menu-carousel-viewport-width);')
    expect(carouselCss).toContain('--menu-carousel-card-width: clamp(18rem, 23vw, 27rem);')
    expect(carouselCss).toContain('grid-auto-columns: var(--menu-carousel-card-width);')
    expect(carouselCss).toContain('gap: clamp(0.9rem, 1.2vw, 1.4rem);')
    expect(carouselCss).toContain('padding-inline-end: max(0px, calc(100cqw - var(--menu-carousel-card-width)));')
  })

  it('keeps desktop and tablet trailing range exact without cqw, then enhances it with cqw', () => {
    const desktopStart = carouselCss.indexOf('@media (min-width: 1024px)')
    const tabletStart = carouselCss.indexOf('@media (min-width: 721px) and (max-width: 1023px)')
    const enhancedStart = carouselCss.indexOf('@supports (width: 1cqw)')

    expect(desktopStart).toBeGreaterThanOrEqual(0)
    expect(tabletStart).toBeGreaterThan(desktopStart)
    expect(enhancedStart).toBeGreaterThan(tabletStart)

    const desktopFallback = carouselCss.slice(desktopStart, tabletStart)
    const tabletFallback = carouselCss.slice(tabletStart, enhancedStart)
    const enhanced = carouselCss.slice(enhancedStart)

    expect(desktopFallback).toContain(
      '--menu-carousel-viewport-width: min(calc(100vw - 8vw), 104rem);',
    )
    expect(desktopFallback).toContain(
      '--menu-carousel-trailing-padding: max(0px, calc(var(--menu-carousel-viewport-width) - var(--menu-carousel-card-width)));',
    )
    expect(tabletFallback).toContain(
      '--menu-carousel-viewport-width: calc(100vw - var(--menu-gutter) - var(--menu-gutter));',
    )
    expect(tabletFallback).toContain(
      '--menu-carousel-trailing-padding: max(0px, calc(var(--menu-carousel-viewport-width) - var(--menu-carousel-card-width)));',
    )
    expect(desktopFallback).not.toContain('100cqw')
    expect(tabletFallback).not.toContain('100cqw')

    expect(enhanced).toContain(
      '--menu-carousel-trailing-padding: max(0px, calc(100cqw - var(--menu-carousel-card-width)));',
    )
    expect(enhanced).toContain(
      'padding-inline-end: max(0px, calc(100cqw - var(--menu-carousel-card-width)));',
    )

    const assertExactLastOffset = (
      viewportWidth: number,
      cardWidth: number,
      gap: number,
      trailingPadding: number,
    ) => {
      const itemCount = 5
      const lastCardOffset = (itemCount - 1) * (cardWidth + gap)
      const scrollWidth = itemCount * cardWidth + (itemCount - 1) * gap + trailingPadding

      expect(trailingPadding).toBeCloseTo(Math.max(0, viewportWidth - cardWidth), 5)
      expect(scrollWidth - viewportWidth).toBeCloseTo(lastCardOffset, 5)
    }

    // The fallback and enhanced branches use different units but must encode
    // the same physical relation: trailing range equals viewport minus card.
    const desktopFallbackWidth = Math.min(1920 - 1920 * 0.08, 104 * 16)
    const desktopFallbackCard = 1920 * 0.23
    const desktopFallbackGap = 1920 * 0.012
    assertExactLastOffset(
      desktopFallbackWidth,
      desktopFallbackCard,
      desktopFallbackGap,
      desktopFallbackWidth - desktopFallbackCard,
    )
    const desktopEnhancedWidth = desktopFallbackWidth
    assertExactLastOffset(
      desktopEnhancedWidth,
      desktopFallbackCard,
      desktopFallbackGap,
      desktopEnhancedWidth - desktopFallbackCard,
    )

    const tabletGutter = Math.min(32, Math.max(20, 900 * 0.04))
    const tabletFallbackWidth = 900 - tabletGutter * 2
    const tabletFallbackCard = Math.max(288, Math.min(384, 900 * 0.34))
    const tabletFallbackGap = Math.min(17.6, Math.max(14.4, 900 * 0.015))
    assertExactLastOffset(
      tabletFallbackWidth,
      tabletFallbackCard,
      tabletFallbackGap,
      tabletFallbackWidth - tabletFallbackCard,
    )
    const tabletEnhancedWidth = tabletFallbackWidth
    assertExactLastOffset(
      tabletEnhancedWidth,
      tabletFallbackCard,
      tabletFallbackGap,
      tabletEnhancedWidth - tabletFallbackCard,
    )
  })

  it('gives tablet its own multi-card geometry instead of the mobile sliver layout', () => {
    expect(carouselCss).toMatch(
      /@media\s*\(min-width:\s*721px\)\s*and\s*\(max-width:\s*1023px\)[\s\S]*?--menu-carousel-card-width:\s*clamp\(18rem,\s*34vw,\s*24rem\);/s,
    )
    expect(carouselCss).toContain('grid-auto-columns: var(--menu-carousel-card-width);')
    expect(carouselCss).toContain('gap: clamp(0.9rem, 1.5vw, 1.1rem);')
    expect(carouselCss).toMatch(
      /@media\s*\(min-width:\s*721px\)\s*and\s*\(max-width:\s*1023px\)[\s\S]*?padding-inline-end:\s*max\(0px,\s*calc\(100cqw - var\(--menu-carousel-card-width\)\)\);/s,
    )
  })

  it('keeps the strict one-card-plus-sliver treatment only on mobile', () => {
    expect(carouselCss).not.toMatch(/@media\s*\(max-width:\s*1023px\)\s*\{/)
    expect(carouselCss).toMatch(
      /@media\s*\(max-width:\s*720px\)[\s\S]*?--menu-gutter:\s*clamp\(1rem,\s*4vw,\s*1\.25rem\);/s,
    )
    expect(carouselCss).toContain('--menu-gutter: clamp(1rem, 4vw, 1.25rem);')
    expect(carouselCss).toContain('width: calc(100% - var(--menu-gutter) - var(--menu-gutter));')
    expect(carouselCss).toContain(
      '--menu-carousel-card-width: calc(100cqw - var(--menu-carousel-gap) - var(--menu-carousel-sliver));',
    )
    expect(carouselCss).toContain('padding-inline-start: 0;')
    expect(carouselCss).toContain('padding-inline-end: max(0px, calc(100cqw - var(--menu-carousel-card-width)));')
    expect(carouselCss).toMatch(
      /\.menu-scene \.menu-carousel__control\s*\{[^}]*width:\s*44px;[^}]*min-width:\s*44px;[^}]*height:\s*44px;[^}]*min-height:\s*44px;/s,
    )
  })

  it('calculates a 48-96px mobile sliver at 320, 390, and 720px', () => {
    expect(carouselCss).toContain('--menu-carousel-gap: clamp(0.75rem, 3vw, 1rem);')
    expect(carouselCss).toContain('--menu-carousel-sliver: clamp(48px, 13vw, 96px);')
    expect(carouselCss).toContain(
      '--menu-carousel-card-width: calc(100cqw - var(--menu-carousel-gap) - var(--menu-carousel-sliver));',
    )

    const clamp = (value: number, minimum: number, maximum: number) =>
      Math.min(maximum, Math.max(minimum, value))
    const cases = [
      { viewportWidth: 320, gutter: 16 },
      { viewportWidth: 390, gutter: 16 },
      { viewportWidth: 720, gutter: 20 },
    ]

    cases.forEach(({ viewportWidth, gutter }) => {
      const carouselWidth = viewportWidth - gutter * 2
      const gap = clamp(viewportWidth * 0.03, 12, 16)
      const sliver = clamp(viewportWidth * 0.13, 48, 96)
      const cardWidth = carouselWidth - gap - sliver
      const remainingSliver = carouselWidth - cardWidth - gap

      expect(remainingSliver).toBeCloseTo(sliver, 5)
      expect(remainingSliver).toBeGreaterThanOrEqual(48)
      expect(remainingSliver).toBeLessThanOrEqual(96)
    })
  })

  it('uses a viewport sizing context instead of percentage math in the max-content track', () => {
    const trackRules = carouselCss.match(/\.menu-carousel__track\s*\{[^}]*\}/g) ?? []

    expect(trackRules.length).toBeGreaterThan(0)
    expect(trackRules.join('\n')).not.toMatch(/100%/)
    expect(carouselCss).toMatch(
      /\.menu-carousel__viewport\s*\{[^}]*container-type:\s*inline-size;/s,
    )
    expect(carouselCss).toContain(
      '--menu-carousel-card-width: calc(100cqw - var(--menu-carousel-gap) - var(--menu-carousel-sliver));',
    )
  })

  it('does not force snap stops that can intercept non-adjacent dot jumps', () => {
    expect(carouselCss).toContain('scroll-snap-stop: normal;')
    expect(carouselCss).not.toContain('scroll-snap-stop: always;')
  })

  it('wins the final snap-stop cascade against the legacy global rule', () => {
    const legacyRule = globalCss.match(
      /\.menu-scene \.menu-card\s*\{[^}]*scroll-snap-stop:\s*([^;]+);/s,
    )
    const polishRule = carouselCss.match(
      /\.scene\.menu-scene \.menu-carousel \.menu-card\s*\{[^}]*scroll-snap-stop:\s*([^;]+);/s,
    )

    expect(legacyRule?.[1].trim()).toBe('always')
    expect(polishRule?.[1].trim()).toBe('normal')

    const specificity = (selector: string) => (selector.match(/\.[\w-]+/g) ?? []).length
    const legacySpecificity = specificity('.menu-scene .menu-card')
    const polishSpecificity = specificity('.scene.menu-scene .menu-carousel .menu-card')
    expect(polishSpecificity).toBeGreaterThan(legacySpecificity)

    const readComputedSnapStop = (styles: string[]) => {
      const styleElements = styles.map((css) => {
        const style = document.createElement('style')
        style.textContent = css
        document.head.append(style)
        return style
      })
      const scene = document.createElement('div')
      scene.className = 'scene menu-scene'
      const carousel = document.createElement('div')
      carousel.className = 'menu-carousel'
      const card = document.createElement('div')
      card.className = 'menu-card'
      carousel.append(card)
      scene.append(carousel)
      document.body.append(scene)

      try {
        return getComputedStyle(card).getPropertyValue('scroll-snap-stop')
      } finally {
        scene.remove()
        styleElements.forEach((style) => style.remove())
      }
    }

    // The bundler can emit the component stylesheet before the legacy global
    // sheet, while direct imports can produce the reverse order. Specificity
    // must keep the final computed value safe in either case.
    // Inject only the two relevant rules so this source-level cascade test
    // remains deterministic without asking JSDOM to parse the full global
    // stylesheet twice.
    expect(readComputedSnapStop([polishRule?.[0] ?? '', legacyRule?.[0] ?? ''])).toBe('normal')
    expect(readComputedSnapStop([legacyRule?.[0] ?? '', polishRule?.[0] ?? ''])).toBe('normal')
  })

  it('keeps a non-cqw mobile fallback before the cqw enhancement', () => {
    const mobileStart = carouselCss.indexOf('@media (max-width: 720px)')
    const enhancedStart = carouselCss.indexOf('@supports (width: 1cqw)')

    expect(mobileStart).toBeGreaterThanOrEqual(0)
    expect(enhancedStart).toBeGreaterThan(mobileStart)

    const fallback = carouselCss.slice(mobileStart, enhancedStart)
    const enhanced = carouselCss.slice(enhancedStart)

    expect(fallback).toContain('--menu-carousel-card-width: calc(100vw - var(--menu-gutter) - var(--menu-gutter) - var(--menu-carousel-gap) - var(--menu-carousel-sliver));')
    expect(fallback).not.toContain('100cqw')
    expect(enhanced).toContain('--menu-carousel-card-width: calc(100cqw - var(--menu-carousel-gap) - var(--menu-carousel-sliver));')
    expect(enhanced).toContain('padding-inline-end: max(0px, calc(100cqw - var(--menu-carousel-card-width)));')
  })

  it('turns off carousel motion and transitions for reduced-motion users', () => {
    expect(carouselCss).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.menu-carousel__viewport\s*\{[^}]*scroll-behavior:\s*auto;/s,
    )
    expect(carouselCss).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.menu-carousel__viewport\s*\{[^}]*scroll-snap-type:\s*none;/s,
    )
    expect(carouselCss).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?transition:\s*none;/s,
    )
  })

  it('keeps the mobile menu controls fully reachable at 320px height', () => {
    const compactMobile = globalCss.slice(globalCss.lastIndexOf('@media (max-width: 340px)'))

    expect(compactMobile).toMatch(
      /\.menu-scene__intro\s*\{[^}]*margin-top:\s*1rem;/s,
    )
    expect(compactMobile).toMatch(
      /\.menu-scene__carousel\s*\{[^}]*margin-top:\s*0\.4rem;/s,
    )
    expect(compactMobile).toMatch(
      /\.menu-scene \.menu-carousel__toolbar\s*\{[^}]*min-height:\s*2\.3rem;/s,
    )
  })
})
