import { render } from '@testing-library/react'

import aboutSource from './AboutSection.tsx?raw'
import eventsSource from './EventsSection.tsx?raw'
import heroSource from './HeroSection.tsx?raw'
import locationsSource from './LocationsSection.tsx?raw'
import menuSource from './MenuSection.tsx?raw'
import visitSource from './VisitSection.tsx?raw'
import sectionFrameSource from '../components/SectionFrame.tsx?raw'
import liveTypographyCss from '../styles/live-typography.css?raw'

import { AboutSection } from './AboutSection'
import { EventsSection } from './EventsSection'
import { LocationsSection } from './LocationsSection'
import { MenuSection } from './MenuSection'
import { VisitSection } from './VisitSection'

const runtimeSceneSources = [
  sectionFrameSource,
  heroSource,
  menuSource,
  aboutSource,
  visitSource,
  eventsSource,
  locationsSource,
]

const sceneContracts = [
  {
    id: 'menu',
    title: 'Завтраки, ради которых хочется заглянуть',
    render: <MenuSection />,
  },
  {
    id: 'about',
    title: 'О White Cup — место, в которое хочется возвращаться',
    render: <AboutSection />,
  },
  {
    id: 'visit',
    title: 'У нас есть место для вашего ритма',
    render: <VisitSection />,
  },
  {
    id: 'events',
    title: 'Завтраки, встречи и тёплые события',
    render: <EventsSection />,
  },
  {
    id: 'locations',
    title: 'Как нас найти',
    render: <LocationsSection />,
  },
] as const

describe('section live title visual contract', () => {
  it('renders every scene title as one visible semantic h2 without a raster layer', () => {
    for (const { id, title, render: scene } of sceneContracts) {
      const { container } = render(scene)
      const section = container.querySelector(`#${id}`)
      const heading = section?.querySelector('h2')

      expect(section).toBeInTheDocument()
      expect(heading).toBeInTheDocument()
      expect(heading).toBeVisible()
      expect(heading).toHaveTextContent(title)
      expect(heading).not.toHaveAttribute('aria-hidden', 'true')
      expect(section?.querySelector('[data-conditional-layer*="title-reference"]')).not.toBeInTheDocument()
      expect(section?.querySelector('[class*="title-reference"]')).not.toBeInTheDocument()
    }
  })

  it('removes title-reference imports and runtime paths from all scene sources', () => {
    expect(runtimeSceneSources.join('\n')).not.toMatch(
      /ReferenceTitleLayer|title-reference|TitleReferenceExtract|heroUnderlineReferenceExtract/i,
    )
  })

  it('keeps the live display hierarchy visible at desktop and mobile scales', () => {
    expect(liveTypographyCss).toMatch(
      /\.section-frame__heading h2\s*\{[^}]*font-family:\s*var\(--font-display\);/s,
    )
    expect(liveTypographyCss).toMatch(
      /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.menu-scene \.section-frame__heading h2[\s\S]*?font-size:\s*clamp\(3\.5rem,\s*4\.6vw,\s*5\.5rem\);/s,
    )
    expect(liveTypographyCss).toMatch(
      /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.locations-scene \.section-frame__heading h2[\s\S]*?font-size:\s*clamp\(3\.6rem,\s*4\.8vw,\s*5\.8rem\);/s,
    )
    expect(liveTypographyCss).toMatch(
      /@media\s*\(max-width:\s*1023px\)[\s\S]*?\.menu-scene \.section-frame__heading h2,\s*\.about-scene \.section-frame__heading h2,\s*\.visit-scene \.section-frame__heading h2,\s*\.events-scene \.section-frame__heading h2,\s*\.locations-scene \.section-frame__heading h2\s*\{[^}]*font-family:\s*var\(--font-display\);[^}]*font-weight:\s*400;[^}]*overflow:\s*visible;[^}]*opacity:\s*1;[^}]*visibility:\s*visible;/s,
    )
    expect(liveTypographyCss).not.toContain('title-reference')
  })
})
