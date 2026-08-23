import { fireEvent, render, screen, within } from '@testing-library/react'

import { StickyNav } from './StickyNav'

describe('StickyNav', () => {
  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('exposes the primary section anchors', () => {
    render(<StickyNav />)

    expect(screen.getAllByRole('link', { name: /меню/i }).some((link) => link.getAttribute('href') === '#menu')).toBe(true)
    expect(screen.getAllByRole('link', { name: /^о нас$/i }).some((link) => link.getAttribute('href') === '#about')).toBe(true)
    expect(screen.getAllByRole('link', { name: /мероприятия/i }).some((link) => link.getAttribute('href') === '#events')).toBe(true)
    expect(screen.getAllByRole('link', { name: /локации/i }).some((link) => link.getAttribute('href') === '#locations')).toBe(true)
  })

  it('opens the mobile overlay, locks the body and returns focus on Escape', () => {
    render(<StickyNav />)

    const trigger = screen.getByRole('button', { name: /открыть меню/i })
    trigger.focus()
    fireEvent.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('dialog', { name: /меню сайта/i })).toBeVisible()
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.activeElement).toHaveAttribute('href', '#menu')

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
})
