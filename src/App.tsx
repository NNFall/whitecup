import { StickyNav } from './components/StickyNav'
import { AboutSection } from './sections/AboutSection'
import { EventsSection } from './sections/EventsSection'
import { HeroSection } from './sections/HeroSection'
import { LocationsSection } from './sections/LocationsSection'
import { MenuSection } from './sections/MenuSection'
import { VisitSection } from './sections/VisitSection'

export default function App() {
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
    </div>
  )
}
