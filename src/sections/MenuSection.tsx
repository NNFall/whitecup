import { MenuCarousel } from '../components/MenuCarousel'
import { Reveal } from '../components/Reveal'
import { SectionFrame } from '../components/SectionFrame'
import { siteData } from '../data/site'

export function MenuSection() {
  return (
    <SectionFrame
      id="menu"
      title="Кофе, завтраки и что-нибудь к чаю"
      kicker="02 / Меню"
      className="menu-scene"
    >
      <div className="menu-scene__intro">
        <p className="scene-copy scene-copy--large">
          Выбирайте знакомую классику или оставайтесь дольше ради позиции, которую хочется попробовать именно сегодня.
        </p>
        <div className="menu-scene__source">
          <p>В карточке указана подтверждённая цена капучино. Остальные цены и наличие сверяйте в актуальном меню.</p>
          <a className="text-link text-link--arrow" href={siteData.menuUrl} target="_blank" rel="noreferrer">
            Открыть полное меню в Яндекс Картах <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <Reveal className="menu-scene__carousel" delay={80}>
        <MenuCarousel items={siteData.menuItems} />
      </Reveal>
    </SectionFrame>
  )
}
