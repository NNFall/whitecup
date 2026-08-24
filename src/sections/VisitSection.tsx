import { Reveal } from '../components/Reveal'
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
          <span className="visit-scene__title-line">У нас есть место</span>{' '}
          <span className="visit-scene__title-line">
            для вашего <span className="visit-scene__accent">ритма</span>
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

      <div className="visit-scene__doodle-layer">
        <span className="visit-scene__doodle visit-scene__doodle--cloud" aria-hidden="true" data-layer="decoration" data-visit-doodle="cloud">
          <i />
          <i />
          <i />
        </span>
        <span className="visit-scene__doodle visit-scene__doodle--bird" aria-hidden="true" data-layer="decoration" data-visit-doodle="bird">
          <i />
          <i />
        </span>
        <span className="visit-scene__doodle visit-scene__doodle--sun" aria-hidden="true" data-layer="decoration" data-visit-doodle="sun">
          {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
        </span>
        <span className="visit-scene__doodle visit-scene__doodle--cup" aria-hidden="true" data-layer="decoration" data-visit-doodle="cup">
          <i />
        </span>
      </div>

      <Reveal className="visit-scene__intro">
        <p>
          White Cup — это ваш уютный уголок в <span className="visit-scene__intro-accent">центре Самары</span>. Здесь удобно взять кофе с собой, провести деловую встречу, перевести дух между делами или неспешно насладиться вечером в приятной атмосфере.
        </p>
      </Reveal>

      <div className="visit-scene__cards" aria-label="Форматы отдыха в White Cup">
        {siteData.visitScenarios.map((scenario, index) => (
          <Reveal key={scenario.id} className="visit-card-reveal" delay={index * 80}>
            <article className="visit-card" data-visit-card={scenario.id}>
              <div className="visit-card__media">
                <SceneLayer
                  {...visitSceneLayerManifest.cards[scenario.id as VisitCardMediaId]}
                  className="visit-card__image"
                  data-scene-card-image={scenario.id}
                  loading="lazy"
                  decoding="async"
                />
                <span className="visit-card__corner" aria-hidden="true" />
              </div>
              <div className="visit-card__copy">
                <VisitCardIcon id={scenario.id as VisitCardMediaId} />
                <div>
                  <h3>{scenario.title}</h3>
                  <p>{scenario.description}</p>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
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
