import { render, screen, within } from '@testing-library/react'

import { MenuSection } from './MenuSection'
import { siteData } from '../data/site'
import globalCss from '../styles/global.css?raw'
import liveTypographyCss from '../styles/live-typography.css?raw'

describe('Menu reference visual contract', () => {
  it('exposes the menu heading as one continuous accessible name', () => {
    const { container } = render(<MenuSection />)
    const menu = container.querySelector<HTMLElement>('#menu')

    expect(menu).not.toBeNull()
    if (!menu) throw new Error('Menu section is missing')

    const heading = within(menu).getByRole('heading', { level: 2 })
    expect(heading).toHaveAccessibleName('Завтраки, ради которых хочется заглянуть')
    // The title is live text now: it participates in the heading's accessible
    // name instead of being a decorative raster layer hidden from assistive
    // technology.
    expect(heading.querySelector('.menu-scene__title')).not.toHaveAttribute('aria-hidden')
    expect(heading.querySelector('.menu-scene__word--look')).toHaveTextContent('заглянуть')
    expect(heading.querySelector('.menu-scene__mobile-title-break')).toHaveAttribute('aria-hidden', 'true')
    expect(heading.querySelector('.sr-only')).not.toBeInTheDocument()
    expect(heading.querySelector('.menu-scene__title')).not.toHaveAttribute('aria-label')
    expect(menu).toHaveAccessibleName('Завтраки, ради которых хочется заглянуть')
    expect(globalCss).toMatch(
      /\.sr-only\s*\{[^}]*position:\s*absolute;[^}]*width:\s*1px;[^}]*height:\s*1px;[^}]*clip-path:\s*inset\(50%\);/s,
    )
  })

  it('keeps the menu title in two authored lines with editable initial and accent spans', () => {
    const { container } = render(<MenuSection />)
    const menu = container.querySelector<HTMLElement>('#menu')

    expect(menu).not.toBeNull()
    if (!menu) throw new Error('Menu section is missing')

    const heading = within(menu).getByRole('heading', { level: 2 })
    const lines = heading.querySelectorAll('.menu-scene__title-line')
    const initial = heading.querySelector('.menu-scene__title-initial')
    const accent = heading.querySelector('.menu-scene__word--look')

    expect(lines).toHaveLength(2)
    expect(lines[0]).toHaveClass('menu-scene__title-line--first')
    expect(lines[1]).toHaveClass('menu-scene__title-line--second')
    expect(lines[0]).toHaveTextContent('Завтраки, ради которых')
    expect(lines[1]).toHaveTextContent('хочется заглянуть')
    expect(initial).toHaveTextContent('З')
    expect(initial).not.toHaveAttribute('aria-hidden', 'true')
    expect(accent).toHaveTextContent('заглянуть')
    expect(accent).toHaveClass('menu-scene__accent')
    expect(accent).not.toHaveAttribute('aria-hidden', 'true')
    expect(heading.querySelector('img, picture, canvas')).not.toBeInTheDocument()
  })

  it('holds the 320px title to three authored lines with a positive flow gap', () => {
    expect(liveTypographyCss).toMatch(
      /\.menu-scene__mobile-title-break\s*\{[^}]*display:\s*none;/s,
    )
    expect(liveTypographyCss).toMatch(
      /@media\s*\(max-width:\s*1023px\)[\s\S]*?\.menu-scene__mobile-title-break\s*\{[^}]*display:\s*block;/s,
    )
    expect(liveTypographyCss).toMatch(
      /@media\s*\(max-width:\s*380px\)[\s\S]*?\.menu-scene \.section-frame__heading h2\s*\{[^}]*font-size:\s*clamp\(2\.45rem,\s*12vw,\s*2\.7rem\);[^}]*line-height:\s*0\.9;/s,
    )
    expect(liveTypographyCss).toMatch(
      /@media\s*\(max-width:\s*380px\)[\s\S]*?\.menu-scene \.section-frame__heading\s*\{[^}]*margin-bottom:\s*clamp\(1\.1rem,\s*5vw,\s*1\.4rem\);/s,
    )
    expect(liveTypographyCss).toMatch(
      /@media\s*\(max-width:\s*1023px\)[\s\S]*?\.menu-scene__title-line(?:\s*,|\s*\{)[^}]*transform:\s*none;/s,
    )
  })

  it('keeps provenance and prices accessible without drawing extra rows over the reference scene', () => {
    const { container } = render(<MenuSection />)
    const menu = container.querySelector<HTMLElement>('#menu')

    expect(menu).not.toBeNull()
    expect(menu?.querySelector('.menu-scene__source')).not.toBeInTheDocument()

    const provenance = within(menu as HTMLElement).getByText(/декоративные арт-материалы по референсу/i)
    expect(provenance).toHaveClass('menu-scene__provenance')
    expect(provenance).toHaveAttribute('id', 'menu-provenance-note')

    const fullMenuLink = within(menu as HTMLElement).getByRole('link', {
      name: /открыть полное меню в яндекс картах/i,
    })
    expect(fullMenuLink).toHaveAttribute('aria-describedby', 'menu-provenance-note')
    expect(fullMenuLink).toHaveTextContent('открыть полное меню')
    expect(fullMenuLink).not.toHaveTextContent('листайте')
    expect(fullMenuLink).toHaveAccessibleName('Открыть полное меню в Яндекс Картах')
    expect(menu?.querySelector('.menu-carousel__note-instruction')).toHaveTextContent(
      'Это лишь часть меню — листайте, чтобы увидеть больше!',
    )
    expect(menu?.querySelector('.menu-carousel__note-divider')).toHaveAttribute('aria-hidden', 'true')
    const noteCopy = menu?.querySelector('.menu-carousel__note-copy')
    expect(noteCopy).toBeInTheDocument()
    expect(noteCopy).toHaveTextContent(/листайте, чтобы увидеть больше!/i)

    expect(menu?.querySelector('.menu-card__price')).not.toBeInTheDocument()
    const facts = menu?.querySelectorAll('[data-menu-copy="middle"] .menu-card__facts') ?? []
    expect(facts).toHaveLength(siteData.menuItems.length)
    expect(facts[0]).toHaveTextContent('270–320 ₽')
    expect([...facts].slice(1).every((fact) => /актуальная цена — в меню/i.test(fact.textContent ?? ''))).toBe(true)
  })

  it('keeps the expanded accessible carousel while hiding only non-semantic copies', () => {
    const { container } = render(<MenuSection />)
    const menu = container.querySelector<HTMLElement>('#menu')
    const carousel = within(menu as HTMLElement).getByRole('region', {
      name: /избранное меню white cup/i,
    })

    expect(within(carousel).getAllByRole('listitem')).toHaveLength(siteData.menuItems.length)

    const clones = carousel.querySelectorAll<HTMLElement>('[data-menu-clone="true"]')
    expect(clones).toHaveLength(siteData.menuItems.length * 2)
    clones.forEach((clone) => {
      expect(clone).toHaveAttribute('aria-hidden', 'true')
      expect(clone).toHaveAttribute('tabindex', '-1')
    })
  })

  it('keeps every carousel dot visibly inked instead of resolving currentColor to transparent', () => {
    const dotSpanRule = globalCss.match(/\.menu-scene \.menu-carousel__dot span\s*\{[^}]*\}/s)?.[0]

    expect(dotSpanRule).toContain('background: currentColor;')
    expect(dotSpanRule).toContain('font-size: 0;')
    expect(dotSpanRule).not.toContain('color: transparent;')
  })

  it('locks the supplied 1920 artboard proportions while preserving authored mobile overflow', () => {
    const { container } = render(<MenuSection />)

    expect(container.querySelector('.menu-scene__title-initial')).toHaveTextContent('З')
    expect(globalCss).toMatch(
      /\.menu-scene__provenance\s*\{[^}]*width:\s*1px;[^}]*clip-path:\s*inset\(50%\);/s,
    )
    expect(globalCss).toMatch(
      /\.menu-carousel__sliver\s*\{[^}]*display:\s*none;[^}]*pointer-events:\s*none;/s,
    )
    expect(globalCss).toMatch(
      /@media \(min-width:\s*1024px\)[\s\S]*?\.menu-carousel__sliver\s*\{[^}]*display:\s*block;/,
    )
    expect(globalCss).toMatch(
      /\.scene\.menu-scene\s*\{[^}]*--menu-title-flow-offset:\s*calc\(clamp\(2\.25rem,\s*2\.2vw,\s*2\.65rem\)\s*-\s*clamp\(0\.6rem,\s*0\.8vw,\s*0\.95rem\)\);/s,
    )
    expect(globalCss).toMatch(
      /\.menu-scene \.section-frame__heading\s*\{[^}]*gap:\s*clamp\(0\.6rem,\s*0\.8vw,\s*0\.95rem\);/s,
    )
    expect(globalCss).toMatch(
      /\.menu-scene__title-line:first-child\s*\{[^}]*top:\s*calc\(var\(--menu-title-flow-offset\)\s*-\s*0\.25rem\);[^}]*transform:\s*scale\(1\.15,\s*1\.1\);/s,
    )
    expect(globalCss).toMatch(
      /\.menu-scene__title-initial\s*\{[^}]*transform:\s*translate\(-0\.22rem,\s*-0\.08rem\)\s*scale\(1\.06,\s*1\.35\);/s,
    )
    expect(globalCss).toMatch(
      /\.menu-scene__title-line:nth-child\(2\)\s*\{[^}]*top:\s*calc\(var\(--menu-title-flow-offset\)\s*-\s*0\.125rem\);[^}]*left:\s*0\.28rem;[^}]*transform:\s*scaleX\(1\.14\);/s,
    )
    expect(globalCss).toMatch(
      /\.menu-scene__intro\s*\{[^}]*margin:\s*calc\(clamp\(1\.25rem,\s*1\.45vw,\s*1\.75rem\)\s*\+\s*var\(--menu-title-flow-offset\)\)\s*0\s*0\s*11\.82%;/s,
    )
    expect(globalCss).toMatch(
      /\.menu-scene__carousel\s*\{[^}]*margin-top:\s*clamp\(0\.75rem,\s*0\.72vw,\s*0\.9rem\);/s,
    )
    expect(globalCss).toMatch(
      /\.menu-scene \.menu-carousel__track\s*\{[^}]*padding:\s*0\.72rem 7\.65% 0\.55rem;/s,
    )
    expect(globalCss).toMatch(
      /\.menu-scene \.menu-card__art\s*\{[^}]*aspect-ratio:\s*1\.325 \/ 1;/s,
    )
    expect(globalCss).toMatch(
      /\.menu-scene \.menu-card__body\s*\{[^}]*min-height:\s*clamp\(5\.8rem,\s*6vw,\s*7\.2rem\);/s,
    )
    expect(globalCss).toMatch(
      /\.menu-scene \.menu-carousel__control\s*\{[^}]*border-radius:\s*50%;/s,
    )
    expect(globalCss).toMatch(
      /@media \(max-width:\s*1023px\)[\s\S]*?\.menu-scene \.menu-scene__title-line,\s*\.menu-scene \.menu-scene__title-initial\s*\{[^}]*transform:\s*none;/,
    )
    expect(globalCss).toMatch(
      /\.menu-scene \.menu-carousel__track\s*\{[^}]*grid-auto-columns:\s*minmax\(16rem,\s*82vw\);/s,
    )
  })
})
