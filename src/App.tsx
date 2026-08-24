import { useLayoutEffect } from 'react'

import { StickyNav } from './components/StickyNav'
import { Footer } from './components/Footer'
import { AboutSection } from './sections/AboutSection'
import { EventsSection } from './sections/EventsSection'
import { HeroSection } from './sections/HeroSection'
import { LocationsSection } from './sections/LocationsSection'
import { MenuSection } from './sections/MenuSection'
import { VisitSection } from './sections/VisitSection'

export default function App() {
  useLayoutEffect(() => {
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

    alignHashTarget()
    window.addEventListener('hashchange', alignHashTarget)

    return () => window.removeEventListener('hashchange', alignHashTarget)
  }, [])

  return (
    <div className="site-shell">
      <StickyNav />
      <main className="app-shell">
        <HeroSection />

        <MenuSection />

        <AboutSection />
        <VisitSection />
        <EventsSection />
        <LocationsSection />
      </main>
      <Footer />
    </div>
  )
}
