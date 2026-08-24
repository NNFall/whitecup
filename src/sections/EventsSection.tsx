import { Reveal } from '../components/Reveal'
import { SceneLayer } from '../components/SceneLayer'
import { SectionFrame } from '../components/SectionFrame'
import {
  eventsSceneLayerManifest,
  type EventsCardMediaId,
} from '../data/media'
import { siteData } from '../data/site'

export function EventsSection() {
  const [cakeLayer, coffeeLayer] = eventsSceneLayerManifest.foregrounds

  return (
    <SectionFrame
      id="events"
      title={
        <>
          <span className="events-scene__title-line">Завтраки, встречи</span>{' '}
          <span className="events-scene__title-line">
            и тёплые <span className="events-scene__accent">события</span>
          </span>
        </>
      }
      className="events-scene"
    >
      <div className="events-scene__art">
        <SceneLayer
          {...eventsSceneLayerManifest.backdrop}
          className="events-scene__backdrop"
          loading="lazy"
          decoding="async"
        />
        <SceneLayer
          {...eventsSceneLayerManifest.chalkboard}
          className="events-scene__chalkboard"
          loading="lazy"
          decoding="async"
        />
        <SceneLayer
          {...cakeLayer}
          className="events-scene__cake"
          loading="lazy"
          decoding="async"
        />
        <SceneLayer
          {...coffeeLayer}
          className="events-scene__coffee"
          loading="lazy"
          decoding="async"
        />
        <SceneLayer
          {...eventsSceneLayerManifest.decoration}
          className="events-scene__doodles"
          loading="lazy"
          decoding="async"
        />
      </div>

      <Reveal className="events-scene__intro">
        <p>
          Начните день с вкусного завтрака в компании друзей,
          <br className="events-scene__desktop-break" />
          {' '}
          проведите продуктивную встречу за ароматным кофе
          <br className="events-scene__desktop-break" />
          {' '}
          или устройте камерное мероприятие в уютной атмосфере
          <br className="events-scene__desktop-break" />
          {' '}
          <span className="events-scene__intro-brand">White Cup</span>.
        </p>
      </Reveal>

      <div className="events-scene__cards" aria-label="Форматы встреч и событий в White Cup">
        {siteData.events.map((event, index) => {
          const cardLayer = eventsSceneLayerManifest.cards[event.id as EventsCardMediaId]
          const isAnnouncementsCard = event.id === 'warm-events'

          return (
            <Reveal key={event.id} className="events-card-reveal" delay={index * 80}>
              <article className="events-card" data-events-card={event.id}>
                <div className="events-card__media">
                  <SceneLayer
                    {...cardLayer}
                    className="events-card__image"
                    data-events-card-image={event.id}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="events-card__copy">
                  <h3>
                    {isAnnouncementsCard ? (
                      <a
                        className="events-card__title-link"
                        href={siteData.vkUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Камерные события, свежие анонсы в VK, откроется в новой вкладке"
                      >
                        {event.title}
                      </a>
                    ) : (
                      event.title
                    )}
                  </h3>
                  <p>{event.description}</p>
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>
    </SectionFrame>
  )
}
