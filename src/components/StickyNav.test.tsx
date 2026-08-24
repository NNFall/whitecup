import { act, fireEvent, render, screen, within } from '@testing-library/react'

import { getNavProfile, StickyNav } from './StickyNav'

const setHash = (hash: string) => {
  window.history.replaceState(null, '', hash || '/')
}

describe('StickyNav', () => {
  afterEach(() => {
    document.body.style.overflow = ''
    setHash('')
  })

  it.each([
    ['hero', 'full'],
    ['menu', 'compact-brand'],
    ['about', 'brand-only'],
    ['visit', 'hidden'],
    ['events', 'full'],
    ['locations', 'full'],
    ['contact', 'utility'],
  ] as const)('maps the %s scene to the %s reference profile', (scene, profile) => {
    expect(getNavProfile(scene)).toBe(profile)
  })

  it('uses the exact compact reference logo and omits desktop links in the menu scene', () => {
    setHash('#menu')
    render(<StickyNav />)

    const header = screen.getByRole('banner')
    expect(header).toHaveAttribute('data-active-scene', 'menu')
    expect(header).toHaveAttribute('data-nav-profile', 'compact-brand')
    expect(within(header).getByRole('img', { name: /white cup/i })).toHaveAttribute(
      'src',
      '/media/menu-logo-reference-crop.png',
    )
    expect(within(header).queryByRole('navigation', { name: 'Основная навигация' })).not.toBeInTheDocument()
  })

  it('switches profile and current link when the hash changes', () => {
    setHash('#hero')
    render(<StickyNav />)

    const header = screen.getByRole('banner')
    expect(header).toHaveAttribute('data-nav-profile', 'full')

    act(() => {
      setHash('#events')
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })

    expect(header).toHaveAttribute('data-active-scene', 'events')
    expect(within(header).getByRole('link', { name: 'Мероприятия' })).toHaveAttribute(
      'aria-current',
      'location',
    )

    act(() => {
      setHash('#locations')
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })

    expect(header).toHaveAttribute('data-active-scene', 'locations')
    expect(within(header).getByRole('link', { name: 'Локации' })).toHaveAttribute(
      'aria-current',
      'location',
    )
  })

  it('updates from actual viewport position while scrolling', () => {
    setHash('')
    render(
      <>
        <StickyNav />
        <section id="hero" data-scene="hero" />
        <section id="menu" data-scene="menu" />
      </>,
    )

    const hero = document.getElementById('hero') as HTMLElement
    const menu = document.getElementById('menu') as HTMLElement
    vi.spyOn(hero, 'getBoundingClientRect').mockReturnValue({
      top: -900,
      bottom: 100,
      left: 0,
      right: 100,
      width: 100,
      height: 1000,
      x: 0,
      y: -900,
      toJSON: () => ({}),
    })
    vi.spyOn(menu, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 1100,
      left: 0,
      right: 100,
      width: 100,
      height: 1000,
      x: 0,
      y: 100,
      toJSON: () => ({}),
    })

    fireEvent.scroll(window)

    expect(screen.getByRole('banner')).toHaveAttribute('data-active-scene', 'menu')
    expect(screen.getByRole('banner')).toHaveAttribute('data-nav-profile', 'compact-brand')
  })

  it('activates the footer utility profile at the natural end of the document', () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(1500)
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1000)
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(2500)

    render(<StickyNav />)

    expect(screen.getByRole('banner')).toHaveAttribute('data-active-scene', 'contact')
    expect(screen.getByRole('banner')).toHaveAttribute('data-nav-profile', 'utility')
  })

  it('opens the mobile overlay, traps focus and returns focus on Escape', () => {
    render(<StickyNav />)

    const trigger = screen.getByRole('button', { name: /открыть меню/i })
    trigger.focus()
    fireEvent.click(trigger)

    const dialog = screen.getByRole('dialog', { name: /меню сайта/i })
    const links = within(dialog).getAllByRole('link')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(dialog).toBeVisible()
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.activeElement).toBe(links[0])

    links.at(-1)?.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(links[0])

    links[0].focus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(links.at(-1))

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(trigger)
  })

  it('closes after activating a mobile link', () => {
    render(<StickyNav />)

    const trigger = screen.getByRole('button', { name: /открыть меню/i })
    fireEvent.click(trigger)
    const mobileMenu = screen.getByRole('dialog', { name: /меню сайта/i })
    fireEvent.click(within(mobileMenu).getByRole('link', { name: /локации/i }))

    expect(mobileMenu).toHaveAttribute('hidden')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('restores body scrolling when an open menu unmounts', () => {
    const { unmount } = render(<StickyNav />)

    fireEvent.click(screen.getByRole('button', { name: /открыть меню/i }))
    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('')
  })
})
