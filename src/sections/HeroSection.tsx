import { siteData } from '../data/site'
import { documentarySceneMedia, generatedSkyline } from '../data/media'
import { Doodles } from '../components/Doodles'
import { OrganicPhoto } from '../components/OrganicPhoto'
import { Reveal } from '../components/Reveal'
import { SamaraSkyline } from '../components/SamaraSkyline'
import { SketchUnderline } from '../components/SketchUnderline'

export function HeroSection() {
  const heroMedia = documentarySceneMedia.hero[0]

  return (
    <section id="hero" className="scene hero-scene" aria-labelledby="hero-title" data-scene="hero">
      <div className="hero-scene__inner">
        <Reveal className="hero-scene__copy">
          <p className="scene-kicker"><span className="scene-kicker__mark">01</span> White Cup / Самара</p>
          <h1 id="hero-title">
            Завтраки,
            <br />
            кофе и <em>свой вайб</em>
            <br />
            в White Cup
          </h1>
          <SketchUnderline className="hero-scene__underline" width={280} />
          <p className="hero-scene__lede">
            Место в центре Самары, где день начинается с хорошей чашки, а заканчивается разговором, который не хочется прерывать.
          </p>
          <div className="hero-scene__actions" role="group" aria-label="Основные действия">
            <a className="button-link button-link--primary" href={siteData.menuUrl} target="_blank" rel="noreferrer">
              Смотреть меню <span aria-hidden="true">↗</span>
            </a>
            <a className="button-link button-link--quiet" href="#locations">
              Найти White Cup <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="hero-scene__note"><span aria-hidden="true">✳</span> кофе, завтраки, свои люди</p>
        </Reveal>

        <Reveal className="hero-scene__visual" delay={100}>
          <OrganicPhoto
            media={heroMedia}
            className="organic-photo--hero"
            aspectRatio="1 / 1.06"
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 720px) 92vw, 45vw"
            caption="Тот самый зал White Cup"
          />
          <Doodles variant="hero" className="hero-scene__doodles" />
          <img
            className="hero-scene__skyline-image"
            src={generatedSkyline.src}
            alt={generatedSkyline.alt}
            aria-hidden="true"
            onError={(event) => {
              event.currentTarget.hidden = true
            }}
          />
          <SamaraSkyline
            className="hero-scene__skyline hero-scene__skyline-fallback"
          />
          <p className="hero-scene__stamp" aria-hidden="true">everyday, but better</p>
        </Reveal>
      </div>
    </section>
  )
}
