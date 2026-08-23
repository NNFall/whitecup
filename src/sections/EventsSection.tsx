import { documentarySceneMedia } from '../data/media'
import { siteData } from '../data/site'
import { Doodles } from '../components/Doodles'
import { OrganicPhoto } from '../components/OrganicPhoto'
import { Reveal } from '../components/Reveal'
import { SectionFrame } from '../components/SectionFrame'

export function EventsSection() {
  return (
    <SectionFrame
      id="events"
      title="Завтраки, встречи и тёплые события"
      kicker="04 / Жизнь White Cup"
      className="events-scene"
    >
      <div className="events-scene__grid">
        <Reveal className="events-scene__photo">
          <OrganicPhoto
            media={documentarySceneMedia.events[0]}
            className="organic-photo--events"
            aspectRatio="1 / 1.12"
            sizes="(max-width: 720px) 92vw, 42vw"
            caption="В White Cup всегда есть повод встретиться"
          />
          <Doodles variant="events" className="events-scene__doodles" />
        </Reveal>
        <Reveal className="events-scene__content" delay={100}>
          <p className="scene-copy scene-copy--large">
            Следите за свежими анонсами, приходите на завтрак с друзьями или просто выбирайте столик для своего разговора.
          </p>
          <div className="events-list">
            {siteData.events.map((event, index) => (
              <article className="event-line" key={event.id}>
                <span className="event-line__index">0{index + 1}</span>
                <div>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
              </article>
            ))}
          </div>
          <a className="text-link text-link--arrow" href={siteData.vkUrl} target="_blank" rel="noreferrer">
            Свежие анонсы в публичной ленте <span aria-hidden="true">↗</span>
          </a>
        </Reveal>
      </div>
    </SectionFrame>
  )
}
