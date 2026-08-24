import { Reveal } from '../components/Reveal'
import { SceneLayer } from '../components/SceneLayer'
import { SectionFrame } from '../components/SectionFrame'
import { StaticMapCard } from '../components/StaticMapCard'
import { locationsSceneLayerManifest } from '../data/media'
import { siteData, type Location } from '../data/site'

function getDisplayAddress(location: Location) {
  return location.id === 'tsekh'
    ? `Станкозавод, ${location.address}`
    : location.address
}

function LocationHeading({ location }: { location: Location }) {
  if (location.id === 'tsekh') {
    return (
      <>
        <span>Станкозавод,</span>{' '}
        <span>{location.address}</span>
      </>
    )
  }

  return <>{location.address}</>
}

export function LocationsSection() {
  return (
    <SectionFrame
      id="locations"
      title={
        <>
          Как <span className="locations-scene__title-accent">нас найти</span>
        </>
      }
      className="locations-scene"
    >
      <div className="locations-scene__art">
        <StaticMapCard
          layer={locationsSceneLayerManifest.map}
          labels={[
            {
              id: 'modern-museum',
              label: 'Красноармейская, 15',
              hint: 'в Яндекс — 17',
            },
            {
              id: 'tsekh',
              label: 'Станкозавод, Куйбышева, 128/1',
            },
          ]}
        />
        <SceneLayer
          {...locationsSceneLayerManifest.interior}
          className="locations-scene__interior"
          loading="lazy"
          decoding="async"
        />
        <SceneLayer
          {...locationsSceneLayerManifest.decoration}
          className="locations-scene__doodles"
          loading="lazy"
          decoding="async"
        />
        <SceneLayer
          {...locationsSceneLayerManifest.cardIcons}
          className="locations-scene__card-icons"
          loading="lazy"
          decoding="async"
        />
        <SceneLayer
          {...locationsSceneLayerManifest.cardIcons}
          className="locations-scene__action-icons"
          loading="lazy"
          decoding="async"
        />
        <SceneLayer
          {...locationsSceneLayerManifest.cardIcons}
          className="locations-scene__contact-icons"
          loading="lazy"
          decoding="async"
        />
      </div>

      <Reveal className="locations-scene__intro">
        <p>
          Мы в <span className="locations-scene__intro-accent">самом сердце Самары</span>.
          <br className="locations-scene__desktop-break" /> Две уютные кофейни с ароматным кофе,
          <br className="locations-scene__desktop-break" /> свежими завтраками и тёплой атмосферой
          <br className="locations-scene__desktop-break" /> каждый день.
        </p>
      </Reveal>

      <div className="locations-scene__cards">
        {siteData.locations.map((location, index) => {
          const displayAddress = getDisplayAddress(location)

          return (
            <Reveal
              className="locations-card-reveal"
              delay={index * 90}
              key={location.id}
            >
              <article
                className="location-card"
                data-location-card={location.id}
                aria-labelledby={`location-${location.id}-title`}
              >
                <div className="location-card__address">
                  <h3 id={`location-${location.id}-title`}>
                    <LocationHeading location={location} />
                  </h3>
                  <address>
                    <span className="location-card__meta-label">{displayAddress}. </span>
                    <p>{location.context}</p>
                  </address>
                </div>

                <div className="location-card__details">
                  <p className="location-card__hours">
                    <span className="location-card__meta-label">Часы работы</span>
                    <strong>{location.hours}</strong>
                  </p>
                  <a
                    className="location-card__phone"
                    href={siteData.phoneHref}
                    aria-label={`Позвонить в White Cup, ${displayAddress}`}
                  >
                    {siteData.phone}
                  </a>
                </div>

                <div className="location-card__actions">
                  <a
                    className="location-card__action location-card__action--route"
                    href={location.routeUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Построить маршрут до White Cup, ${displayAddress}, откроется в новой вкладке`}
                  >
                    Построить маршрут
                  </a>
                  <a
                    className="location-card__action location-card__action--contact"
                    href={siteData.phoneHref}
                    aria-label={`Связаться с White Cup, ${displayAddress}`}
                  >
                    Связаться
                  </a>
                </div>

                {location.entranceNote ? (
                  <p className="location-card__note">{location.entranceNote}</p>
                ) : null}
                {location.hoursNote ? (
                  <p className="location-card__note">{location.hoursNote}</p>
                ) : null}
              </article>
            </Reveal>
          )
        })}
      </div>
    </SectionFrame>
  )
}
