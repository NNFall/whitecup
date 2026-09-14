import { OrganicPhoto } from '../components/OrganicPhoto'
import { SceneLayer } from '../components/SceneLayer'
import { SectionFrame } from '../components/SectionFrame'
import {
  documentarySceneMedia,
  eventsSceneLayerManifest,
  type EventsCardMediaId,
} from '../data/media'
import { siteData } from '../data/site'

export function EventsSection() {
  const [cakeLayer, coffeeLayer] = eventsSceneLayerManifest.foregrounds
  const documentaryPhoto = documentarySceneMedia.events[0]

  return (
    <SectionFrame
      id="events"
      title={
        <span className="events-scene__title" data-scene-layer="title">
          <span
            className="events-scene__title-line events-scene__title-line--first"
            data-motion="rise"
            data-motion-step={0}
          >
            Завтраки, встречи
          </span>{' '}
          <span
            className="events-scene__title-line events-scene__title-line--second"
            data-motion="rise"
            data-motion-step={1}
          >
            <span className="events-scene__word events-scene__word--warm">и тёплые</span>{' '}
            <span className="events-scene__word events-scene__word--events events-scene__accent">
              события
            </span>
          </span>
        </span>
      }
      className="events-scene"
      data-scene-layout="independent"
    >
      <div
        className="events-scene__paper"
        data-scene-layer="paper"
        data-scene-paper="true"
        aria-hidden="true"
      />

      <div className="events-scene__intro" data-scene-layer="copy">
        <p data-motion="rise" data-motion-step={2}>
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
      </div>

      <div
        className="events-scene__photo"
        data-scene-layer="photo"
        data-motion="soft"
        data-motion-step={2}
      >
        <OrganicPhoto
          media={documentaryPhoto}
          className="events-scene__documentary"
          aspectRatio="4 / 5"
          sizes="(max-width: 1023px) calc(100vw - 2rem), 47vw"
        />
      </div>

      <div className="events-scene__props" data-scene-layer="props" aria-hidden="true">
        <SceneLayer
          {...eventsSceneLayerManifest.chalkboard}
          className="events-scene__chalkboard"
          data-motion="art"
          data-motion-step={2}
          loading="lazy"
          decoding="async"
        />
        <SceneLayer
          {...cakeLayer}
          className="events-scene__cake"
          data-motion="art"
          data-motion-step={4}
          loading="lazy"
          decoding="async"
        />
        <SceneLayer
          {...coffeeLayer}
          className="events-scene__coffee"
          data-motion="art"
          data-motion-step={5}
          loading="lazy"
          decoding="async"
        />
      </div>

      <SceneLayer
        {...eventsSceneLayerManifest.decoration}
        className="events-scene__doodles"
        data-scene-layer="doodles"
        data-motion="draw"
        data-motion-step={3}
        loading="lazy"
        decoding="async"
      />

      <div
        className="events-scene__cards"
        data-scene-layer="cards"
        aria-label="Форматы встреч и событий в White Cup"
      >
        {siteData.events.map((event, index) => {
          const cardLayer = eventsSceneLayerManifest.cards[event.id as EventsCardMediaId]
          const isAnnouncementsCard = event.id === 'warm-events'
          const step = index % 3

          return (
            <div key={event.id} className="events-card-reveal">
              <article className="events-card" data-events-card={event.id}>
                <div className="events-card__media" data-motion="art" data-motion-step={step}>
                  <SceneLayer
                    {...cardLayer}
                    className="events-card__image"
                    data-events-card-image={event.id}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="events-card__copy" data-motion="rise" data-motion-step={step + 2}>
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
            </div>
          )
        })}
      </div>
    </SectionFrame>
  )
}
