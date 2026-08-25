import { render } from '@testing-library/react'

import {
  aboutTitleReferenceLowerExtract,
  aboutTitleReferenceUpperExtract,
  eventsTitleReferenceExtract,
  locationsTitleReferenceExtract,
  menuTitleReferenceExtract,
  visitTitleReferenceExtract,
} from '../data/media'
import { AboutSection } from './AboutSection'
import { EventsSection } from './EventsSection'
import { LocationsSection } from './LocationsSection'
import { MenuSection } from './MenuSection'
import { VisitSection } from './VisitSection'
import globalCss from '../styles/global.css?raw'

describe('section reference title visual contract', () => {
  it('renders the menu title extract as one desktop-only provenance layer beside a live h2', () => {
    const { container } = render(<MenuSection />)
    const menu = container.querySelector('#menu') as HTMLElement
    const picture = menu.querySelector(
      '[data-conditional-layer="title-reference-menu-title-reference-extract"]',
    )
    const source = picture?.querySelector('source')

    expect(picture).toHaveClass('menu-scene__title-reference')
    expect(picture).toHaveAttribute('data-media-kind', 'decorative-reference-extract')
    expect(source).toHaveAttribute('srcset', menuTitleReferenceExtract.srcSet)
    expect(source).toHaveAttribute('sizes', menuTitleReferenceExtract.sizes)
    expect(source).toHaveAttribute('media', '(min-width: 1024px)')
    expect(menu.querySelector('h2#menu-title')).toHaveTextContent('Завтраки')
    expect(globalCss).toMatch(
      /\.menu-scene__title-reference\s*\{[^}]*left:\s*10\.77%;[^}]*top:\s*10\.41%;[^}]*width:\s*50\.48vw;/s,
    )
  })

  it('keeps the about title split into measured upper and lower extracts with one live h2', () => {
    const { container } = render(<AboutSection />)
    const about = container.querySelector('#about') as HTMLElement
    const upper = about.querySelector(
      '[data-conditional-layer="title-reference-about-title-reference-upper-extract"]',
    )
    const lower = about.querySelector(
      '[data-conditional-layer="title-reference-about-title-reference-lower-extract"]',
    )

    expect(upper).toHaveClass('about-scene__title-reference-upper')
    expect(lower).toHaveClass('about-scene__title-reference-lower')
    expect(upper?.querySelector('source')).toHaveAttribute(
      'srcset',
      aboutTitleReferenceUpperExtract.srcSet,
    )
    expect(lower?.querySelector('source')).toHaveAttribute(
      'srcset',
      aboutTitleReferenceLowerExtract.srcSet,
    )
    expect(about.querySelectorAll('h2#about-title')).toHaveLength(1)
    expect(about.querySelector('h2#about-title')).toHaveTextContent('О White Cup')
    expect(globalCss).toMatch(
      /\.about-scene__title-reference-upper\s*\{[^}]*left:\s*4\.43%;[^}]*top:\s*14\.03%;[^}]*width:\s*47\.55vw;/s,
    )
    expect(globalCss).toMatch(
      /\.about-scene__title-reference-lower\s*\{[^}]*left:\s*4\.43%;[^}]*top:\s*33\.48%;[^}]*width:\s*52\.33vw;/s,
    )
  })

  it.each([
    {
      id: 'visit',
      className: 'visit-scene__title-reference',
      asset: visitTitleReferenceExtract,
      render: <VisitSection />,
      title: 'У нас есть место',
      geometry: /\.visit-scene__title-reference\s*\{[^}]*left:\s*7\.06%;[^}]*top:\s*14\.88%;[^}]*width:\s*47\.85vw;/s,
    },
    {
      id: 'events',
      className: 'events-scene__title-reference',
      asset: eventsTitleReferenceExtract,
      render: <EventsSection />,
      title: 'Завтраки, встречи',
      geometry: /\.events-scene__title-reference\s*\{[^}]*left:\s*4\.31%;[^}]*top:\s*21\.04%;[^}]*width:\s*47\.25vw;/s,
    },
    {
      id: 'locations',
      className: 'locations-scene__title-reference',
      asset: locationsTitleReferenceExtract,
      render: <LocationsSection />,
      title: 'Как нас найти',
      geometry: /\.locations-scene__title-reference\s*\{[^}]*left:\s*4\.43%;[^}]*top:\s*23\.38%;[^}]*width:\s*46\.95vw;/s,
    },
  ])('uses a measured desktop title extract for $id while retaining a live h2', ({
    id,
    className,
    asset,
    render: scene,
    title,
    geometry,
  }) => {
    const { container } = render(scene)
    const section = container.querySelector(`#${id}`) as HTMLElement
    const picture = section.querySelector(
      `[data-conditional-layer="title-reference-${asset.id}"]`,
    )

    expect(picture).toHaveClass(className)
    expect(picture).toHaveAttribute('data-media-kind', 'decorative-reference-extract')
    expect(picture?.querySelector('source')).toHaveAttribute('srcset', asset.srcSet)
    expect(picture?.querySelector('source')).toHaveAttribute('sizes', asset.sizes)
    expect(picture?.querySelector('source')).toHaveAttribute('media', '(min-width: 1024px)')
    expect(section.querySelector('h2')).toHaveTextContent(title)
    expect(globalCss).toMatch(geometry)
  })
})
