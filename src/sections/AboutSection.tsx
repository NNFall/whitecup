import { OrganicPhoto } from '../components/OrganicPhoto'
import { Reveal } from '../components/Reveal'
import { SectionFrame } from '../components/SectionFrame'
import { mediaAssets } from '../data/media'
import { siteData } from '../data/site'

const atmosphereScenarios = [
  {
    title: 'Кофе перед прогулкой',
    description: 'Чашка кофе — и можно идти дальше.',
  },
  {
    title: 'Встреча без спешки',
    description: 'Разговор, ради которого хочется остаться.',
  },
  {
    title: 'Время для себя',
    description: 'Немного времени только для себя.',
  },
] as const

export function AboutSection() {
  // The landscape image keeps the main documentary frame crisp at desktop
  // widths; the portrait interiors work as the smaller, varied details.
  const mainPhoto = mediaAssets['interior-05']
  const sidePhotos = [mediaAssets['interior-03'], mediaAssets['interior-04']]

  return (
    <SectionFrame
      id="about"
      kicker="02 / МЕСТО ДЛЯ ПАУЗЫ"
      title={
        <>
          <span>В центре города.</span>
          <br />
          <span>В своём ритме.</span>
        </>
      }
      className="about-story"
    >
      <span id="visit" className="story-anchor anchor-alias" aria-hidden="true" />
      <span id="events" className="story-anchor anchor-alias" aria-hidden="true" />

      <div className="about-story__body">
        <Reveal className="about-story__aside">
          <p className="about-story__lead">
            За кофе после прогулки. За длинным разговором. Или просто за временем для себя.
          </p>
          <a
            className="about-story__vk-link"
            href={siteData.vkUrl}
            target="_blank"
            rel="noreferrer"
          >
            Больше жизни — в VK
            <span aria-hidden="true">↗</span>
          </a>
          <span className="about-story__script" aria-hidden="true">
            своё время
          </span>
        </Reveal>

        <div className="about-story__gallery" aria-label="Интерьеры White Cup">
          <Reveal className="about-story__figure about-story__figure--main">
            <OrganicPhoto
              media={mainPhoto}
              aspectRatio="1.65 / 1"
              sizes="(max-width: 720px) calc(100vw - 2.5rem), 54vw"
            />
          </Reveal>

          <div className="about-story__gallery-side">
            {sidePhotos.map((photo, index) => (
              <Reveal
                className={`about-story__figure about-story__figure--side about-story__figure--side-${index + 1}`}
                delay={(index + 1) * 90}
                key={photo.id}
              >
                <OrganicPhoto
                  media={photo}
                  aspectRatio="1.45 / 1"
                  sizes="(max-width: 720px) calc(100vw - 2.5rem), 22vw"
                />
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="about-story__scenarios">
          <p className="about-story__scenarios-label">Три простых повода заглянуть</p>
          <ol>
            {atmosphereScenarios.map((scenario, index) => (
              <li key={scenario.title}>
                <span className="about-story__scenario-number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{scenario.title}</h3>
                <p>{scenario.description}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </SectionFrame>
  )
}
