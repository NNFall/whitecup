import { siteData } from './data/site'

export default function App() {
  return (
    <main className="app-shell" aria-labelledby="app-title">
      <p className="eyebrow">{siteData.brandName}</p>
      <h1 id="app-title">{siteData.tagline}</h1>
      <p className="app-shell__intro">
        Кофе, завтраки и место, в которое хочется возвращаться.
      </p>
      <a className="button-link" href={siteData.menuUrl}>
        Открыть меню
      </a>
    </main>
  )
}
