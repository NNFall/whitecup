import { render, screen, within } from '@testing-library/react'

import { MenuSection } from './MenuSection'
import globalCss from '../styles/global.css?raw'

describe('Menu reference visual contract', () => {
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
    expect(fullMenuLink).toHaveTextContent('листайте')
    expect(fullMenuLink).toHaveAccessibleName(/листайте.*открыть полное меню в яндекс картах/i)
    const noteCopy = menu?.querySelector('.menu-carousel__note-copy')
    expect(noteCopy).toBeInTheDocument()
    expect(noteCopy).toHaveTextContent(/листайте, чтобы увидеть больше!/i)

    expect(menu?.querySelector('.menu-card__price')).not.toBeInTheDocument()
    const facts = menu?.querySelectorAll('.menu-card__facts') ?? []
    expect(facts).toHaveLength(5)
    expect(facts[0]).toHaveTextContent('270–320 ₽')
    expect([...facts].slice(1).every((fact) => /актуальная цена — в меню/i.test(fact.textContent ?? ''))).toBe(true)
  })

  it('adds decorative edge slivers without changing the five-item accessible carousel', () => {
    const { container } = render(<MenuSection />)
    const menu = container.querySelector<HTMLElement>('#menu')
    const carousel = within(menu as HTMLElement).getByRole('region', {
      name: /избранное меню white cup/i,
    })

    expect(within(carousel).getAllByRole('listitem')).toHaveLength(5)

    const slivers = carousel.querySelectorAll<HTMLElement>('[data-menu-sliver]')
    expect(slivers).toHaveLength(2)
    slivers.forEach((sliver) => {
      expect(sliver).toHaveAttribute('aria-hidden', 'true')
      expect(sliver.closest('ul')).toBeNull()
      expect(sliver.querySelector('img')).toHaveAttribute('alt', '')
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
