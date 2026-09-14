import { OrganicPhoto } from '../components/OrganicPhoto'
import { SceneLayer } from '../components/SceneLayer'
import { SectionFrame } from '../components/SectionFrame'
import { StaticMapCard } from '../components/StaticMapCard'
import {
  documentarySceneMedia,
  locationsCardIconMedia,
  locationsSceneLayerManifest,
} from '../data/media'
import { siteData, type Location } from '../data/site'

type LocationCardIconName = keyof typeof locationsCardIconMedia

function LocationCardIcon({ name }: { name: LocationCardIconName }) {
  const asset = locationsCardIconMedia[name]
  const actionClass =
    name === 'arrow' || name === 'chat' ? ' location-card__action-icon' : ''
  const motionKind = name === 'pin' || name === 'clock' || name === 'phone' ? 'art' : undefined

  return (
    <img
      className={`location-card__icon location-card__icon--${name}${actionClass}`}
      src={asset.src}
      alt=""
      aria-hidden="true"
      data-media-kind={asset.provenanceKind}
      data-motion={motionKind}
      data-motion-step={motionKind ? 0 : undefined}
      draggable={false}
      loading="lazy"
      decoding="async"
    />
  )
}

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
  const documentaryPhoto = documentarySceneMedia.locations[0]
  const modernMuseumLocation = siteData.locations[0]
  const tsekhLocation = siteData.locations[1]

  return (
    <SectionFrame
      id="locations"
      title={
        <span
          className="locations-scene__title"
          data-scene-layer="title"
          data-motion="rise"
          data-motion-step={0}
        >
          Как нас{' '}
          <span className="locations-scene__word locations-scene__word--find locations-scene__title-accent">
            найти
          </span>
        </span>
      }
      className="locations-scene"
      data-scene-layout="independent"
    >
      <div
        className="locations-scene__paper"
        data-scene-layer="paper"
        data-scene-paper="true"
        aria-hidden="true"
      />

      <div className="locations-scene__intro" data-scene-layer="copy">
        <p data-motion="rise" data-motion-step={1}>
          Мы в <span className="locations-scene__intro-accent">самом сердце Самары</span>.
          <br className="locations-scene__desktop-break" /> Две уютные кофейни с ароматным кофе,
          <br className="locations-scene__desktop-break" /> свежими завтраками и тёплой атмосферой
          <br className="locations-scene__desktop-break" /> каждый день.
        </p>
      </div>

      <div className="locations-scene__map-layer" data-scene-layer="map">
        <StaticMapCard
          className="locations-scene__map"
          layer={locationsSceneLayerManifest.map}
          labels={[
            {
              id: modernMuseumLocation.id,
              label: modernMuseumLocation.address,
              hint: modernMuseumLocation.context,
            },
            {
              id: tsekhLocation.id,
              label: `Станкозавод, ${tsekhLocation.address}`,
              hint: 'пространство «Цех»',
            },
          ]}
        />
      </div>

      <div
        className="locations-scene__photo"
        data-scene-layer="photo"
        data-motion="soft"
        data-motion-step={2}
      >
        <OrganicPhoto
          media={documentaryPhoto}
          className="locations-scene__documentary"
          aspectRatio="16 / 9"
          sizes="(max-width: 1023px) calc(100vw - 2rem), 50vw"
        />
      </div>

      <SceneLayer
        {...locationsSceneLayerManifest.decoration}
        className="locations-scene__doodles"
        data-scene-layer="doodles"
        data-motion="art"
        data-motion-step={5}
        loading="lazy"
        decoding="async"
      />

      <div className="locations-scene__cards" data-scene-layer="cards">
        {siteData.locations.map((location, index) => {
          const displayAddress = getDisplayAddress(location)

          return (
            <div className="locations-card-reveal" key={location.id}>
              <article
                className="location-card"
                data-location-card={location.id}
                aria-labelledby={`location-${location.id}-title`}
              >
                <LocationCardIcon name="pin" />
                <LocationCardIcon name="clock" />
                <LocationCardIcon name="phone" />

                <div className="location-card__address" data-motion="rise" data-motion-step={index}>
                  <h3 id={`location-${location.id}-title`}>
                    <LocationHeading location={location} />
                  </h3>
                  <address>
                    <p>{location.context}</p>
                  </address>
                </div>

                <div
                  className="location-card__details"
                  data-motion="soft"
                  data-motion-step={index + 2}
                >
                  <p className="location-card__hours">
                    <span className="location-card__meta-label">Часы работы</span>
                    <strong>
                      <a
                        href={location.routeUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Уточнить часы работы White Cup, ${displayAddress}, в картах, откроется в новой вкладке`}
                      >
                        Часы работы в картах
                      </a>
                    </strong>
                  </p>
                  <a
                    className="location-card__phone"
                    href={siteData.phoneHref}
                    aria-label={`Позвонить в White Cup, ${displayAddress}`}
                  >
                    {siteData.phone}
                  </a>
                </div>

                <div
                  className="location-card__actions"
                  data-scene-layer="actions"
                  data-motion="rise"
                  data-motion-step={index + 4}
                >
                  <a
                    className="location-card__action location-card__action--route"
                    href={location.routeUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Построить маршрут до White Cup, ${displayAddress}, откроется в новой вкладке`}
                  >
                    Построить маршрут
                    <LocationCardIcon name="arrow" />
                  </a>
                  <a
                    className="location-card__action location-card__action--contact"
                    href={siteData.phoneHref}
                    aria-label={`Связаться с White Cup, ${displayAddress}`}
                  >
                    Связаться
                    <LocationCardIcon name="chat" />
                  </a>
                </div>

                {location.entranceNote ? (
                  <p
                    className="location-card__note"
                    data-motion="soft"
                    data-motion-step={5}
                  >
                    {location.entranceNote}
                  </p>
                ) : null}
              </article>
            </div>
          )
        })}
      </div>
    </SectionFrame>
  )
}
