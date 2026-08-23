import { siteData } from '../data/site'
import { Doodles } from '../components/Doodles'
import { Reveal } from '../components/Reveal'
import { SectionFrame } from '../components/SectionFrame'

export function VisitSection() {
  return (
    <SectionFrame
      id="visit"
      title="У нас есть место для вашего ритма"
      kicker="03 / Как провести время"
      className="visit-scene"
    >
      <div className="visit-scene__intro">
        <p className="scene-copy scene-copy--large">
          White Cup подстраивается под день: короткая остановка, длинная встреча или пауза, в которой наконец слышно себя.
        </p>
        <Doodles variant="visit" className="visit-scene__doodles" />
      </div>
      <div className="scenario-grid">
        {siteData.visitScenarios.map((scenario, index) => (
          <Reveal key={scenario.id} className="scenario-card" delay={index * 80}>
            <span className="scenario-card__index">0{index + 1}</span>
            <h3>{scenario.title}</h3>
            <p>{scenario.description}</p>
            <span className="scenario-card__arrow" aria-hidden="true">↗</span>
          </Reveal>
        ))}
      </div>
    </SectionFrame>
  )
}
