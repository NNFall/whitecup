import { useCallback, useEffect, useRef, useState } from 'react'

import { BrandMark } from './BrandMark'

interface NavItem {
  href: string
  label: string
}

const navItems: NavItem[] = [
  { href: '#menu', label: 'Меню' },
  { href: '#about', label: 'О White Cup' },
  { href: '#events', label: 'События' },
  { href: '#locations', label: 'Адреса' },
]

const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function StickyNav() {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return
      }

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector))
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // The backdrop is intentionally focusable for mouse/touch dismissal, but
    // opening the menu should place keyboard users on the first useful page
    // destination rather than on a close-only affordance.
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>('.mobile-nav__panel a[href]')
    firstFocusable?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeMenu, isOpen])

  const handleMobileLinkClick = () => {
    closeMenu()
  }

  return (
    <header className="site-nav" data-menu-open={isOpen}>
      <div className="site-nav__inner">
        <a className="site-nav__brand" href="#hero" aria-label="White Cup — на главную">
          <BrandMark />
        </a>

        <nav className="site-nav__desktop" aria-label="Основная навигация">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={triggerRef}
          className="site-nav__toggle"
          type="button"
          aria-controls="mobile-nav"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="site-nav__toggle-lines" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      <div
        ref={dialogRef}
        id="mobile-nav"
        className="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Меню сайта"
        hidden={!isOpen}
      >
        <button className="mobile-nav__backdrop" type="button" aria-label="Закрыть меню" onClick={closeMenu} />
        <div className="mobile-nav__panel">
          <p className="mobile-nav__kicker">White Cup / Самара</p>
          <nav aria-label="Навигация по странице">
            <ul>
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={handleMobileLinkClick}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="mobile-nav__action" href="#locations" onClick={handleMobileLinkClick}>
            Найти White Cup
          </a>
        </div>
      </div>
    </header>
  )
}
