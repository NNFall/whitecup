import { useCallback, useEffect, useRef, useState } from 'react'

import { BrandMark } from './BrandMark'

export const sceneIds = ['hero', 'menu', 'about', 'locations', 'contact'] as const

export type SceneId = (typeof sceneIds)[number]

interface NavItem {
  href: `#${Exclude<SceneId, 'hero'>}`
  label: string
}

const navItems: readonly NavItem[] = [
  { href: '#menu', label: 'Меню' },
  { href: '#about', label: 'Атмосфера' },
  { href: '#locations', label: 'Адреса' },
  { href: '#contact', label: 'Контакты' },
]

const focusableSelector = '.mobile-nav__panel a[href], .mobile-nav__panel button:not([disabled])'

function sceneFromHash(hash: string): SceneId | undefined {
  const candidate = hash.replace(/^#/, '')
  return sceneIds.find((scene) => scene === candidate)
}

function sceneFromViewport(): SceneId | undefined {
  const documentHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  )

  if (
    documentHeight > window.innerHeight &&
    window.scrollY + window.innerHeight >= documentHeight - 2
  ) {
    return 'contact'
  }

  const anchor = window.innerHeight * 0.34
  const scenes = sceneIds
    .map((id) => document.getElementById(id))
    .filter((scene): scene is HTMLElement => scene !== null)

  const sceneAtAnchor = scenes.find((scene) => {
    const rect = scene.getBoundingClientRect()
    return rect.top <= anchor && rect.bottom > anchor
  })

  if (sceneAtAnchor) {
    return sceneAtAnchor.id as SceneId
  }

  return scenes
    .filter((scene) => scene.getBoundingClientRect().top <= anchor)
    .at(-1)?.id as SceneId | undefined
}

function currentScene(): SceneId {
  return sceneFromHash(window.location.hash) ?? sceneFromViewport() ?? 'hero'
}

interface NavigationLinksProps {
  activeScene: SceneId
  onLinkClick?: () => void
}

function NavigationLinks({ activeScene, onLinkClick }: NavigationLinksProps) {
  const currentFor = (href: NavItem['href']) =>
    href === `#${activeScene}` ? ('location' as const) : undefined

  return (
    <ul>
      {navItems.map((item) => (
        <li key={item.href}>
          <a href={item.href} aria-current={currentFor(item.href)} onClick={onLinkClick}>
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

export function StickyNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeScene, setActiveScene] = useState<SceneId>(() => currentScene())
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    const updateFromViewport = () => {
      const scene = sceneFromViewport()
      if (scene) {
        setActiveScene(scene)
      }
    }

    const updateFromHash = () => {
      setActiveScene(sceneFromHash(window.location.hash) ?? sceneFromViewport() ?? 'hero')
    }

    const handleResize = () => {
      updateFromViewport()
      if (window.innerWidth >= 768) setIsOpen(false)
    }

    updateFromHash()
    window.addEventListener('scroll', updateFromViewport, { passive: true })
    window.addEventListener('resize', handleResize)
    window.addEventListener('hashchange', updateFromHash)

    return () => {
      window.removeEventListener('scroll', updateFromViewport)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('hashchange', updateFromHash)
    }
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

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      )

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
    dialogRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeMenu, isOpen])

  const handleMobileLinkClick = () => {
    closeMenu()
  }

  return (
    <header className="site-nav" data-active-scene={activeScene} data-menu-open={isOpen}>
      <div className="site-nav__desktop-shell">
        <a
          className="site-nav__desktop-brand"
          href="#hero"
          aria-current={activeScene === 'hero' ? 'location' : undefined}
          aria-label="White Cup — на главную"
        >
          <BrandMark variant="badge" />
        </a>

        <nav className="site-nav__desktop" aria-label="Основная навигация">
          <NavigationLinks activeScene={activeScene} />
        </nav>

        <a className="button-link button-link--primary site-nav__desktop-action" href="#locations">
          Зайти на кофе
        </a>
      </div>

      <div className="site-nav__mobile">
        <a
          className="site-nav__mobile-brand"
          href="#hero"
          aria-current={activeScene === 'hero' ? 'location' : undefined}
          aria-label="White Cup — на главную"
        >
          <span aria-hidden="true">
            <BrandMark variant="badge" />
          </span>
        </a>

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
        <button
          className="mobile-nav__backdrop"
          type="button"
          tabIndex={-1}
          aria-label="Закрыть меню по фону"
          onClick={closeMenu}
        />
        <div className="mobile-nav__panel">
          <button
            className="mobile-nav__close"
            type="button"
            aria-label="Закрыть меню"
            onClick={closeMenu}
          >
            <span className="mobile-nav__close-icon" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
          <p className="mobile-nav__kicker">White Cup / Самара</p>
          <nav aria-label="Навигация по странице">
            <NavigationLinks activeScene={activeScene} onLinkClick={handleMobileLinkClick} />
          </nav>
          <a
            className="button-link button-link--primary mobile-nav__action"
            href="#locations"
            onClick={handleMobileLinkClick}
          >
            Зайти на кофе
          </a>
        </div>
      </div>
    </header>
  )
}
