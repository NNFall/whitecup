import type { SyntheticEvent } from 'react'
import { useState } from 'react'

import { siteData } from '../data/site'
import {
  documentarySceneMedia,
  heroSceneLayerManifest,
} from '../data/media'
import { OrganicPhoto } from '../components/OrganicPhoto'
import { Reveal } from '../components/Reveal'
import { SceneLayer } from '../components/SceneLayer'
import { SketchUnderline } from '../components/SketchUnderline'

function hideBrokenDecorativeLayer(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.hidden = true
}

export function HeroSection() {
  const heroMedia = documentarySceneMedia.hero[0]
  const [fallbackVisible, setFallbackVisible] = useState(false)
  const [bagelLayer, coffeeLayer] = heroSceneLayerManifest.foregrounds
  const [doodleLayer, skylineLayer] = heroSceneLayerManifest.decorations

  return (
    <section id="hero" className="scene hero-scene" aria-labelledby="hero-title" data-scene="hero">
      <div
        className="hero-reference-frame"
        data-reference-width="1672"
        data-reference-height="941"
        aria-describedby="hero-title"
      >
        <SceneLayer
          className="hero-backdrop"
          asset={heroSceneLayerManifest.backdrop.asset}
          layer={heroSceneLayerManifest.backdrop.layer}
          src={heroSceneLayerManifest.backdrop.src}
          decoding="async"
          fetchPriority="high"
          onError={(event) => {
            event.currentTarget.hidden = true
            setFallbackVisible(true)
          }}
        />

        <div className="hero-reference-frame__grain" aria-hidden="true" />

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
              className="hero-scene__documentary-fallback"
              data-fallback-visible={fallbackVisible ? 'true' : 'false'}
            >
              {fallbackVisible ? (
                <OrganicPhoto
                  media={heroMedia}
                  className="organic-photo--hero"
                  aspectRatio="1 / 1.06"
                  loading="lazy"
                  fetchPriority="high"
                  sizes="(max-width: 720px) 92vw, 45vw"
                  caption="Тот самый зал White Cup"
                />
              ) : null}
            </div>
          </Reveal>
        </div>

        <SceneLayer
          className="hero-bagel"
          asset={bagelLayer.asset}
          layer={bagelLayer.layer}
          src={bagelLayer.src}
          decoding="async"
          draggable="false"
          onError={hideBrokenDecorativeLayer}
        />

        <SceneLayer
          className="hero-coffee"
          asset={coffeeLayer.asset}
          layer={coffeeLayer.layer}
          src={coffeeLayer.src}
          decoding="async"
          draggable="false"
          onError={hideBrokenDecorativeLayer}
        />

        <SceneLayer
          className="hero-doodle-layer"
          asset={doodleLayer.asset}
          layer={doodleLayer.layer}
          src={doodleLayer.src}
          decoding="async"
          draggable="false"
          onError={hideBrokenDecorativeLayer}
        />

        <SceneLayer
          className="hero-skyline-layer"
          asset={skylineLayer.asset}
          layer={skylineLayer.layer}
          src={skylineLayer.src}
          decoding="async"
          draggable="false"
          onError={hideBrokenDecorativeLayer}
        />
      </div>
    </section>
  )
}
