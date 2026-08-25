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
    ['hero', 'reference'],
    ['menu', 'compact'],
    ['about', 'compact'],
    ['visit', 'compact'],
    ['events', 'compact'],
    ['locations', 'compact'],
    ['contact', 'compact'],
  ] as const)('maps the %s scene to the %s continuous navigation mode', (scene, profile) => {
    expect(getNavProfile(scene)).toBe(profile)
  })

  it('keeps a compact, fully linked rail after the hero instead of removing desktop navigation', () => {
    setHash('#menu')
    render(<StickyNav />)

    const header = screen.getByRole('banner')
    expect(header).toHaveAttribute('data-active-scene', 'menu')
    expect(header).toHaveAttribute('data-nav-profile', 'compact')
    expect(within(header).getByRole('img', { name: /white cup/i })).toHaveAttribute(
      'src',
      '/media/hero-logo-reference.png',
    )
    expect(within(header).getByRole('navigation', { name: 'Основная навигация' })).toBeInTheDocument()
  })

  it('switches profile and current link when the hash changes', () => {
    setHash('#hero')
    render(<StickyNav />)

    const header = screen.getByRole('banner')
    expect(header).toHaveAttribute('data-nav-profile', 'reference')

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

  it('collapses the oversized hero header as soon as the visitor scrolls', () => {
    const scrollY = vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0)
    render(<StickyNav />)

    const header = screen.getByRole('banner')
    expect(header).toHaveAttribute('data-nav-profile', 'reference')

    scrollY.mockReturnValue(160)
    act(() => {
      fireEvent.scroll(window)
    })

    expect(header).toHaveAttribute('data-active-scene', 'hero')
    expect(header).toHaveAttribute('data-nav-profile', 'compact')
  })

  it('keeps one desktop navigation tree and preserves its focused link across a profile change', () => {
    setHash('#hero')
    render(<StickyNav />)

    const menuLink = screen.getByRole('link', { name: 'Меню' })
    menuLink.focus()

    act(() => {
      setHash('#menu')
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })

    expect(document.querySelectorAll('nav[aria-label="Основная навигация"]')).toHaveLength(1)
    expect(document.activeElement).toBe(menuLink)
    expect(menuLink).toHaveAttribute('aria-current', 'location')
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
    expect(screen.getByRole('banner')).toHaveAttribute('data-nav-profile', 'compact')
  })

  it('keeps the compact navigation rail at the natural end of the document', () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(1500)
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1000)
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(2500)

    render(<StickyNav />)

    expect(screen.getByRole('banner')).toHaveAttribute('data-active-scene', 'contact')
    expect(screen.getByRole('banner')).toHaveAttribute('data-nav-profile', 'compact')
    expect(screen.getByRole('navigation', { name: 'Основная навигация' })).toBeInTheDocument()
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
