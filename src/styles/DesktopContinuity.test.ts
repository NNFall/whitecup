import { describe, expect, it } from 'vitest'

import footerCss from './footer.css?raw'
import globalCss from './global.css?raw'
import liveTypographyCss from './live-typography.css?raw'

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

type ParsedStyleRule = {
  conditions: string[]
  declarations: Record<string, string>
  selectors: string[]
}

function parseStyleRules(css: string) {
  const styleElement = document.createElement('style')
  styleElement.textContent = css
  document.head.append(styleElement)

  const parsedRules: ParsedStyleRule[] = []
  const sheet = styleElement.sheet

  if (!sheet) {
    styleElement.remove()
    throw new Error('Expected the global stylesheet to produce a CSSStyleSheet')
  }

  const visitRules = (rules: CSSRuleList, conditions: string[] = []) => {
    for (const rule of Array.from(rules)) {
      if (rule.type === CSSRule.STYLE_RULE) {
        const styleRule = rule as CSSStyleRule
        const declarations: Record<string, string> = {}

        for (let index = 0; index < styleRule.style.length; index += 1) {
          const property = styleRule.style.item(index)
          declarations[property] = styleRule.style
            .getPropertyValue(property)
            .trim()
        }

        parsedRules.push({
          conditions,
          declarations,
          selectors: styleRule.selectorText
            .split(',')
            .map((selector) => selector.trim()),
        })
        continue
      }

      const groupingRule = rule as CSSRule & {
        conditionText?: string
        cssRules?: CSSRuleList
      }

      if (!groupingRule.cssRules) continue

      visitRules(
        groupingRule.cssRules,
        groupingRule.conditionText
          ? [...conditions, groupingRule.conditionText]
          : conditions,
      )
    }
  }

  visitRules(sheet.cssRules)
  styleElement.remove()

  return parsedRules
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

  it('keeps live title ink visible and flow-sized in the global style layer', () => {
    const titleSelectors = new Set([
      '.hero-scene h1',
      '.hero-scene__underline',
      '.menu-scene .section-frame__heading h2',
      '.about-scene .section-frame__heading h2',
      '.visit-scene .section-frame__heading h2',
      '.events-scene .section-frame__heading h2',
      '.locations-scene .section-frame__heading h2',
    ])
    const titleRules = parseStyleRules(globalCss).filter((rule) =>
      rule.selectors.some((selector) => titleSelectors.has(selector)),
    )
    const hiddenTitleRules = titleRules.filter(({ declarations }) => {
      const collapsesFlow =
        declarations.position === 'absolute' &&
        declarations.width === '1px' &&
        declarations.height === '1px' &&
        declarations.overflow === 'hidden' &&
        declarations.clip === 'rect(0px)'

      return (
        collapsesFlow ||
        declarations.display === 'none' ||
        declarations.opacity === '0' ||
        declarations.visibility === 'hidden'
      )
    })
    const rasterTitleRules = parseStyleRules(globalCss).filter((rule) =>
      rule.selectors.some(
        (selector) =>
          selector.includes('title-reference') ||
          selector.includes("data-conditional-layer='title-reference'"),
      ),
    )

    expect(titleRules.flatMap((rule) => rule.selectors)).toEqual(
      expect.arrayContaining([...titleSelectors]),
    )
    expect(hiddenTitleRules).toEqual([])
    expect(rasterTitleRules).toEqual([])
  })

  it('reserves intrinsic Hero flow below the script brand without absolute phrase positioning', () => {
    expect(liveTypographyCss).toMatch(
      /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.hero-scene h1\s*\{[^}]*padding-bottom:\s*clamp\(1\.25rem,\s*1\.4vw,\s*1\.5rem\);/s,
    )
    expect(liveTypographyCss).not.toMatch(
      /(?:hero|menu|about|visit|events|locations)-scene__(?:word|brand)[^{]*\{[^}]*position:\s*absolute;/s,
    )
  })

  it('moves live title bands clear of copy on short desktop heights', () => {
    const shortAboutTitle = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 800px) and (min-aspect-ratio: 4 / 3)',
      '.about-scene .section-frame__heading',
    )
    const shortVisitTitle = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 800px) and (min-aspect-ratio: 4 / 3)',
      '.visit-scene .section-frame__heading',
    )
    const shortEventsTitle = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 800px) and (min-aspect-ratio: 4 / 3)',
      '.events-scene .section-frame__heading',
    )

    expect(shortAboutTitle).toMatch(
      /\.about-scene \.section-frame__heading\s*\{[^}]*top:\s*9\.5%;/s,
    )
    expect(shortVisitTitle).toMatch(
      /\.visit-scene \.section-frame__heading\s*\{[^}]*top:\s*0%;/s,
    )
    expect(shortEventsTitle).toMatch(
      /\.events-scene \.section-frame__heading\s*\{[^}]*top:\s*18%;/s,
    )
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
      /\.menu-scene \.section-frame__heading h2\s*\{[^}]*font-size:\s*clamp\(2\.85rem,\s*3\.7vw,\s*3\.5rem\);[^}]*line-height:\s*0\.92;/s,
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
      /\.scene\.menu-scene\s*\{[^}]*height:\s*auto;[^}]*min-height:\s*max\(100dvh,\s*48rem\);[^}]*max-height:\s*none;/s,
    )
    expect(extraShortMenu).toMatch(
      /\.menu-scene \.section-frame__inner\s*\{[^}]*height:\s*auto;[^}]*min-height:\s*max\(100dvh,\s*48rem\);/s,
    )
  })

  it('keeps the Visit intro clear of its cards on wide short desktops', () => {
    const shortVisit = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 900px) and (min-aspect-ratio: 4 / 3)',
      '.visit-scene__intro',
    )

    expect(shortVisit).toMatch(
      /\.visit-scene__intro\s*\{[^}]*top:\s*30\.5%;[^}]*width:\s*38%;/s,
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

  it('keeps the Visit kicker compact on short desktops', () => {
    const shortVisitKicker = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 760px)',
      '.visit-scene .scene-kicker',
    )

    expect(shortVisitKicker).toMatch(
      /\.visit-scene \.scene-kicker\s*\{[^}]*margin-bottom:\s*0;[^}]*font-size:\s*clamp\(0\.75rem,\s*2\.2dvh,\s*0\.94rem\);[^}]*line-height:\s*1\.08;/s,
    )
  })

  it('moves the Visit intro above its card band on short desktop heights', () => {
    const shortVisitIntro = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 900px) and (min-aspect-ratio: 4 / 3)',
      '.visit-scene__intro',
    )

    expect(shortVisitIntro).toMatch(
      /\.visit-scene__intro\s*\{[^}]*top:\s*30\.5%;/s,
    )
  })

  it('keeps the Visit kicker compact through the 800px height guard', () => {
    const shortVisitKicker = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 800px) and (min-aspect-ratio: 4 / 3)',
      '.visit-scene .scene-kicker',
    )

    expect(shortVisitKicker).toMatch(
      /\.visit-scene \.scene-kicker\s*\{[^}]*margin-bottom:\s*0;[^}]*font-size:\s*clamp\(0\.75rem,\s*2\.2dvh,\s*0\.94rem\);[^}]*line-height:\s*1\.08;/s,
    )
  })

  it('gives every fixed desktop scene a scrollable runway below 680px', () => {
    const extraShortScenes = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 680px)',
      '.scene.about-scene',
    )
    const extraShortInners = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 680px)',
      '.about-scene .section-frame__inner',
    )

    expect(extraShortScenes).toMatch(
      /\.scene\.about-scene,\s*\.scene\.visit-scene,\s*\.scene\.events-scene,\s*\.scene\.locations-scene\s*\{[^}]*height:\s*auto;[^}]*min-height:\s*max\(100dvh,\s*42rem\);[^}]*max-height:\s*none;/s,
    )
    expect(extraShortInners).toMatch(
      /\.about-scene \.section-frame__inner,\s*\.visit-scene \.section-frame__inner,\s*\.events-scene \.section-frame__inner,\s*\.locations-scene \.section-frame__inner\s*\{[^}]*height:\s*auto;[^}]*min-height:\s*max\(100dvh,\s*42rem\);/s,
    )
  })

  it('keeps the short desktop Menu footer inside its paper runway', () => {
    const menuExtraShort = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 680px)',
      '.scene.menu-scene',
    )
    const menuExtraShortInner = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 680px)',
      '.menu-scene .section-frame__inner',
    )

    expect(menuExtraShort).toMatch(
      /\.scene\.menu-scene\s*\{[^}]*height:\s*auto;[^}]*min-height:\s*max\(100dvh,\s*48rem\);[^}]*max-height:\s*none;/s,
    )
    expect(menuExtraShortInner).toMatch(
      /\.menu-scene \.section-frame__inner\s*\{[^}]*height:\s*auto;[^}]*min-height:\s*max\(100dvh,\s*48rem\);/s,
    )
  })

  it('adds a wide low-height guard for About, Visit and Events', () => {
    const wideExtraShortAbout = extractCssBlock(
      globalCss,
      '@media (min-width: 1600px) and (max-height: 680px)',
      '.about-scene .section-frame__heading',
    )
    const wideExtraShortVisit = extractCssBlock(
      globalCss,
      '@media (min-width: 1600px) and (max-height: 680px)',
      '.visit-scene__intro',
    )
    const wideExtraShortEvents = extractCssBlock(
      globalCss,
      '@media (min-width: 1600px) and (max-height: 680px)',
      '.scene.events-scene',
    )

    expect(wideExtraShortAbout).toMatch(
      /\.about-scene \.section-frame__heading\s*\{[^}]*top:\s*7%;/s,
    )
    expect(wideExtraShortVisit).toMatch(
      /\.visit-scene__intro\s*\{[^}]*top:\s*31\.5%;/s,
    )
    expect(wideExtraShortEvents).toMatch(
      /\.scene\.events-scene\s*\{[^}]*height:\s*auto;[^}]*min-height:\s*max\(100dvh,\s*55rem\);[^}]*max-height:\s*none;/s,
    )
  })

  it('extends Menu and Events scenes when short desktop cards would outgrow the viewport', () => {
    const wideShortScenes = extractCssBlock(
      globalCss,
      '@media (min-width: 1600px) and (min-height: 681px) and (max-height: 800px)',
      '.scene.menu-scene,\n  .scene.events-scene',
    )
    const compactShortScenes = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-width: 1599px) and (min-height: 681px) and (max-height: 800px)',
      '.scene.menu-scene,\n  .scene.events-scene',
    )

    expect(wideShortScenes).toMatch(
      /\.scene\.menu-scene,\s*\.scene\.events-scene\s*\{[^}]*height:\s*auto;[^}]*min-height:\s*max\(100dvh,\s*66rem\);[^}]*max-height:\s*none;/s,
    )
    expect(compactShortScenes).toMatch(
      /\.scene\.menu-scene,\s*\.scene\.events-scene\s*\{[^}]*height:\s*auto;[^}]*min-height:\s*max\(100dvh,\s*52rem\);[^}]*max-height:\s*none;/s,
    )
  })

  it('keeps the 720px card bands below their intro copy', () => {
    const tightAboutCards = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (min-height: 681px) and (max-height: 720px) and (min-aspect-ratio: 4 / 3)',
      '.about-scene .benefits-list',
    )
    const tightEventsCards = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (min-height: 681px) and (max-height: 720px) and (min-aspect-ratio: 4 / 3)',
      '.events-scene__cards',
    )
    const tightLocationsCards = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (min-height: 681px) and (max-height: 720px) and (min-aspect-ratio: 4 / 3)',
      '.locations-scene__cards',
    )

    expect(tightAboutCards).toMatch(
      /\.about-scene \.benefits-list\s*\{[^}]*bottom:\s*6\.2%;/s,
    )
    expect(tightEventsCards).toMatch(
      /\.events-scene__cards\s*\{[^}]*top:\s*60\.1%;/s,
    )
    expect(tightLocationsCards).toMatch(
      /\.locations-scene__cards\s*\{[^}]*top:\s*54\.3%;/s,
    )
  })

  it('keeps the About intro above the benefit cards on short desktops', () => {
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

  it('keeps the Events intro clear of its cards on short desktops', () => {
    const shortEventsFlow = extractCssBlock(
      globalCss,
      '@media (min-width: 1024px) and (max-height: 800px) and (min-aspect-ratio: 4 / 3)',
      '.events-scene__intro p',
    )

    expect(shortEventsFlow).toMatch(
      /\.events-scene__intro p\s*\{[^}]*font-size:\s*min\(1\.05vw,\s*2\.35dvh,\s*1\.05rem\);[^}]*line-height:\s*1\.34;/s,
    )
  })

  it('keeps the Locations intro clear of its cards on short desktops', () => {
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
