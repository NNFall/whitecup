import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { createElement } from 'react'

import { StickyNav } from '../components/StickyNav'

const navigationModules = import.meta.glob<string>('./navigation-polish*.css', {
  eager: true,
  import: 'default',
  query: '?raw',
})

const navigationCss = (Object.values(navigationModules)[0] ?? '').replace(/\r\n?/g, '\n')

const setHash = (hash: string) => {
  window.history.replaceState(null, '', hash || '/')
}

function declarationsFor(selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = navigationCss.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`))

  return match?.[1] ?? ''
}

describe('stable White Cup navigation polish', () => {
  afterEach(() => {
    document.body.style.overflow = ''
    setHash('')
  })

  it.each([
    ['#hero', 'reference'],
    ['#menu', 'compact'],
  ] as const)('keeps a full-bleed desktop rail at the viewport edge for the %s profile', (hash, profile) => {
    const shell = declarationsFor(
      ".site-nav__desktop-shell:is([data-nav-profile='reference'], [data-nav-profile='compact'])",
    )

    expect(shell).toMatch(/position:\s*relative(?:\s*!important)?;/)
    expect(shell).toMatch(/top:\s*0(?:\s*!important)?;/)
    expect(shell).toMatch(/width:\s*100%(?:\s*!important)?;/)
    expect(shell).toMatch(/max-width:\s*none(?:\s*!important)?;/)
    expect(shell).toMatch(/min-height:\s*4rem(?:\s*!important)?;/)
    expect(shell).toMatch(/margin-inline:\s*0(?:\s*!important)?;/)
    expect(navigationCss).not.toMatch(/translateX\s*\(/)

    setHash(hash)
    render(createElement(StickyNav))

    const header = screen.getByRole('banner')
    expect(header.querySelectorAll('.site-nav__desktop-shell')).toHaveLength(1)
    expect(header).toHaveAttribute('data-nav-profile', profile)
  })

  it('uses a readable translucent paper veil and transitions only scroll-safe visual properties', () => {
    const shell = declarationsFor(
      ".site-nav__desktop-shell:is([data-nav-profile='reference'], [data-nav-profile='compact'])",
    )

    expect(shell).toMatch(
      /background:\s*linear-gradient\(/,
    )
    expect(shell).toMatch(/color-mix\(in oklch,\s*var\(--paper-light\)\s+82%,\s*transparent\)/)
    expect(shell).toMatch(/color:\s*var\(--ink\);/)
    expect(shell).toMatch(
      /transition:[\s\S]*opacity[\s\S]*background-color[\s\S]*box-shadow[\s\S]*transform/,
    )
    expect(shell).not.toMatch(
      /transition:[^;]*(?:width|height|min-height|max-height|padding|margin|gap|inset|top|right|bottom|left)/,
    )
  })

  it('keeps the scrolled rail visually light while preserving a translucent scene connection', () => {
    const compact = declarationsFor(
      ".site-nav__desktop-shell[data-nav-profile='compact']",
    )

    expect(compact).toMatch(/opacity:\s*1(?:\s*!important)?;/)
    expect(compact).toMatch(
      /background-color:\s*color-mix\(in oklch,\s*var\(--paper-light\)\s+88%,\s*transparent\);/,
    )
    expect(compact).toMatch(
      /border-bottom-color:\s*color-mix\(in oklch,\s*var\(--line\)\s+34%,\s*transparent\);/,
    )
    expect(compact).toMatch(/box-shadow:\s*0\s+0\.25rem\s+0\.85rem\s+rgb\(18 17 15 \/ 0\.075\);/)
    expect(compact).not.toMatch(/background-color:\s*var\(--paper-light\);/)
  })

  it('keeps the desktop rail readable over photo and scene-copy layers without restoring a hard card', () => {
    const shell = declarationsFor(
      ".site-nav__desktop-shell:is([data-nav-profile='reference'], [data-nav-profile='compact'])",
    )
    const compact = declarationsFor(
      ".site-nav__desktop-shell[data-nav-profile='compact']",
    )

    expect(shell).toMatch(/background:\s*linear-gradient\(/)
    expect(compact).toMatch(/background-color:\s*color-mix\(/)
    expect(compact).not.toMatch(/background-color:\s*var\(--paper-light\);/)
  })

  it('suppresses the legacy polygon veil on both desktop profiles', () => {
    const desktopVeil = declarationsFor(
      ".site-nav__desktop-shell:is([data-nav-profile='reference'], [data-nav-profile='compact'])::before",
    )

    expect(desktopVeil).toMatch(/content:\s*none\s*!important;/)
    expect(desktopVeil).not.toMatch(/clip-path:/)
  })

  it('gives the fixed mobile header a stable paper surface so scene copy cannot ghost through', () => {
    const mobileShell = declarationsFor('.site-nav__mobile')

    expect(navigationCss).toMatch(
      /@media\s*\(max-width:\s*1023px\)[\s\S]*\.site-nav\s*\{[^}]*background:\s*var\(--paper-light\)\s*!important;/,
    )
    expect(mobileShell).toMatch(/background:\s*var\(--paper-light\);/)
    expect(mobileShell).toMatch(/border-bottom:\s*1px\s+solid/)
  })

  it('keeps scene anchors below the fixed rail with one content-safe offset', () => {
    expect(navigationCss).toMatch(
      /html\s*\{[^}]*scroll-padding-top:\s*var\(--anchor-header-offset\)(?:\s*!important)?;/,
    )
    expect(navigationCss).not.toMatch(/\.scene\s*\{[^}]*scroll-margin-top:/)
  })

  it('caps the desktop badge while preserving the compact mobile header width', () => {
    const desktopBrand = declarationsFor(
      ".site-nav__desktop-shell:is([data-nav-profile='reference'], [data-nav-profile='compact'])\n    .site-nav__desktop-brand",
    )

    expect(navigationCss).toMatch(
      /\.site-nav__desktop-shell:is\(\[data-nav-profile='reference'\],\s*\[data-nav-profile='compact'\]\)[\s\S]*\.site-nav__desktop-brand\s*\{/,
    )
    expect(desktopBrand).toMatch(/max-width:\s*3\.25rem/)
    expect(navigationCss).toMatch(
      /@media\s*\(max-width:\s*1023px\)[\s\S]*\.site-nav__mobile\s*\{[^}]*width:\s*min\(calc\(100% - 2rem\),\s*42rem\)(?:\s*!important)?;/,
    )
    expect(navigationCss).toMatch(
      /@media\s*\(max-width:\s*1023px\)[\s\S]*\.site-nav__mobile-brand\s*\{[^}]*width:\s*3rem(?:\s*!important)?;/,
    )
    expect(navigationCss).toMatch(
      /@media\s*\(max-width:\s*1023px\)[\s\S]*\.site-nav__mobile-brand \.brand-mark--badge\s*\{[^}]*width:\s*3rem(?:\s*!important)?;/,
    )
  })

  it('keeps the mobile dialog focus trap and Escape return behavior intact', () => {
    render(createElement(StickyNav))

    const trigger = screen.getByRole('button', { name: /открыть меню/i })
    trigger.focus()
    fireEvent.click(trigger)

    const dialog = screen.getByRole('dialog', { name: /меню сайта/i })
    const closeButton = within(dialog).getByRole('button', { name: 'Закрыть меню' })
    const links = within(dialog).getAllByRole('link')
    expect(dialog).toBeVisible()
    expect(closeButton).toHaveClass('mobile-nav__close')
    expect(document.activeElement).toBe(closeButton)

    links.at(-1)?.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(closeButton)

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' })
    })

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(document.activeElement).toBe(trigger)
  })

  it('gives the mobile dialog a clear 44px close target', () => {
    const close = declarationsFor('.mobile-nav__close')

    expect(close).toMatch(/width:\s*2\.75rem;/)
    expect(close).toMatch(/min-width:\s*2\.75rem;/)
    expect(close).toMatch(/height:\s*2\.75rem;/)
    expect(close).toMatch(/min-height:\s*2\.75rem;/)
    expect(navigationCss).toMatch(/\.mobile-nav__close-icon\s+span:first-child\s*\{[^}]*rotate\(45deg\)/)
    expect(navigationCss).toMatch(/\.mobile-nav__close-icon\s+span:last-child\s*\{[^}]*rotate\(-45deg\)/)
  })

  it('removes close-button motion when reduced motion is requested', () => {
    expect(navigationCss).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.mobile-nav__close[\s\S]*transition:\s*none\s*!important;[\s\S]*transform:\s*none\s*!important;/,
    )
  })
})
