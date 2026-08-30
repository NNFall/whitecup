import { useLayoutEffect } from 'react'

import { StickyNav } from './components/StickyNav'
import { Footer } from './components/Footer'
import { SceneBridge } from './components/SceneBridge'
import { AboutSection } from './sections/AboutSection'
import { EventsSection } from './sections/EventsSection'
import { HeroSection } from './sections/HeroSection'
import { LocationsSection } from './sections/LocationsSection'
import { MenuSection } from './sections/MenuSection'
import { VisitSection } from './sections/VisitSection'

const HASH_NAVIGATION_KEYS = new Set([
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'End',
  'Home',
  'PageDown',
  'PageUp',
  ' ',
])

export default function App() {
  useLayoutEffect(() => {
    let pendingAlignment: number | undefined

    const cancelPendingAlignment = () => {
      if (pendingAlignment === undefined) return

      window.clearTimeout(pendingAlignment)
      pendingAlignment = undefined
    }

    const alignHashTarget = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (!id) {
        return
      }

      const target = document.getElementById(id)
      if (!target) {
        return
      }

      const root = document.documentElement
      const previousScrollBehavior = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'
      target.scrollIntoView?.({ block: 'start', behavior: 'auto' })
      root.style.scrollBehavior = previousScrollBehavior
    }

    const alignAfterLayoutSettles = () => {
      cancelPendingAlignment()
      alignHashTarget()

      /* Reference scenes keep their artboards in flow, but responsive image
       * selection can settle after the first layout pass. Re-align only the
       * active deep link once that media/layout pass has had a chance to
       * finish; ordinary scrolling is never touched. */
      pendingAlignment = window.setTimeout(() => {
        pendingAlignment = undefined
        alignHashTarget()
      }, 1_200)
    }

    const handleNavigationIntent = () => {
      cancelPendingAlignment()
    }

    const handleNavigationKey = (event: KeyboardEvent) => {
      if (HASH_NAVIGATION_KEYS.has(event.key)) {
        cancelPendingAlignment()
      }
    }

    const intentOptions: AddEventListenerOptions = { capture: true, passive: true }

    alignAfterLayoutSettles()
    window.addEventListener('hashchange', alignAfterLayoutSettles)
    window.addEventListener('wheel', handleNavigationIntent, intentOptions)
    window.addEventListener('touchstart', handleNavigationIntent, intentOptions)
    window.addEventListener('pointerdown', handleNavigationIntent, intentOptions)
    window.addEventListener('keydown', handleNavigationKey, true)

    return () => {
      window.removeEventListener('hashchange', alignAfterLayoutSettles)
      window.removeEventListener('wheel', handleNavigationIntent, intentOptions)
      window.removeEventListener('touchstart', handleNavigationIntent, intentOptions)
      window.removeEventListener('pointerdown', handleNavigationIntent, intentOptions)
      window.removeEventListener('keydown', handleNavigationKey, true)
      cancelPendingAlignment()
    }
  }, [])

  return (
    <div className="site-shell">
      <StickyNav />
      <main className="app-shell">
        <HeroSection />
        <SceneBridge from="hero" to="menu" />
        <MenuSection />
        <SceneBridge from="menu" to="about" />
        <AboutSection />
        <SceneBridge from="about" to="visit" />
        <VisitSection />
        <SceneBridge from="visit" to="events" />
        <EventsSection />
        <SceneBridge from="events" to="locations" />
        <LocationsSection />
      </main>
      <Footer />
    </div>
  )
}
