import { describe, expect, it } from 'vitest'

import footerCss from './footer.css?raw'
import globalCss from './global.css?raw'

function extractCssBlock(css: string, atRule: string, marker: string) {
  let cursor = 0

  while (cursor < css.length) {
    const start = css.indexOf(atRule, cursor)
    if (start < 0) break

    const open = css.indexOf('{', start)
    if (open < 0) throw new Error(`Unclosed CSS block ${atRule}`)

    let depth = 0
    let closed = false
    for (let index = open; index < css.length; index += 1) {
      if (css[index] === '{') depth += 1
      if (css[index] !== '}') continue

      depth -= 1
      if (depth !== 0) continue

      const block = css.slice(start, index + 1)
      if (block.includes(marker)) return block
      cursor = index + 1
      closed = true
      break
    }

    if (!closed) throw new Error(`Unclosed CSS block ${atRule}`)
  }

  throw new Error(`Missing CSS block ${atRule} containing ${marker}`)
}

describe('desktop continuity guards', () => {
  it('fails fast when a matched CSS at-rule is not closed', () => {
    expect(extractCssBlock.toString()).toContain('let closed = false')
    expect(() =>
      extractCssBlock(
        '@media (max-width: 1px) { .hero-scene__actions { display: grid; }',
        '@media (max-width: 1px)',
        '.hero-scene__actions',
      ),
    ).toThrow('Unclosed CSS block @media (max-width: 1px)')
  })

  it('gives the narrow desktop hero intrinsic-safe action columns', () => {
    const narrowHero = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-width: 1200px)',
      '.hero-scene__actions',
    )

    expect(narrowHero).toMatch(
      /\.hero-reference-frame\s*\{[^}]*--hero-ref-paper-split:\s*47\.5%;/s,
    )
    expect(narrowHero).toMatch(
      /\.hero-scene__actions\s*\{[^}]*display:\s*grid;[^}]*width:\s*100%;[^}]*max-width:\s*27rem;[^}]*grid-template-columns:\s*minmax\(0,\s*1\.05fr\)\s*minmax\(0,\s*0\.95fr\);/s,
    )
    expect(narrowHero).toMatch(
      /\.hero-scene__actions \.button-link\s*\{[^}]*width:\s*100%;[^}]*min-width:\s*max-content;[^}]*padding-inline:\s*clamp\(0\.65rem,\s*1vw,\s*0\.8rem\);[^}]*font-size:\s*clamp\(0\.9rem,\s*1\.45vw,\s*1rem\);/s,
    )
    expect(narrowHero).toMatch(
      /\.hero-scene__actions \.button-link \.hero-scene__pin\s*\{[^}]*margin-left:\s*0\.5rem;/s,
    )
  })

  it('fits the complete menu carousel composition into short desktop scenes', () => {
    const shortMenu = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 760px)',
      '.scene.menu-scene',
    )

    expect(shortMenu).toMatch(
      /\.menu-scene \.section-frame__inner\s*\{[^}]*padding:\s*1\.25rem 0 0\.5rem;/s,
    )
    expect(shortMenu).toMatch(
      /\.menu-scene__title-reference\s*\{[^}]*top:\s*7%;[^}]*width:\s*min\(42vw,\s*100dvh\);/s,
    )
    expect(shortMenu).toMatch(
      /\.menu-scene \.menu-carousel__track\s*\{[^}]*grid-auto-columns:\s*clamp\(11\.5rem,\s*15vw,\s*13\.5rem\);/s,
    )
    expect(shortMenu).toMatch(
      /\.menu-scene \.menu-card__body\s*\{[^}]*min-height:\s*4\.6rem;/s,
    )
    expect(shortMenu).toMatch(
      /\.menu-scene \.menu-carousel__footer\s*\{[^}]*min-height:\s*2\.75rem;/s,
    )
    expect(shortMenu).toMatch(
      /\.menu-scene \.menu-carousel__controls\s*\{[^}]*top:\s*calc\(2\.1rem \+ min\(7\.5vw,\s*8rem\) - 1\.5rem\);/s,
    )

    const extraShortMenu = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 680px)',
      '.scene.menu-scene',
    )

    expect(extraShortMenu).toMatch(
      /\.scene\.menu-scene\s*\{[^}]*height:\s*auto;[^}]*min-height:\s*max\(100dvh,\s*42rem\);[^}]*max-height:\s*none;/s,
    )
    expect(extraShortMenu).toMatch(
      /\.menu-scene \.section-frame__inner\s*\{[^}]*height:\s*auto;[^}]*min-height:\s*max\(100dvh,\s*42rem\);/s,
    )
  })

  it('separates Visit title ink from the intro on wide short desktops', () => {
    const shortVisit = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 900px) and (min-aspect-ratio: 4 / 3)',
      '.visit-scene__title-reference',
    )

    expect(shortVisit).toMatch(
      /\.visit-scene__title-reference\s*\{[^}]*top:\s*11\.5%;[^}]*width:\s*min\(41\.5vw,\s*75dvh\);/s,
    )
    expect(shortVisit).toMatch(
      /\.visit-scene__intro\s*\{[^}]*top:\s*34%;[^}]*width:\s*38%;/s,
    )
    expect(shortVisit).toMatch(
      /\.visit-scene__intro p\s*\{[^}]*font-size:\s*clamp\(0\.76rem,\s*0\.88vw,\s*0\.9rem\);[^}]*line-height:\s*1\.4;/s,
    )
    expect(shortVisit).not.toContain('max-width: 1679px')
    expect(globalCss).not.toContain(
      '@media (min-width: 1024px) and (max-width: 1679px) and (max-height: 900px) and (min-aspect-ratio: 4 / 3)',
    )

    const extraShortVisit = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 640px) and (min-aspect-ratio: 4 / 3)',
      '.visit-scene__cards',
    )

    expect(extraShortVisit).toMatch(
      /\.visit-scene__intro\s*\{[^}]*width:\s*42%;/s,
    )
    expect(extraShortVisit).toMatch(
      /\.visit-scene__cards\s*\{[^}]*top:\s*46%;[^}]*height:\s*41%;/s,
    )
  })

  it('keeps the Visit kicker above the raster title on short desktops', () => {
    const shortVisitKicker = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 760px)',
      '.visit-scene .scene-kicker',
    )

    expect(shortVisitKicker).toMatch(
      /\.visit-scene \.scene-kicker\s*\{[^}]*margin-bottom:\s*0;[^}]*font-size:\s*clamp\(0\.75rem,\s*2\.2dvh,\s*0\.94rem\);[^}]*line-height:\s*1\.08;/s,
    )
  })

  it('keeps the About title and intro above the benefit cards on short desktops', () => {
    const shortAboutTitle = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 900px) and (min-aspect-ratio: 4 / 3)',
      '.about-scene__title-reference-lower',
    )

    expect(shortAboutTitle).toMatch(
      /\.about-scene__title-reference-upper\s*\{[^}]*width:\s*min\(47\.55vw,\s*117dvh\);/s,
    )
    expect(shortAboutTitle).toMatch(
      /\.about-scene__title-reference-lower\s*\{[^}]*width:\s*min\(52\.33vw,\s*85dvh\);/s,
    )

    const shortAboutFlow = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 800px) and (min-aspect-ratio: 4 / 3)',
      '.about-scene__intro p',
    )

    expect(shortAboutFlow).toMatch(
      /\.about-scene__intro\s*\{[^}]*gap:\s*1rem;/s,
    )
    expect(shortAboutFlow).toMatch(
      /\.about-scene__intro p\s*\{[^}]*font-size:\s*min\(1\.18vw,\s*2\.4dvh,\s*1\.1rem\);[^}]*line-height:\s*1\.35;/s,
    )
  })

  it('keeps the Events title and intro clear of its cards on short desktops', () => {
    const shortEventsTitle = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 900px) and (min-aspect-ratio: 4 / 3)',
      '.events-scene__title-reference',
    )

    expect(shortEventsTitle).toMatch(
      /\.events-scene__title-reference\s*\{[^}]*width:\s*min\(47\.25vw,\s*75dvh\);/s,
    )

    const shortEventsFlow = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 800px) and (min-aspect-ratio: 4 / 3)',
      '.events-scene__intro p',
    )

    expect(shortEventsFlow).toMatch(
      /\.events-scene__intro p\s*\{[^}]*font-size:\s*min\(1\.05vw,\s*2\.35dvh,\s*1\.05rem\);[^}]*line-height:\s*1\.34;/s,
    )
  })

  it('keeps the Locations title and intro clear of its cards on short desktops', () => {
    const shortLocationsTitle = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 900px) and (min-aspect-ratio: 4 / 3)',
      '.locations-scene__title-reference',
    )

    expect(shortLocationsTitle).toMatch(
      /\.locations-scene__title-reference\s*\{[^}]*width:\s*min\(46\.95vw,\s*75dvh\);/s,
    )

    const shortLocationsFlow = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 800px) and (min-aspect-ratio: 4 / 3)',
      '.locations-scene__intro p',
    )

    expect(shortLocationsFlow).toMatch(
      /\.locations-scene__intro p\s*\{[^}]*font-size:\s*min\(1\.17vw,\s*2\.35dvh,\s*1\.08rem\);[^}]*line-height:\s*1\.3;/s,
    )
  })

  it('keeps wide short Visit card descriptions inside their cards', () => {
    const shortWideVisitCards = extractCssBlock(
      globalCss,
      '@media (min-width: 1440px) and (max-height: 760px)',
      '.visit-card__copy p',
    )

    expect(shortWideVisitCards).toMatch(
      /\.visit-scene__cards\s*\{[^}]*top:\s*max\(46%,\s*calc\(34\.8% \+ 5\.05rem\)\);[^}]*height:\s*43%;/s,
    )
    expect(shortWideVisitCards).toMatch(
      /\.visit-card\s*\{[^}]*grid-template-rows:\s*59% minmax\(0,\s*1fr\);/s,
    )
    expect(shortWideVisitCards).toMatch(
      /\.visit-card__copy\s*\{[^}]*padding:\s*min\(0\.7rem,\s*1\.2dvh\) min\(1\.2rem,\s*1vw\) min\(0\.8rem,\s*1\.4dvh\);/s,
    )
    expect(shortWideVisitCards).toMatch(
      /\.visit-card__copy h3\s*\{[^}]*margin-bottom:\s*min\(0\.5rem,\s*1\.1dvh\);/s,
    )
    expect(shortWideVisitCards).toMatch(
      /\.visit-card__copy p\s*\{[^}]*font-size:\s*clamp\(0\.72rem,\s*1\.9dvh,\s*0\.88rem\);[^}]*line-height:\s*1\.24;/s,
    )
  })

  it('uses an inert ticket-cut footer bridge without covering footer content', () => {
    expect(footerCss).toMatch(
      /\.site-footer\s*\{[^}]*position:\s*relative;[^}]*isolation:\s*isolate;/s,
    )
    expect(footerCss).toMatch(
      /\.site-footer::before\s*\{[^}]*background:\s*var\(--ink-soft\);[^}]*clip-path:\s*polygon\([^}]*pointer-events:\s*none;/s,
    )
    expect(footerCss).toMatch(
      /\.site-footer::after\s*\{[^}]*border-top:\s*2px dashed var\(--orange-action\);[^}]*pointer-events:\s*none;/s,
    )
    expect(footerCss).toMatch(
      /\.site-footer__inner,\s*\.site-footer__meta\s*\{[^}]*position:\s*relative;[^}]*z-index:\s*1;/s,
    )
    expect(footerCss).toMatch(
      /@media \(max-width: 720px\)[\s\S]*?\.site-footer\s*\{[^}]*margin-top:\s*2\.8rem;/s,
    )
  })
})
