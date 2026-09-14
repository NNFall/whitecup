import { MenuCarousel } from '../components/MenuCarousel'
import { Reveal } from '../components/Reveal'
import { SceneLayer } from '../components/SceneLayer'
import { SectionFrame } from '../components/SectionFrame'
import { menuSceneLayerManifest } from '../data/media'
import { siteData } from '../data/site'

export function MenuSection() {
  return (
    <SectionFrame
      id="menu"
      title={
        <span className="menu-scene__title">
          <span className="menu-scene__title-line menu-scene__title-line--first">
            <span className="menu-scene__title-initial">З</span>автраки,
            <br className="menu-scene__mobile-title-break" aria-hidden="true" />{' '}
            ради которых
          </span>{' '}
          <span className="menu-scene__title-line menu-scene__title-line--second">
            хочется{' '}
            <span className="menu-scene__word menu-scene__word--look menu-scene__accent">
              заглянуть
            </span>
          </span>
        </span>
      }
      kicker="Для утренних ритуалов, встреч и спокойных пауз"
      className="menu-scene"
    >
      <SceneLayer
        {...menuSceneLayerManifest.backdrop}
        className="menu-scene__backdrop"
        loading="lazy"
        decoding="async"
      />
      <div className="menu-scene__intro">
        <p className="scene-copy">
          Кофе и завтраки для спокойного утра.
        </p>
      </div>
      <Reveal className="menu-scene__carousel" delay={80}>
        <MenuCarousel
          items={siteData.menuItems}
          fullMenuUrl={siteData.menuUrl}
          provenanceDescriptionId="menu-provenance-note"
        />
      </Reveal>
      <p className="menu-scene__provenance" id="menu-provenance-note">
        Иллюстрации блюд. Актуальное меню и цены — в Яндекс Картах.
      </p>
      <SceneLayer
        {...menuSceneLayerManifest.skyline}
        className="menu-scene__skyline"
        loading="lazy"
        decoding="async"
      />
    </SectionFrame>
  )
}
