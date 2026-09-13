import { useLayoutEffect } from 'react'

import { StickyNav } from './components/StickyNav'
import { Footer } from './components/Footer'
import { AboutSection } from './sections/AboutSection'
import { HeroSection } from './sections/HeroSection'
import { LocationsSection } from './sections/LocationsSection'
import { MenuSection } from './sections/MenuSection'

export default function App() {
  useLayoutEffect(() => {
    // A direct section link may arrive before React has rendered its target.
    try {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (id) document.getElementById(id)?.scrollIntoView?.({ block: 'start', behavior: 'instant' })
    } catch {
      // A malformed fragment should never prevent the page from opening.
    }
  }, [])

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Перейти к содержимому</a>
      <StickyNav />
      <main id="main-content" className="app-shell" tabIndex={-1}>
        <HeroSection />
        <div className="welcome-strip" aria-label="White Cup в Самаре">
          <span>WHITE CUP · САМАРА</span>
          <p>Хороший кофе. <em>Ваше время.</em></p>
          <a href="#menu">Давайте знакомиться <span aria-hidden="true">↓</span></a>
        </div>
        <MenuSection />
        <AboutSection />
        <LocationsSection />
      </main>
      <Footer />
    </div>
  )
}
