import { siteData } from './data/site'
import { StickyNav } from './components/StickyNav'
import { AboutSection } from './sections/AboutSection'
import { EventsSection } from './sections/EventsSection'
import { HeroSection } from './sections/HeroSection'
import { LocationsSection } from './sections/LocationsSection'
import { VisitSection } from './sections/VisitSection'

export default function App() {
  return (
    <div className="site-shell">
      <StickyNav />
      <main className="app-shell">
        <HeroSection />

        {/* Task 4 replaces this short anchor-compatible placeholder with the menu carousel. */}
        <section className="scene menu-placeholder" id="menu" aria-labelledby="menu-title" data-scene="menu">
          <div className="menu-placeholder__inner">
            <p className="scene-kicker">01 / Что попробовать</p>
            <h2 id="menu-title">Меню</h2>
            <a className="text-link text-link--arrow" href={siteData.menuUrl} target="_blank" rel="noreferrer">
              Открыть полное меню в Яндекс Картах <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <AboutSection />
        <VisitSection />
        <EventsSection />
        <LocationsSection />
      </main>
    </div>
  )
}
