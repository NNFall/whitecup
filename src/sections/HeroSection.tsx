import { siteData } from '../data/site'
import { documentarySceneMedia, heroCleanPanel, heroFoodCutout, heroReferenceArt, heroSkylineLine } from '../data/media'
import { Doodles } from '../components/Doodles'
import { OrganicPhoto } from '../components/OrganicPhoto'
import { Reveal } from '../components/Reveal'
import { SketchUnderline } from '../components/SketchUnderline'

export function HeroSection() {
  const heroMedia = documentarySceneMedia.hero[0]

  return (
    <section id="hero" className="scene hero-scene" aria-labelledby="hero-title" data-scene="hero">
      <img
        className="hero-scene__clean-panel"
        src={heroCleanPanel.src}
        alt=""
        aria-hidden="true"
        data-media-kind="decorative-generated"
        onError={(event) => {
          event.currentTarget.hidden = true
          const section = event.currentTarget.closest<HTMLElement>('.hero-scene')
          section?.querySelector<HTMLElement>('.hero-scene__reference-fallback')?.style.setProperty('opacity', '1')
          const foodCutout = section?.querySelector<HTMLImageElement>('.hero-scene__food-cutout')
          if (foodCutout?.dataset.src) {
            foodCutout.src = foodCutout.dataset.src
            foodCutout.removeAttribute('hidden')
          }
        }}
      />
      <div className="hero-scene__inner">
        <Reveal className="hero-scene__copy">
          <h1 id="hero-title">
            Завтраки,{' '}
            <br />
            <span className="hero-scene__accent">кофе</span> и свой{' '}
            <br />
            <span className="hero-scene__last-line">
              вайб в <em>White Cup</em>
              <span className="hero-scene__heart" aria-hidden="true">
                ♡
              </span>
            </span>
          </h1>
          <SketchUnderline className="hero-scene__underline" width={280} />
          <p className="hero-scene__lede">
            Спешелти кофе, свежие завтраки
            <br />
            и уютная атмосфера любимого места
            <br />
            в центре <span className="hero-scene__lede-accent">Самары.</span>
          </p>
          <div className="hero-scene__actions" role="group" aria-label="Основные действия">
            <a className="button-link button-link--primary" href={siteData.menuUrl} target="_blank" rel="noreferrer">
              Посмотреть меню <span aria-hidden="true">→</span>
            </a>
            <a className="button-link button-link--quiet" href="#locations">
              Выбрать локацию <span className="hero-scene__pin" aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <Reveal className="hero-scene__visual" delay={100}>
          <div
            className="hero-scene__reference-art"
            aria-hidden="true"
            data-reference-source={heroReferenceArt.id}
          />
          <img
            className="hero-scene__food-cutout"
            data-src={heroFoodCutout.src}
            alt=""
            aria-hidden="true"
            hidden
            onError={(event) => {
              event.currentTarget.hidden = true
            }}
          />
          <OrganicPhoto
            media={heroMedia}
            className="organic-photo--hero hero-scene__reference-fallback"
            aspectRatio="1 / 1.06"
            loading="lazy"
            fetchPriority="high"
            sizes="(max-width: 720px) 92vw, 45vw"
            caption="Тот самый зал White Cup"
          />
          <Doodles variant="hero" className="hero-scene__doodles" />
        </Reveal>
      </div>
      <img
        className="hero-scene__skyline--full"
        src={heroSkylineLine.src}
        alt=""
        aria-hidden="true"
        onError={(event) => {
          event.currentTarget.hidden = true
        }}
      />
    </section>
  )
}
