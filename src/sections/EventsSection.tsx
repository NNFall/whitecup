import { OrganicPhoto } from '../components/OrganicPhoto'
import { Reveal } from '../components/Reveal'
import { SceneLayer } from '../components/SceneLayer'
import { SectionFrame } from '../components/SectionFrame'
import {
  documentarySceneMedia,
  eventsSceneLayerManifest,
  type EventsCardMediaId,
} from '../data/media'
import { siteData } from '../data/site'
import '../styles/scene-layout-polish.css'

export function EventsSection() {
  const [cakeLayer, coffeeLayer] = eventsSceneLayerManifest.foregrounds
  const documentaryPhoto = documentarySceneMedia.events[0]

  return (
    <SectionFrame
      id="events"
      title={
        <span className="events-scene__title" data-scene-layer="title">
          <span className="events-scene__title-line events-scene__title-line--first">
            Завтраки, встречи
          </span>{' '}
          <span className="events-scene__title-line events-scene__title-line--second">
            и тёплые <span className="events-scene__accent">события</span>
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

      <Reveal className="events-scene__intro" data-scene-layer="copy">
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

      <div className="events-scene__photo" data-scene-layer="photo">
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
      </div>

      <SceneLayer
        {...eventsSceneLayerManifest.decoration}
        className="events-scene__doodles"
        data-scene-layer="doodles"
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
