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
        <>
          <span className="menu-scene__title-line">Завтраки, ради которых</span>{' '}
          <span className="menu-scene__title-line">
            хочется <span className="menu-scene__accent">заглянуть</span>
          </span>
        </>
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
          White Cup — это ваш уютный уголок в центре Самары. Здесь удобно взять кофе с собой, провести деловую встречу, перевести дух между делами или неспешно насладиться вечером в приятной атмосфере.
        </p>
      </div>
      <Reveal className="menu-scene__carousel" delay={80}>
        <MenuCarousel items={siteData.menuItems} />
      </Reveal>
      <div className="menu-scene__source">
        <p>
          Изображения карточек — декоративные арт-материалы по референсу, не документальные фото блюд White Cup. Подтверждён только диапазон цены капучино; остальные цены и наличие сверяйте в актуальном меню.
        </p>
        <a className="text-link text-link--arrow" href={siteData.menuUrl} target="_blank" rel="noreferrer">
          Открыть полное меню в Яндекс Картах <span aria-hidden="true">↗</span>
        </a>
      </div>
      <SceneLayer
        {...menuSceneLayerManifest.skyline}
        className="menu-scene__skyline"
        loading="lazy"
        decoding="async"
      />
    </SectionFrame>
  )
}
