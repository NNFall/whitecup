import { Reveal } from '../components/Reveal'
import { SceneLayer } from '../components/SceneLayer'
import { SectionFrame } from '../components/SectionFrame'
import {
  aboutSceneLayerManifest,
  aboutTitleReferenceLowerExtract,
  aboutTitleReferenceUpperExtract,
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
          <span className="about-scene__title-line about-scene__title-line--brand">
            О White Cup —
          </span>{' '}
          <span className="about-scene__title-line about-scene__title-line--place">
            место, в которое
          </span>
          {' '}
          <span className="about-scene__title-line about-scene__title-line--return">
            <span className="about-scene__accent">хочется</span>{' '}
            <span className="about-scene__return">возвращаться</span>
          </span>
        </>
      }
      className="about-scene"
      referenceTitles={[
        {
          asset: aboutTitleReferenceUpperExtract,
          className: 'about-scene__title-reference-upper',
        },
        {
          asset: aboutTitleReferenceLowerExtract,
          className: 'about-scene__title-reference-lower',
        },
      ]}
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
        loading="lazy"
        decoding="async"
      />

      <Reveal className="about-scene__intro">
        <p>
          Мы обожаем спешелти-кофе и готовим его с вниманием к каждой детали. Наши завтраки подаём весь день — от хрустящих вафель до сытных боулов и ароматной выпечки.
        </p>
        <p>
          White Cup — это уютная кофейня{' '}
          <span className="about-scene__city">в самом сердце Самары</span>, где легко переключиться с городского ритма на своё время.
        </p>
      </Reveal>

      <ul className="benefits-list" aria-label="Что есть в White Cup">
        {siteData.benefits.map((benefit) => {
          const illustration =
            aboutSceneLayerManifest.benefits[benefit.id as AboutBenefitMediaId]

          return (
            <li key={benefit.id} className="benefit-item">
              <SceneLayer
                {...illustration}
                className="benefit-item__illustration"
                data-about-benefit-image={benefit.id}
                loading="lazy"
                decoding="async"
              />
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </li>
          )
        })}
      </ul>

      <SceneLayer
        {...pastryLayer}
        className="about-scene__pastry"
        loading="lazy"
        decoding="async"
      />
      <SceneLayer
        {...coffeeLayer}
        className="about-scene__coffee"
        loading="lazy"
        decoding="async"
      />
    </SectionFrame>
  )
}
