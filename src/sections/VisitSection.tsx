import { SceneLayer } from '../components/SceneLayer'
import { SectionFrame } from '../components/SectionFrame'
import {
  visitSceneLayerManifest,
  type VisitCardMediaId,
} from '../data/media'
import { siteData } from '../data/site'

function VisitCardIcon({ id }: { id: VisitCardMediaId }) {
  return (
    <span className={`visit-card__icon visit-card__icon--${id}`} aria-hidden="true">
      <i />
      {id === 'meeting-in-centre' ? <i /> : null}
    </span>
  )
}

export function VisitSection() {
  return (
    <SectionFrame
      id="visit"
      title={
        <>
          <span
            className="visit-scene__title-line visit-scene__title-line--first"
            data-motion="rise"
            data-motion-step={0}
          >
            У нас есть место
          </span>{' '}
          <span
            className="visit-scene__title-line visit-scene__title-line--second"
            data-motion="rise"
            data-motion-step={1}
          >
            для вашего{' '}
            <span className="visit-scene__word visit-scene__word--rhythm visit-scene__accent">
              ритма
            </span>
          </span>
        </>
      }
      kicker={'Для утренних ритуалов,\nвстреч и спокойных пауз'}
      className="visit-scene"
    >
      <SceneLayer
        {...visitSceneLayerManifest.backdrop}
        className="visit-scene__backdrop"
        loading="lazy"
        decoding="async"
      />

      <SceneLayer
        {...visitSceneLayerManifest.decoration}
        className="visit-scene__doodles"
        data-motion="draw"
        data-motion-step={3}
        loading="lazy"
        decoding="async"
      />

      <div className="visit-scene__intro">
        <p data-motion="rise" data-motion-step={2}>
          Ваш уютный уголок в <span className="visit-scene__intro-accent">центре Самары</span>. Для кофе перед прогулкой, встречи с друзьями или спокойной паузы между делами.
        </p>
      </div>

      <div className="visit-scene__cards" aria-label="Форматы отдыха в White Cup">
        {siteData.visitScenarios.map((scenario, index) => {
          const step = index % 3

          return (
            <div key={scenario.id} className="visit-card-reveal">
              <article className="visit-card" data-visit-card={scenario.id}>
                <div className="visit-card__media" data-motion="art" data-motion-step={step}>
                  <SceneLayer
                    {...visitSceneLayerManifest.cards[scenario.id as VisitCardMediaId]}
                    className="visit-card__image"
                    data-scene-card-image={scenario.id}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="visit-card__corner" aria-hidden="true" />
                </div>
                <div className="visit-card__copy" data-motion="rise" data-motion-step={step + 2}>
                  <VisitCardIcon id={scenario.id as VisitCardMediaId} />
                  <div>
                    <h3>{scenario.title}</h3>
                    <p>{scenario.description}</p>
                  </div>
                </div>
              </article>
            </div>
          )
        })}
      </div>

      <SceneLayer
        {...visitSceneLayerManifest.skyline}
        className="visit-scene__skyline"
        loading="lazy"
        decoding="async"
      />
    </SectionFrame>
  )
}
