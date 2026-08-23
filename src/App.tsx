import { siteData } from './data/site'
import { StickyNav } from './components/StickyNav'

export default function App() {
  return (
    <div className="site-shell">
      <StickyNav />
      <main className="app-shell" aria-labelledby="app-title">
        <section className="shell-placeholder shell-placeholder--hero" id="hero" aria-labelledby="app-title">
          <p className="eyebrow">{siteData.brandName}</p>
          <h1 id="app-title">{siteData.tagline}</h1>
          <p className="app-shell__intro">
            Кофе, завтраки и место, в которое хочется возвращаться.
          </p>
          <a className="button-link" href={siteData.menuUrl}>
            Открыть меню
          </a>
        </section>
        <section className="shell-placeholder" id="menu" aria-labelledby="menu-title">
          <h2 id="menu-title">Меню</h2>
        </section>
        <section className="shell-placeholder" id="about" aria-labelledby="about-title">
          <h2 id="about-title">О White Cup</h2>
        </section>
        <section className="shell-placeholder" id="events" aria-labelledby="events-title">
          <h2 id="events-title">События</h2>
        </section>
        <section className="shell-placeholder" id="locations" aria-labelledby="locations-title">
          <h2 id="locations-title">Адреса</h2>
        </section>
      </main>
    </div>
  )
}
