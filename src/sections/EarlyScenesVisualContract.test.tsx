import { render, screen, within } from '@testing-library/react'

import App from '../App'
import heroSource from './HeroSection.tsx?raw'
import globalCss from '../styles/global.css?raw'
import liveTypographyCss from '../styles/live-typography.css?raw'

function extractCssBlocks(css: string, atRule: string) {
  const blocks: string[] = []
  let cursor = 0
  while (cursor < css.length) {
    const start = css.indexOf(atRule, cursor)
    if (start < 0) break

    const open = css.indexOf('{', start)
    if (open < 0) {
      throw new Error(`Unclosed CSS block ${atRule}`)
    }

    let depth = 0
    let closed = false
    for (let index = open; index < css.length; index += 1) {
      if (css[index] === '{') depth += 1
      if (css[index] === '}') {
        depth -= 1
        if (depth === 0) {
          blocks.push(css.slice(start, index + 1))
          cursor = index + 1
          closed = true
          break
        }
      }
    }

    if (!closed) {
      throw new Error(`Unclosed CSS block ${atRule}`)
    }
  }

  return blocks
}

function extractCssBlock(css: string, atRule: string, marker: string) {
  const block = extractCssBlocks(css, atRule).find((candidate) => candidate.includes(marker))
  if (block) return block
  throw new Error(`Missing CSS block ${atRule} containing ${marker}`)
}

