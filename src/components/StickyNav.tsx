import { useCallback, useEffect, useRef, useState } from 'react'

import { BrandMark } from './BrandMark'
import '../styles/navigation-polish.css'

interface NavItem {
  href: `#${SceneId}`
  label: string
}

export const sceneIds = [
  'hero',
  'menu',
  'about',
  'visit',
  'events',
  'locations',
  'contact',
] as const

export type SceneId = (typeof sceneIds)[number]
export type NavProfile = 'reference' | 'compact'

const navProfileByScene: Record<SceneId, NavProfile> = {
  hero: 'reference',
  menu: 'compact',
  about: 'compact',
  visit: 'compact',
  events: 'compact',
  locations: 'compact',
  contact: 'compact',
}

const navItems: NavItem[] = [
  { href: '#menu', label: 'Меню' },
  { href: '#locations', label: 'Локации' },
  { href: '#about', label: 'О нас' },
  { href: '#events', label: 'Мероприятия' },
  { href: '#contact', label: 'Контакты' },
]

const focusableSelector = '.mobile-nav__panel a[href], .mobile-nav__panel button:not([disabled])'

export function getNavProfile(scene: SceneId): NavProfile {
  return navProfileByScene[scene]
}

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

  const anchor = window.innerHeight * 0.32
  const scenes = sceneIds
    .map((id) => document.getElementById(id))
    .filter((scene): scene is HTMLElement => scene !== null)

  return (
    scenes.find((scene) => {
      const rect = scene.getBoundingClientRect()
      return rect.top <= anchor && rect.bottom > anchor
    })?.id as SceneId | undefined
  )
}

function currentScene(): SceneId {
  return sceneFromHash(window.location.hash) ?? sceneFromViewport() ?? 'hero'
}

interface DesktopNavigationProps {
  activeScene: SceneId
  profile: NavProfile
}

function DesktopNavigation({ activeScene, profile }: DesktopNavigationProps) {
  const currentFor = (href: NavItem['href']) =>
    href === `#${activeScene}` ? ('location' as const) : undefined

  return (
    <div className="site-nav__desktop-shell" data-nav-profile={profile}>
      <a
        className="site-nav__desktop-brand"
        href="#hero"
        aria-current={activeScene === 'hero' ? 'location' : undefined}
        aria-label="White Cup — на главную"
      >
        <BrandMark variant="badge" />
      </a>

      <nav className="site-nav__desktop" aria-label="Основная навигация">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} aria-current={currentFor(item.href)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export function StickyNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeScene, setActiveScene] = useState<SceneId>(() => currentScene())
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 24)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const profile = activeScene === 'hero' && !isScrolled ? getNavProfile(activeScene) : 'compact'

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    const updateFromViewport = () => {
      setIsScrolled(window.scrollY > 24)
      const scene = sceneFromViewport()
      if (scene) {
        setActiveScene(scene)
      }
    }

    const updateFromHash = () => {
      setIsScrolled(window.scrollY > 24)
      setActiveScene(sceneFromHash(window.location.hash) ?? sceneFromViewport() ?? 'hero')
    }

    updateFromHash()
    window.addEventListener('scroll', updateFromViewport, { passive: true })
    window.addEventListener('resize', updateFromViewport)
    window.addEventListener('hashchange', updateFromHash)

    return () => {
      window.removeEventListener('scroll', updateFromViewport)
      window.removeEventListener('resize', updateFromViewport)
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
    dialogRef.current?.querySelector<HTMLElement>('.mobile-nav__panel a[href]')?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeMenu, isOpen])

  const handleMobileLinkClick = () => {
    closeMenu()
  }

  const currentFor = (href: NavItem['href']) =>
    href === `#${activeScene}` ? ('location' as const) : undefined

  return (
    <header
      className="site-nav"
      data-active-scene={activeScene}
      data-menu-open={isOpen}
      data-nav-profile={profile}
    >
      <DesktopNavigation activeScene={activeScene} profile={profile} />

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
          aria-label="Закрыть меню"
          onClick={closeMenu}
        />
        <div className="mobile-nav__panel">
          <p className="mobile-nav__kicker">White Cup / Самара</p>
          <nav aria-label="Навигация по странице">
            <ul>
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={currentFor(item.href)}
                    onClick={handleMobileLinkClick}
                  >
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
