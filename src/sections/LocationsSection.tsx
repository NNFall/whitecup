import { documentarySceneMedia } from '../data/media'
import { siteData } from '../data/site'
import { Doodles } from '../components/Doodles'
import { OrganicPhoto } from '../components/OrganicPhoto'
import { Reveal } from '../components/Reveal'
import { SectionFrame } from '../components/SectionFrame'
import { StaticMapCard } from '../components/StaticMapCard'

export function LocationsSection() {
  return (
    <SectionFrame
      id="locations"
      title="Адреса — две точки, один вайб"
      kicker="05 / Где найти"
      className="locations-scene"
    >
      <div className="locations-scene__intro">
        <p className="scene-copy scene-copy--large">
          Выбирайте адрес, который ближе к вашему маршруту. Оба места — в центре, оба по-своему живые.
        </p>
        <Doodles variant="locations" className="locations-scene__doodles" />
      </div>

      <div className="locations-scene__grid">
        <div className="locations-list">
          {siteData.locations.map((location, index) => {
            const locationMedia = documentarySceneMedia.locations[index]

            return (
              <Reveal className="location-card" key={location.id} delay={index * 90}>
                <div className="location-card__topline">
                  <span className="location-card__index">0{index + 1}</span>
                  <span className="location-card__city">Самара</span>
                </div>
                <h3>
                  <a href={location.routeUrl} target="_blank" rel="noreferrer" aria-label={`Маршрут до White Cup — ${location.name}`}>
                    {location.name}
                  </a>
                </h3>
                <p className="location-card__context">{location.context}</p>
                <div className="location-card__meta">
                  <p><span>Часы</span><strong>{location.hours}</strong></p>
                  {location.hoursNote ? <small>{location.hoursNote}</small> : null}
                </div>
                {location.entranceNote ? <p className="location-card__note">{location.entranceNote}</p> : null}
                <a className="text-link text-link--arrow" href={location.routeUrl} target="_blank" rel="noreferrer">
                  Маршрут в Яндекс Картах <span aria-hidden="true">↗</span>
                </a>
                {locationMedia ? (
                  <OrganicPhoto
                    media={locationMedia}
                    className="organic-photo--location"
                    aspectRatio="2.2 / 1"
                    sizes="(max-width: 720px) 92vw, 40vw"
                  />
                ) : null}
              </Reveal>
            )
          })}
        </div>

        <div className="locations-scene__aside">
          <StaticMapCard routeUrl={siteData.locations[0].routeUrl} address={siteData.locations[0].address} />
          <div className="contact-note">
            <p className="scene-kicker">Есть вопрос?</p>
            <a className="contact-note__phone" href={siteData.phoneHref}>{siteData.phone}</a>
            <p>Звоните или следите за новостями в группе.</p>
            <a className="text-link text-link--arrow" href={siteData.vkUrl} target="_blank" rel="noreferrer">
              White Cup в VK <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </SectionFrame>
  )
}