describe('early-scene reference convergence', () => {
  it('fails fast when a CSS at-rule is not closed', () => {
    expect(() => extractCssBlocks('@media (max-width: 1px) { .hero { color: red; }', '@media (max-width: 1px)')).toThrow(
      'Unclosed CSS block @media (max-width: 1px)',
    )
  })

  it('keeps Hero, Menu, and About headings as explicit live line spans', () => {
    render(<App />)

    const lineContracts = [
      ['#hero', 1, '.hero-scene__title-line', [
        'hero-scene__title-line--first',
        'hero-scene__title-line--second',
        'hero-scene__title-line--third',
      ]],
      ['#menu', 2, '.menu-scene__title-line', [
        'menu-scene__title-line--first',
        'menu-scene__title-line--second',
      ]],
      ['#about', 2, '.about-scene__title-line', [
        'about-scene__title-line--brand',
        'about-scene__title-line--place',
        'about-scene__title-line--return',
      ]],
    ] as const

    for (const [sceneSelector, level, lineSelector, expectedClasses] of lineContracts) {
      const scene = document.querySelector<HTMLElement>(sceneSelector)
      expect(scene).toBeInTheDocument()
      if (!scene) continue

      const heading = within(scene).getByRole('heading', { level })
      const lines = heading.querySelectorAll(lineSelector)

      expect(lines).toHaveLength(expectedClasses.length)
      expectedClasses.forEach((className, index) => {
        expect(lines[index]).toHaveClass(className)
        expect(lines[index]).not.toHaveAttribute('aria-hidden', 'true')
        expect(lines[index].querySelector('img, picture, canvas')).not.toBeInTheDocument()
      })
    }
  })

  it('keeps the live Hero title visible and the underline as CSS decoration without moving the CTAs', () => {
    render(<App />)

    const hero = screen.getByRole('region', {
      name: /завтраки, кофе и свой вайб в White Cup/i,
    })
    const heading = within(hero).getByRole('heading', { level: 1 })
    const lines = heading.querySelectorAll('.hero-scene__title-line')

    expect(lines).toHaveLength(3)
    expect(lines[0]).toHaveClass('hero-scene__title-line--first')
    expect(lines[1]).toHaveClass('hero-scene__title-line--second')
    expect(lines[2]).toHaveClass('hero-scene__title-line--third')
    expect(heading.querySelector('.hero-scene__word--coffee')).toHaveTextContent('кофе')
    expect(heading.querySelector('.hero-scene__word--own')).toHaveTextContent('и свой')
    expect(heading.querySelector('.hero-scene__word--vibe')).toHaveTextContent('вайб в')
    expect(heading.querySelector('.hero-scene__brand')).toHaveTextContent('White Cup')

    expect(heading).toHaveTextContent('Завтраки, кофе и свой вайб в White Cup')
    expect(hero.querySelector('[data-conditional-layer*="title-reference"]')).not.toBeInTheDocument()
    expect(hero.querySelector('[class*="title-reference"]')).not.toBeInTheDocument()
    expect(heroSource).not.toMatch(
      /ReferenceTitleLayer|title-reference|TitleReferenceExtract|heroUnderlineReferenceExtract/i,
    )
    expect(liveTypographyCss).toMatch(
      /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.hero-scene h1\s*\{[^}]*font-size:\s*clamp\(4\.75rem,\s*6\.25vw,\s*7\.25rem\);/s,
    )
    expect(liveTypographyCss).toMatch(
      /@media \(min-width:\s*1024px\)[\s\S]*?\.hero-scene h1\s*\{[^}]*width:\s*auto;[^}]*height:\s*auto;[^}]*overflow:\s*visible;[^}]*clip:\s*auto;/s,
    )
    expect(liveTypographyCss).toMatch(
      /\.hero-scene__title-line,\s*\.about-scene__title-line,[\s\S]*?transform:\s*none;/s,
    )

    const brand = heading.querySelector('.hero-scene__brand')
    expect(brand).toBeInstanceOf(HTMLElement)
    expect(brand).toHaveTextContent('White Cup')
    expect(brand).not.toHaveAttribute('aria-hidden', 'true')
    expect(hero.querySelector('.hero-scene__underline')).not.toBeInTheDocument()
    expect(liveTypographyCss).toMatch(
      /\.hero-scene__brand::after\s*\{[^}]*content:\s*'';[^}]*background:\s*var\(--orange-action\);/s,
    )
    expect(globalCss).toMatch(
      /\.hero-scene__lede\s*\{[^}]*transform:\s*translate\(0\.26vw,\s*-0\.83dvh\)\s*scale\(1\.281,\s*1\.334\);/,
    )
    expect(globalCss).toMatch(
      /\.hero-reference-frame\s*\{[^}]*--hero-ref-skyline-left:\s*3\.58vw;[^}]*--hero-ref-skyline-bottom:\s*2\.21dvh;[^}]*--hero-ref-skyline-width:\s*42\.88vw;/,
    )
    expect(globalCss).toMatch(
      /\.hero-scene__actions \.button-link\s*\{[^}]*font-weight:\s*625;/,
    )
    expect(globalCss).toMatch(
      /\.hero-reference-frame\s*\{[^}]*--hero-bagel-left:\s*42\.1%;[^}]*--hero-bagel-top:\s*51\.8%;[^}]*--hero-bagel-width:\s*35\.2%;/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width:\s*720px\)[\s\S]*?\.hero-scene__lede\s*\{[^}]*transform:\s*none;/,
    )
  })

  it('locks independent About title geometry while keeping mobile transforms neutral', () => {
    render(<App />)

    const about = screen.getByRole('region', {
      name: /о White Cup — место, в которое хочется возвращаться/i,
    })
    const heading = within(about).getByRole('heading', { level: 2 })

    expect(heading.querySelector('.about-scene__title-line--brand')).toBeInTheDocument()
    expect(heading.querySelector('.about-scene__title-line--place')).toBeInTheDocument()
    expect(heading.querySelector('.about-scene__title-line--return')).toBeInTheDocument()
    expect(heading.querySelector('.about-scene__word--want')).toHaveTextContent('хочется')
    expect(heading.querySelector('.about-scene__word--return')).toHaveTextContent('возвращаться')

    expect(globalCss).toMatch(
      /\.about-scene__title-line--brand\s*\{[^}]*transform:\s*translateY\(1\.29dvh\) rotate\(-0\.7deg\) scale\(1\.07,\s*1\.38\);/,
    )
    expect(globalCss).toMatch(
      /\.about-scene__title-line--place\s*\{[^}]*transform:\s*translateY\(0\.85dvh\) scale\(1\.36,\s*1\.25\);/,
    )
    expect(globalCss).toMatch(
      /\.about-scene__title-line--return\s*\{[^}]*transform:\s*translateY\(-0\.43dvh\) scale\(1\.2,\s*1\.32\);/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width:\s*1023px\)[\s\S]*?\.about-scene__title-line--place,\s*\.about-scene__title-line--return\s*\{[^}]*transform:\s*none;/,
    )
  })

  it('keeps the entire 320-720 mobile hero on one fluid title and action range', () => {
    const mobileCss = extractCssBlock(globalCss, '@media (max-width: 720px)', '.hero-backdrop')

    expect(mobileCss).toMatch(
      /\.hero-scene__inner\s*\{[^}]*padding:\s*clamp\(4\.9rem,\s*calc\(0\.78rem\s*\+\s*20\.6vw\),\s*6\.3rem\)\s+clamp\(1rem,\s*calc\(-0\.14rem\s*\+\s*5\.7vw\),\s*1\.25rem\)\s+clamp\(3\.5rem,\s*calc\(-1\.07rem\s*\+\s*22\.86vw\),\s*4\.5rem\);/s,
    )
    expect(mobileCss).toMatch(/\.hero-scene__inner\s*\{[^}]*gap:\s*0;/s)
    expect(mobileCss).toMatch(
      /\.hero-scene__copy\s*\{[^}]*gap:\s*clamp\(0\.8rem,\s*calc\(-0\.57rem\s*\+\s*6\.86vw\),\s*1\.25rem\);/s,
    )
    expect(mobileCss).toMatch(
      /\.hero-scene h1\s*\{[^}]*font-size:\s*clamp\(2\.75rem,\s*14\.5vw,\s*4\.4rem\);/s,
    )
    expect(mobileCss).toMatch(
      /\.hero-scene__lede\s*\{[^}]*font-size:\s*clamp\(0\.9rem,\s*calc\(0\.31rem\s*\+\s*2\.97vw\),\s*1\.03rem\);/s,
    )
    expect(mobileCss).toMatch(
      /\.hero-scene__actions\s*\{[^}]*gap:\s*clamp\(0\.55rem,\s*calc\(0\.1rem\s*\+\s*2\.29vw\),\s*0\.65rem\);/s,
    )
    expect(mobileCss).toMatch(
      /\.hero-scene__actions \.button-link,\s*\.hero-scene__actions \.button-link--primary\s*\{[^}]*min-height:\s*clamp\(3rem,\s*calc\(0\.94rem\s*\+\s*10\.3vw\),\s*3\.45rem\);/s,
    )
  })

  it('keeps one positive media handoff and forbids narrow hero geometry resets', () => {
    const mobileCss = extractCssBlock(globalCss, '@media (max-width: 720px)', '.hero-backdrop')
    const narrowBlocks = [
      ...extractCssBlocks(globalCss, '@media (max-width: 340px)'),
      ...extractCssBlocks(globalCss, '@media (max-width: 380px)'),
      ...extractCssBlocks(globalCss, '@media (max-width: 480px)'),
    ]

    expect(mobileCss).toMatch(
      /\.hero-scene__visual\s*\{[^}]*min-height:\s*clamp\(13rem,\s*calc\(-9\.86rem\s*\+\s*114\.3vw\),\s*22rem\);[^}]*margin-top:\s*clamp\(0\.5rem,\s*calc\(-0\.83rem\s*\+\s*6\.67vw\),\s*1rem\);/s,
    )
    expect(mobileCss).not.toMatch(
      /\.hero-scene__visual\s*\{[^}]*margin-top:\s*-/s,
    )
    expect(mobileCss).toMatch(
      /\.hero-backdrop\s*\{[^}]*top:\s*clamp\(24\.5rem,\s*calc\(-6\.3rem\s*\+\s*154vw\),\s*40rem\);[^}]*bottom:\s*auto;[^}]*height:\s*clamp\(17rem,\s*calc\(-5\.88rem\s*\+\s*114\.3vw\),\s*28rem\);/s,
    )
    expect(narrowBlocks.every((block) => !/\.hero-scene__visual|\.hero-backdrop/.test(block))).toBe(true)
  })

  it('keeps the 721-1023 tablet hero single-column until the desktop split is safe', () => {
    const tabletCss = extractCssBlock(
      globalCss,
      '@media (min-width: 721px) and (max-width: 1023px)',
      '.hero-scene__inner',
    )

    expect(tabletCss).toMatch(
      /\.hero-reference-frame\s*\{[^}]*min-height:\s*auto;[^}]*padding-bottom:\s*clamp\(2\.5rem,\s*4vw,\s*4\.5rem\);/s,
    )
    expect(tabletCss).toMatch(
      /\.hero-scene__inner\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\);[^}]*gap:\s*0;[^}]*padding:\s*clamp\(5\.75rem,\s*10vw,\s*7\.5rem\)\s+clamp\(2rem,\s*7vw,\s*5\.5rem\)\s+clamp\(4rem,\s*6vw,\s*5\.5rem\);/s,
    )
    expect(tabletCss).toMatch(
      /\.hero-scene__actions\s*\{[^}]*display:\s*flex;[^}]*width:\s*min\(100%,\s*44rem\);[^}]*flex-wrap:\s*wrap;/s,
    )
    expect(tabletCss).toMatch(
      /\.hero-scene__actions \.button-link,\s*\.hero-scene__actions \.button-link--primary\s*\{[^}]*width:\s*auto;[^}]*min-width:\s*min\(100%,\s*14rem\);[^}]*flex:\s*1 1 14rem;[^}]*white-space:\s*nowrap;/s,
    )
    expect(tabletCss).toMatch(
      /\.hero-scene__visual\s*\{[^}]*min-height:\s*clamp\(21rem,\s*45vw,\s*32rem\);[^}]*margin-top:\s*clamp\(1rem,\s*2vw,\s*1\.5rem\);/s,
    )
    expect(tabletCss).not.toMatch(/grid-template-columns:\s*var\(--hero-ref-paper-split\)/)
  })

  it('raises and restores the Visit display type while constraining cards to the reference grid', () => {
    render(<App />)

    const visit = screen.getByRole('region', {
      name: /у нас есть место для вашего ритма/i,
    })
    const heading = within(visit).getByRole('heading', { level: 2 })

    expect(heading.querySelector('.visit-scene__title-line--first')).toBeInTheDocument()
    expect(heading.querySelector('.visit-scene__title-line--second')).toBeInTheDocument()
    expect(heading.querySelector('.visit-scene__word--rhythm')).toHaveTextContent('ритма')
    expect(globalCss).toMatch(
      /\.visit-scene__title-line--first\s*\{[^}]*transform:\s*translateY\(-0\.75dvh\) scale\(1\.34,\s*1\.25\);/,
    )
    expect(globalCss).toMatch(
      /\.visit-scene__title-line--second\s*\{[^}]*transform:\s*translateY\(-1dvh\) scale\(1\.38,\s*1\.22\);/,
    )
    expect(globalCss).toMatch(
      /\.visit-card-reveal,\s*\.visit-card\s*\{[^}]*min-height:\s*0;[^}]*height:\s*100%;/,
    )
    expect(globalCss).toMatch(
      /\.visit-scene__skyline\s*\{[^}]*top:\s*84\.9%;/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width:\s*1023px\)[\s\S]*?\.visit-scene__title-line\s*\{[^}]*transform:\s*none;/,
    )
  })
})
