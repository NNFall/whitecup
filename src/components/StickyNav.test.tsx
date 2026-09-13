import { act, fireEvent, render, screen, within } from '@testing-library/react'

import { sceneIds, StickyNav } from './StickyNav'

const setHash = (hash: string) => {
  window.history.replaceState(null, '', hash || '/')
}

describe('StickyNav', () => {
  afterEach(() => {
    document.body.style.overflow = ''
    setHash('')
  })

  it('exposes the current page flow through the desktop navigation', () => {
    setHash('#about')
    render(<StickyNav />)

    const header = screen.getByRole('banner')
    const navigation = within(header).getByRole('navigation', { name: 'Основная навигация' })

    expect(sceneIds).toEqual(['hero', 'menu', 'about', 'locations', 'contact'])
    expect(within(navigation).getAllByRole('link')).toHaveLength(4)
    expect(within(navigation).getByRole('link', { name: 'Меню' })).toHaveAttribute('href', '#menu')
    expect(within(navigation).getByRole('link', { name: 'Атмосфера' })).toHaveAttribute('href', '#about')
    expect(within(navigation).getByRole('link', { name: 'Адреса' })).toHaveAttribute('href', '#locations')
    expect(within(navigation).getByRole('link', { name: 'Контакты' })).toHaveAttribute('href', '#contact')
    expect(within(header).getByRole('link', { name: 'Зайти на кофе' })).toHaveAttribute(
      'href',
      '#locations',
    )
    expect(within(navigation).getByRole('link', { name: 'Атмосфера' })).toHaveAttribute(
      'aria-current',
      'location',
    )
  })

  it('updates the active section when the hash changes', () => {
    setHash('#menu')
    render(<StickyNav />)

    const header = screen.getByRole('banner')
    expect(header).toHaveAttribute('data-active-scene', 'menu')

    act(() => {
      setHash('#locations')
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })

    expect(header).toHaveAttribute('data-active-scene', 'locations')
    expect(within(header).getByRole('link', { name: 'Адреса' })).toHaveAttribute(
      'aria-current',
      'location',
    )
  })

  it('updates the active section from actual viewport positions', () => {
    setHash('')
    render(
      <>
        <StickyNav />
        <section id="hero" />
        <section id="menu" />
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
  })

  it('opens the mobile dialog, traps focus and returns focus on Escape', () => {
    render(<StickyNav />)

    const trigger = screen.getByRole('button', { name: /открыть меню/i })
    trigger.focus()
    fireEvent.click(trigger)

    const dialog = screen.getByRole('dialog', { name: /меню сайта/i })
    const closeButton = within(dialog).getByRole('button', { name: 'Закрыть меню' })
    const links = within(dialog).getAllByRole('link')

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(dialog).toBeVisible()
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.activeElement).toBe(closeButton)

    links.at(-1)?.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(closeButton)

    closeButton.focus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(links.at(-1))

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(dialog).toHaveAttribute('hidden')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(trigger)
  })

  it('closes after activating a mobile link or the backdrop', () => {
    render(<StickyNav />)

    const trigger = screen.getByRole('button', { name: /открыть меню/i })
    fireEvent.click(trigger)
    const dialog = screen.getByRole('dialog', { name: /меню сайта/i })
    fireEvent.click(within(dialog).getByRole('link', { name: 'Адреса' }))
    expect(dialog).toHaveAttribute('hidden')

    fireEvent.click(trigger)
    const reopenedDialog = screen.getByRole('dialog', { name: /меню сайта/i })
    fireEvent.click(within(reopenedDialog).getByRole('button', { name: 'Закрыть меню по фону' }))
    expect(reopenedDialog).toHaveAttribute('hidden')
  })

  it('restores body scrolling when an open menu unmounts', () => {
    const { unmount } = render(<StickyNav />)

    fireEvent.click(screen.getByRole('button', { name: /открыть меню/i }))
    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('')
  })
})
