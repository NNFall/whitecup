import { render, screen, within } from '@testing-library/react'

import App from '../App'
import globalCss from '../styles/global.css?raw'

describe('early-scene reference convergence', () => {
  it('locks the measured Hero copy, underline, and skyline geometry without moving the CTAs', () => {
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

    const titleReference = hero.querySelector('.hero-scene__title-reference')
    const titleReferenceSource = hero.querySelector('[data-conditional-layer="title-reference"] source[media="(min-width: 1024px)"]')
    const titleReferenceSources = hero.querySelectorAll('[data-conditional-layer="title-reference"] source')
    expect(titleReferenceSources).toHaveLength(2)
    expect(titleReference).toHaveAttribute('data-layer', 'decoration')
    expect(titleReference).toHaveAttribute('data-media-kind', 'decorative-reference-extract')
    expect(titleReferenceSource).toHaveAttribute('media', '(min-width: 1024px)')
    expect(titleReferenceSource).toHaveAttribute(
      'srcset',
      '/media/hero-title-reference-extract-800.webp 800w, /media/hero-title-reference-extract-1600.webp 1600w',
    )
    expect(hero.querySelector('[data-conditional-layer="title-reference"] source[media="(max-width: 1023px)"]')).toHaveAttribute(
      'srcset',
      '/media/hero-title-reference-extract-800.webp',
    )
    expect(globalCss).toMatch(
      /\.hero-scene__title-reference\s*\{[^}]*width:\s*47\.85vw;[^}]*pointer-events:\s*none;/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width:\s*1023px\)[\s\S]*?\.hero-scene__title-reference\s*\{[^}]*display:\s*block;/,
    )

    expect(globalCss).toMatch(
      /\.hero-scene__title-line--first\s*\{[^}]*transform:\s*translate\(-0\.42vw,\s*-0\.38dvh\)\s*scale\(1\.24,\s*1\.044\);/,
    )
    expect(globalCss).toMatch(
      /\.hero-scene__title-line--second\s*\{[^}]*transform:\s*translate\(-0\.23vw,\s*-0\.08dvh\)\s*scale\(1\.27,\s*1\.013\);/,
    )
    expect(globalCss).toMatch(
      /\.hero-scene__title-line--third\s*\{[^}]*transform:\s*translate\(-0\.17vw,\s*0\.04dvh\)\s*scale\(1\.19,\s*0\.969\);/,
    )

    const underline = hero.querySelector('.hero-scene__underline')
    expect(underline).toBeInstanceOf(HTMLImageElement)
    expect(underline).toHaveAttribute('src', '/media/hero-underline-reference-extract-tight.webp')
    expect(underline).toHaveAttribute('alt', '')
    expect(underline).toHaveAttribute('aria-hidden', 'true')
    expect(underline).toHaveAttribute('data-layer', 'decoration')
    expect(underline).toHaveAttribute('data-media-kind', 'decorative-reference-extract')
    expect(hero.querySelector('svg.hero-scene__underline')).not.toBeInTheDocument()
    expect(globalCss).toMatch(
      /\.hero-scene__underline\s*\{[^}]*transform:\s*translate\(-0\.31vw,\s*-0\.85dvh\)\s*scale\(1\.017,\s*2\.9\);/,
    )
    expect(globalCss).toMatch(
      /\.hero-scene__underline\s*\{[^}]*width:\s*23\.386vw;[^}]*height:\s*1\.026dvh;[^}]*padding-top:\s*0\.44rem;/,
    )
    expect(globalCss).not.toMatch(/\.hero-scene__underline::(?:before|after)/)
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
      /@media \(max-width:\s*340px\)[\s\S]*?\.hero-scene__actions \.button-link[^}]*min-height:\s*3rem;/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width:\s*340px\)[\s\S]*?\.hero-scene__inner\s*\{[^}]*padding-top:\s*4\.9rem;/,
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

  it('keeps the compact 320px hero actions inside the first mobile frame', () => {
    expect(globalCss).toMatch(
      /@media \(max-width:\s*340px\)[\s\S]*?\.hero-scene__copy\s*\{[^}]*gap:\s*0\.8rem;/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width:\s*340px\)[\s\S]*?\.hero-scene h1\s*\{[^}]*font-size:\s*clamp\(2\.75rem,\s*14\.5vw,\s*3\.1rem\);/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width:\s*340px\)[\s\S]*?\.hero-scene__lede\s*\{[^}]*font-size:\s*0\.9rem;/,
    )
  })

  it('raises and restores the Visit display type while constraining cards to the reference grid', () => {
    render(<App />)

    const visit = screen.getByRole('region', {
      name: /у нас есть место для вашего ритма/i,
    })
    const heading = within(visit).getByRole('heading', { level: 2 })

    expect(heading.querySelector('.visit-scene__title-line--first')).toBeInTheDocument()
    expect(heading.querySelector('.visit-scene__title-line--second')).toBeInTheDocument()
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
