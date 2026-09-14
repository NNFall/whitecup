import { describe, expect, it } from 'vitest'

import aboutSource from '../sections/AboutSection.tsx?raw'
import eventsSource from '../sections/EventsSection.tsx?raw'
import heroSource from '../sections/HeroSection.tsx?raw'
import locationsSource from '../sections/LocationsSection.tsx?raw'
import menuSource from '../sections/MenuSection.tsx?raw'
import mainSource from '../main.tsx?raw'
import sectionFrameSource from '../components/SectionFrame.tsx?raw'
import globalCss from './global.css?raw'
import tokensCss from './tokens.css?raw'
import visitSource from '../sections/VisitSection.tsx?raw'

import liveTypographyCss from './live-typography.css?raw'

const runtimeSceneSources = [
  sectionFrameSource,
  heroSource,
  menuSource,
  aboutSource,
  visitSource,
  eventsSource,
  locationsSource,
]

function extractCssAtRule(css: string, atRule: RegExp) {
  const match = atRule.exec(css)
  if (!match || match.index === undefined) {
    throw new Error(`Missing CSS at-rule ${atRule}`)
  }

  const start = match.index
  const open = css.indexOf('{', start)
  if (open < 0) throw new Error(`Unclosed CSS at-rule ${atRule}`)

  let depth = 0
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === '{') depth += 1
    if (css[index] === '}') {
      depth -= 1
      if (depth === 0) return css.slice(start, index + 1)
    }
  }

  throw new Error(`Unclosed CSS at-rule ${atRule}`)
}

function cssRuleHasDeclaration(css: string, selector: string, declaration: RegExp) {
  const rules = /([^{}]+)\{([^{}]*)\}/g
  for (const match of css.matchAll(rules)) {
    const selectors = match[1]
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split(',')
      .map((candidate) => candidate.trim())
    if (selectors.includes(selector) && declaration.test(match[2])) return true
  }

  return false
}

function maxClampRem(css: string, selector: string) {
  const rules = /([^{}]+)\{([^{}]*)\}/g
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const values: number[] = []

  for (const match of css.matchAll(rules)) {
    const selectors = match[1]
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split(',')
      .map((candidate) => candidate.trim())
    if (!selectors.includes(selector)) continue

    const clamp = match[2].match(
      new RegExp(`font-size:\\s*clamp\\([^,]+,[^,]+,\\s*([\\d.]+)rem\\s*\\)`),
    )
    if (clamp) values.push(Number(clamp[1]))
  }

  if (!values.length) throw new Error(`Missing clamp font-size for ${escapedSelector}`)
  return Math.max(...values)
}

