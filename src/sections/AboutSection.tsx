import { SceneLayer } from '../components/SceneLayer'
import { SectionFrame } from '../components/SectionFrame'
import {
  aboutSceneLayerManifest,
  type AboutBenefitMediaId,
} from '../data/media'
import { siteData } from '../data/site'

export function AboutSection() {
  const [pastryLayer, coffeeLayer] = aboutSceneLayerManifest.foregrounds

  return (
    <SectionFrame
      id="about"
      title={
        <>
          <span
            className="about-scene__title-line about-scene__title-line--brand"
            data-motion="rise"
            data-motion-step={0}
          >
            О White Cup —
          </span>{' '}
          <span
            className="about-scene__title-line about-scene__title-line--place"
            data-motion="rise"
            data-motion-step={1}
          >
            место, в которое
          </span>
          {' '}
          <span
            className="about-scene__title-line about-scene__title-line--return"
            data-motion="rise"
            data-motion-step={2}
          >
            <span className="about-scene__word about-scene__word--want about-scene__accent">
              хочется
            </span>{' '}
            <span className="about-scene__word about-scene__word--return about-scene__return">
              возвращаться
            </span>
          </span>
        </>
      }
      className="about-scene"
    >
      <SceneLayer
        {...aboutSceneLayerManifest.backdrop}
        className="about-scene__backdrop"
        loading="lazy"
        decoding="async"
      />
      <SceneLayer
        {...aboutSceneLayerManifest.decoration}
        className="about-scene__doodles"
        data-motion="draw"
        data-motion-step={3}
        loading="lazy"
        decoding="async"
      />

      <div className="about-scene__intro">
        <p data-motion="rise" data-motion-step={2}>
          Мы обожаем спешелти-кофе и готовим его с вниманием к каждой детали. Наши завтраки подаём весь день — от хрустящих вафель до сытных боулов и ароматной выпечки.
        </p>
        <p data-motion="rise" data-motion-step={3}>
          White Cup — это уютная кофейня{' '}
          <span className="about-scene__city">в самом сердце Самары</span>, где легко переключиться с городского ритма на своё время.
        </p>
      </div>

      <ul className="benefits-list" aria-label="Что есть в White Cup">
        {siteData.benefits.map((benefit, index) => {
          const illustration =
            aboutSceneLayerManifest.benefits[benefit.id as AboutBenefitMediaId]
          const step = index % 4

          return (
            <li key={benefit.id} className="benefit-item">
              <SceneLayer
                {...illustration}
                className="benefit-item__illustration"
                data-about-benefit-image={benefit.id}
                data-motion="art"
                data-motion-step={step}
                loading="lazy"
                decoding="async"
              />
              <h3 data-motion="rise" data-motion-step={step + 1}>
                {benefit.title}
              </h3>
              <p data-motion="rise" data-motion-step={step + 2}>
                {benefit.description}
              </p>
            </li>
          )
        })}
      </ul>

      <SceneLayer
        {...pastryLayer}
        className="about-scene__pastry"
        data-motion="art"
        data-motion-step={4}
        loading="lazy"
        decoding="async"
      />
      <SceneLayer
        {...coffeeLayer}
        className="about-scene__coffee"
        data-motion="art"
        data-motion-step={5}
        loading="lazy"
        decoding="async"
      />
    </SectionFrame>
  )
}
