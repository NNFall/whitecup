import { documentarySceneMedia } from '../data/media'
import { siteData } from '../data/site'
import { Doodles } from '../components/Doodles'
import { OrganicPhoto } from '../components/OrganicPhoto'
import { Reveal } from '../components/Reveal'
import { SectionFrame } from '../components/SectionFrame'

export function AboutSection() {
  return (
    <SectionFrame
      id="about"
      title="О White Cup — место, в которое хочется возвращаться"
      kicker="02 / О месте"
      className="about-scene"
    >
      <div className="about-scene__grid">
        <Reveal className="about-scene__intro">
          <p className="scene-copy scene-copy--large">
            Не нужно ждать особого повода. Здесь можно прийти за капучино, остаться на завтрак и незаметно провести в центре весь день.
          </p>
          <p className="scene-copy scene-copy--muted">
            Честный кофе, спокойный свет и детали, которые замечаешь не с первого раза.
          </p>
          <Doodles variant="about" className="about-scene__doodles" />
        </Reveal>

        <Reveal className="about-scene__photo" delay={80}>
          <OrganicPhoto
            media={documentarySceneMedia.about[0]}
            className="organic-photo--about"
            aspectRatio="1.15 / 1"
            sizes="(max-width: 720px) 92vw, 43vw"
            caption="Интерьер, в котором легко задержаться"
          />
        </Reveal>
      </div>

      <ul className="benefits-list" aria-label="Что есть в White Cup">
        {siteData.benefits.map((benefit, index) => (
          <li key={benefit.id} className="benefit-item">
            <Reveal delay={index * 70}>
              <span className="benefit-item__index">0{index + 1}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </SectionFrame>
  )
}