describe('live typography contracts', () => {
  it('registers the local Cyrillic display face and keeps the token on that face', () => {
    expect(tokensCss).toMatch(
      /@font-face\s*\{(?=[^}]*font-family:\s*['"]White Cup Display['"])(?=[^}]*src:\s*url\(['"]?\/fonts\/white-cup-display-cyrillic\.woff2['"]?\)\s*format\(['"]woff2['"]\))(?=[^}]*font-style:\s*normal)(?=[^}]*font-weight:\s*400)(?=[^}]*font-display:\s*swap)[^}]*\}/s,
    )
    expect(tokensCss).toMatch(
      /--font-display:\s*['"]White Cup Display['"][^;]*;/,
    )
    expect(tokensCss).not.toMatch(/--font-display:[^;]*Pangolin/i)
  })

  it('defines a last-loaded title stylesheet with a visible desktop and mobile hierarchy', () => {
    expect(mainSource.indexOf("'./styles/live-typography.css'")).toBeGreaterThan(
      mainSource.indexOf("'./styles/global.css'"),
    )
    expect(liveTypographyCss).toMatch(
      /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.hero-scene h1\s*\{[^}]*font-size:\s*clamp\(4\.75rem,\s*6\.25vw,\s*7\.25rem\);[^}]*line-height:\s*0\.88;/s,
    )
    expect(liveTypographyCss).toMatch(
      /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.menu-scene \.section-frame__heading h2[\s\S]*?opacity:\s*1;/s,
    )
    expect(liveTypographyCss).toMatch(
      /@media\s*\(max-width:\s*1023px\)[\s\S]*?\.menu-scene \.section-frame__heading h2,\s*\.about-scene \.section-frame__heading h2,\s*\.visit-scene \.section-frame__heading h2,\s*\.events-scene \.section-frame__heading h2,\s*\.locations-scene \.section-frame__heading h2\s*\{[^}]*font-family:\s*var\(--font-display\);[^}]*font-weight:\s*400;[^}]*opacity:\s*1;[^}]*transform:\s*none;/s,
    )
    expect(liveTypographyCss).not.toContain('title-reference')
  })

  it('wins the legacy heading cascade with the display face at every breakpoint', () => {
    const desktopSceneHeadingRule = /\.menu-scene \.section-frame__heading h2,\s*\.about-scene \.section-frame__heading h2,\s*\.visit-scene \.section-frame__heading h2,\s*\.events-scene \.section-frame__heading h2,\s*\.locations-scene \.section-frame__heading h2\s*\{(?=[^}]*font-family:\s*var\(--font-display\);)(?=[^}]*font-weight:\s*400;)[^}]*\}/s
    const mobileSceneHeadingRule = desktopSceneHeadingRule

    expect(liveTypographyCss).toMatch(
      new RegExp(`@media \\(min-width:\\s*1024px\\)[\\s\\S]*?${desktopSceneHeadingRule.source}`),
    )
    expect(liveTypographyCss).toMatch(
      new RegExp(`@media \\(max-width:\\s*1023px\\)[\\s\\S]*?${mobileSceneHeadingRule.source}`),
    )
  })

  it.each([
    ['.hero-scene h1', 7],
    ['.menu-scene .section-frame__heading h2', 6.25],
    ['.about-scene .section-frame__heading h2', 6],
    ['.visit-scene .section-frame__heading h2', 6],
    ['.events-scene .section-frame__heading h2', 5.9],
    ['.locations-scene .section-frame__heading h2', 6.2],
  ] as const)('raises %s to a reference-fit desktop display clamp', (selector, minimumRem) => {
    const desktopCss = extractCssAtRule(liveTypographyCss, /@media\s*\(min-width:\s*1024px\)/)
    const desktopAndBaseCss = `${desktopCss}\n${liveTypographyCss}`

    expect(maxClampRem(desktopAndBaseCss, selector)).toBeGreaterThanOrEqual(minimumRem)
  })

  it('resets all heading and phrase transforms on mobile after the desktop rebuild', () => {
    const mobileCss = extractCssAtRule(liveTypographyCss, /@media\s*\(max-width:\s*1023px\)/)
    const mobileHeadingSelectors = [
      '.hero-scene h1',
      '.menu-scene .section-frame__heading h2',
      '.about-scene .section-frame__heading h2',
      '.visit-scene .section-frame__heading h2',
      '.events-scene .section-frame__heading h2',
      '.locations-scene .section-frame__heading h2',
    ]
    const mobilePhraseSelectors = [
      '.hero-scene__word--coffee',
      '.hero-scene__brand',
      '.menu-scene__title-initial',
      '.menu-scene__word--look',
      '.about-scene__word--want',
      '.about-scene__word--return',
      '.visit-scene__word--rhythm',
      '.events-scene__word--warm',
      '.events-scene__word--events',
      '.locations-scene__word--find',
    ]

    for (const selector of [...mobileHeadingSelectors, ...mobilePhraseSelectors]) {
      expect(cssRuleHasDeclaration(mobileCss, selector, /transform:\s*none;/)).toBe(true)
    }
  })

  it('keeps the short White Cup accent on the script face', () => {
    expect(liveTypographyCss).toMatch(
      /\.about-scene__title-line--brand\s*\{[^}]*font-family:\s*var\(--font-script\);/s,
    )
  })

  it('separates the exact display accent from the darker action accent', () => {
    expect(tokensCss).toMatch(/--orange-display:\s*#df3a06;/)
    expect(tokensCss).toMatch(/--orange-action:\s*#c93608;/)

    const displayAccentRules = [
      '.menu-scene__accent',
      '.visit-scene__accent',
      '.events-scene__accent',
      '.menu-scene__accent::after',
      '.visit-scene__accent::after',
      '.events-scene__accent::after',
      '.locations-scene__title-accent::after',
    ]

    for (const selector of displayAccentRules) {
      expect(cssRuleHasDeclaration(globalCss, selector, /(?:color|background):\s*var\(--orange-display\);/)).toBe(
        true,
      )
    }

    expect(cssRuleHasDeclaration(globalCss, '.hero-scene__accent', /color:\s*var\(--orange\);/)).toBe(true)
    expect(cssRuleHasDeclaration(globalCss, '.about-scene__accent', /color:\s*var\(--orange\);/)).toBe(true)
    expect(cssRuleHasDeclaration(globalCss, '.about-scene__return::after', /background:\s*var\(--orange\);/)).toBe(
      true,
    )
    expect(cssRuleHasDeclaration(globalCss, '.about-scene__city::after', /background:\s*var\(--orange\);/)).toBe(
      true,
    )
    expect(cssRuleHasDeclaration(globalCss, '.locations-scene__title-accent', /color:/)).toBe(false)

    expect(liveTypographyCss).toMatch(
      /\.hero-scene__brand::after\s*\{[^}]*background:\s*var\(--orange-display\);/s,
    )

    for (const selector of [
      '.visit-scene__intro-accent::after',
      '.events-scene__intro-brand::after',
      '.locations-scene__intro-accent::after',
    ]) {
      expect(cssRuleHasDeclaration(globalCss, selector, /background:\s*var\(--orange-action\);/)).toBe(true)
    }
  })

  it('gives every phrase a bounded desktop rhythm and removes transforms on mobile', () => {
    expect(liveTypographyCss).toMatch(
      /\.hero-scene__brand,\s*\.about-scene__title-line--brand,\s*\.about-scene__word--return\s*\{[^}]*font-family:\s*var\(--font-script\);[^}]*font-style:\s*normal;/s,
    )
    expect(liveTypographyCss).toMatch(
      /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.hero-scene h1\s*\{[^}]*padding-bottom:\s*clamp\(1\.25rem,\s*1\.4vw,\s*1\.5rem\);/s,
    )

    const desktopPhraseTransforms = [
      ['hero-scene__word--coffee', 'rotate\\(-0\\.6deg\\) translateY\\(-0\\.02em\\)'],
      ['hero-scene__word--own', 'rotate\\(0\\.35deg\\)'],
      ['hero-scene__word--vibe', 'rotate\\(-0\\.3deg\\)'],
      ['hero-scene__brand', 'rotate\\(-1\\.1deg\\) translateY\\(0\\.03em\\)'],
      ['menu-scene__title-initial', 'rotate\\(-0\\.7deg\\)'],
      ['menu-scene__word--look', 'rotate\\(-0\\.75deg\\)'],
      ['about-scene__word--want', 'rotate\\(-0\\.55deg\\)'],
      ['about-scene__word--return', 'rotate\\(-1deg\\)'],
      ['visit-scene__word--rhythm', 'rotate\\(-0\\.7deg\\)'],
      ['events-scene__word--warm', 'rotate\\(0\\.4deg\\)'],
      ['locations-scene__word--find', 'rotate\\(-0\\.7deg\\)'],
    ] as const

    for (const [selector, transform] of desktopPhraseTransforms) {
      expect(liveTypographyCss).toMatch(
        new RegExp(
          `@media\\s*\\(min-width:\\s*1024px\\)[\\s\\S]*?\\.${selector}\\s*\\{[^}]*transform:\\s*${transform};`,
          's',
        ),
      )
    }

    expect(liveTypographyCss).toMatch(
      /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.menu-scene__title-initial\s*\{[^}]*font-size:\s*1\.12em;/s,
    )
    expect(liveTypographyCss).toMatch(
      /@media\s*\(max-width:\s*1023px\)[\s\S]*?\.hero-scene__word--coffee,[\s\S]*?\.locations-scene__word--find\s*\{[^}]*transform:\s*none;/s,
    )
  })

  it('removes title-image runtime paths from every scene source', () => {
    expect(runtimeSceneSources.join('\n')).not.toMatch(
      /ReferenceTitleLayer|title-reference|TitleReferenceExtract|TitleReference|heroUnderlineReferenceExtract/i,
    )
  })

  it('draws the hero underline as CSS decoration on the live heading', () => {
    const heroSource = runtimeSceneSources[1]

    expect(heroSource).toMatch(/className="hero-scene__brand"/)
    expect(heroSource).not.toMatch(/hero-scene__underline/)
    expect(liveTypographyCss).toMatch(
      /\.hero-scene__brand::after\s*\{[^}]*content:\s*'';[^}]*background:\s*var\(--orange-display\);/s,
    )
    expect(heroSource).not.toMatch(/hero-title-reference|hero-underline-reference/)
  })
})
