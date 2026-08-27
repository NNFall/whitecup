import { describe, expect, it } from 'vitest'

import aboutSource from '../sections/AboutSection.tsx?raw'
import eventsSource from '../sections/EventsSection.tsx?raw'
import heroSource from '../sections/HeroSection.tsx?raw'
import locationsSource from '../sections/LocationsSection.tsx?raw'
import menuSource from '../sections/MenuSection.tsx?raw'
import mainSource from '../main.tsx?raw'
import sectionFrameSource from '../components/SectionFrame.tsx?raw'
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
      /\.hero-scene h1\s*\{[^}]*font-family:\s*var\(--font-display\);[^}]*font-size:\s*clamp\(3\.6rem,\s*5vw,\s*6rem\);[^}]*line-height:\s*0\.88;/s,
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

  it('keeps the short White Cup accent on the script face', () => {
    expect(liveTypographyCss).toMatch(
      /\.about-scene__title-line--brand\s*\{[^}]*font-family:\s*var\(--font-script\);/s,
    )
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

    expect(heroSource).toMatch(
      /<span\s+className="hero-scene__underline"\s+aria-hidden="true"[\s\S]*?\/>/,
    )
    expect(liveTypographyCss).toMatch(
      /\.hero-scene__underline::after\s*\{[^}]*content:\s*'';[^}]*background:\s*var\(--orange-action\);/s,
    )
    expect(heroSource).not.toMatch(/hero-title-reference|hero-underline-reference/)
  })
})
