import { render } from '@testing-library/react'

import { heroTitleReferenceExtract } from '../data/media'
import { ReferenceTitleLayer } from './ReferenceTitleLayer'
import { SectionFrame } from './SectionFrame'

describe('ReferenceTitleLayer', () => {
  it('keeps a responsive reference extract desktop-only while exposing layer provenance', () => {
    const { container } = render(
      <ReferenceTitleLayer
        asset={heroTitleReferenceExtract}
        className="menu-scene__title-reference"
      />,
    )

    const picture = container.querySelector('picture')
    const source = picture?.querySelector('source')
    const image = picture?.querySelector('img')

    expect(picture).toHaveAttribute(
      'data-conditional-layer',
      'title-reference-hero-title-reference-extract',
    )
    expect(picture).toHaveAttribute('aria-hidden', 'true')
    expect(picture).toHaveClass('section-frame__title-reference', 'menu-scene__title-reference')
    expect(source).toHaveAttribute('media', '(min-width: 1024px)')
    expect(source).toHaveAttribute('srcset', heroTitleReferenceExtract.srcSet)
    expect(source).toHaveAttribute('sizes', heroTitleReferenceExtract.sizes)
    expect(image).toHaveAttribute('src', expect.stringContaining('R0lGODlhAQABA'))
    expect(image).toHaveAttribute('data-layer', 'decoration')
    expect(image).toHaveAttribute('data-media-kind', 'decorative-reference-extract')
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveAttribute('aria-hidden', 'true')
    expect(image).toHaveAttribute('loading', 'eager')
    expect(image).toHaveAttribute('decoding', 'sync')
  })

  it('lets SectionFrame render reference layers before the live semantic heading', () => {
    const { container } = render(
      <SectionFrame
        id="menu"
        title="Завтраки"
        referenceTitles={[{
          asset: heroTitleReferenceExtract,
          className: 'menu-scene__title-reference',
        }]}
      >
        <p>Content</p>
      </SectionFrame>,
    )

    const inner = container.querySelector('.section-frame__inner')
    expect(inner?.firstElementChild?.tagName).toBe('PICTURE')
    expect(inner?.children[1]).toHaveClass('section-frame__heading')
    expect(inner?.querySelector('h2')).toHaveTextContent('Завтраки')
  })
})
