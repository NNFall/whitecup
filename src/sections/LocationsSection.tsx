import { Reveal } from '../components/Reveal'
import { SectionFrame } from '../components/SectionFrame'
import { siteData } from '../data/site'

export function LocationsSection() {
  return (
    <SectionFrame
      id="locations"
      kicker="03 / ДО ВСТРЕЧИ"
      title={
        <>
          <span>Два адреса.</span>
          <br />
          <span>Один White Cup.</span>
        </>
      }
      className="locations-story"
    >
      <div className="locations-story__body">
        <Reveal className="locations-story__intro">
          <p>
            Две точки White Cup в центре Самары — выбирайте ту, что ближе к вашему маршруту.
          </p>
          <a
            className="button-link locations-story__phone"
            href={siteData.phoneHref}
            aria-label={`Позвонить в White Cup, ${siteData.phone}`}
          >
            <span>Позвонить</span>
            <strong>{siteData.phone}</strong>
            <span className="locations-story__cta-circle" aria-hidden="true">
              ↗
            </span>
          </a>
        </Reveal>

        <div className="locations-story__cards">
          {siteData.locations.map((location, index) => (
            <Reveal
              className={`locations-story__card-wrap locations-story__card-wrap--${index + 1}`}
              delay={index * 100}
              key={location.id}
            >
              <article
                className="locations-story__card"
                data-location-card={location.id}
                aria-labelledby={`location-story-${location.id}-title`}
              >
                <div className="locations-story__card-topline">
                  <span className="locations-story__card-number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="locations-story__card-place">White Cup</span>
                </div>

                <h3 id={`location-story-${location.id}-title`}>{location.address}</h3>
                <p className="locations-story__context">{location.context}</p>

                <p className="locations-story__hours">
                  Актуальные часы —{' '}
                  <a
                    href={location.routeUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Актуальные часы White Cup, ${location.address}, в картах, откроется в новой вкладке`}
                  >
                    в картах
                  </a>
                </p>

                {location.entranceNote ? (
                  <p className="locations-story__note">{location.entranceNote}</p>
                ) : null}

                <a
                  className="locations-story__route"
                  href={location.routeUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Построить маршрут до White Cup, ${location.address}, откроется в новой вкладке`}
                >
                  <span>Построить маршрут</span>
                  <span className="locations-story__cta-circle" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionFrame>
  )
}
