import { MenuCarousel } from '../components/MenuCarousel'
import { Reveal } from '../components/Reveal'
import { siteData } from '../data/site'

export function MenuSection() {
  return (
    <section
      id="menu"
      className="scene section-frame menu-scene"
      aria-labelledby="menu-title"
      data-scene="menu"
    >
      <div className="section-inner section-frame__inner menu-section__inner">
        <header className="section-frame__heading menu-section__header">
          <p className="eyebrow">01 / МЕНЮ</p>
          <div className="menu-section__heading-row">
            <h2 id="menu-title" className="section-title">
              <span>Начните день</span>
              {' '}
              <span>со <em className="menu-section__accent">вкусного.</em></span>
            </h2>
            <div className="menu-section__intro">
              <p>Кофе и завтраки для спокойного утра, встреч и пауз.</p>
              <a
                className="button-link menu-section__menu-link"
                href={siteData.menuUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Открыть полное меню в Яндекс Картах"
              >
                Полное меню <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </header>

        <Reveal className="menu-section__carousel" delay={80}>
          <MenuCarousel items={siteData.menuItems} />
        </Reveal>

        <p className="menu-section__note" id="menu-note">
          Иллюстрации блюд. Актуальное меню и цены — в Яндекс Картах.
        </p>
      </div>
    </section>
  )
}
