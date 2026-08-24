import { fireEvent, render } from '@testing-library/react'
import { vi } from 'vitest'

import { SceneLayer } from './SceneLayer'

describe('SceneLayer', () => {
  it('renders the requested layer provenance and forwards native image props', () => {
    const onError = vi.fn()
    const { container } = render(
      <SceneLayer
        className="hero-bagel"
        layer="foreground"
        mediaKind="decorative-reference-edit"
        onError={onError}
        src="/media/hero-bagel-cutout-poc.png"
      />,
    )

    const image = container.querySelector('img')
    expect(image).toHaveClass('hero-bagel')
    expect(image).toHaveAttribute('src', '/media/hero-bagel-cutout-poc.png')
    expect(image).toHaveAttribute('data-layer', 'foreground')
    expect(image).toHaveAttribute('data-media-kind', 'decorative-reference-edit')

    fireEvent.error(image as HTMLImageElement)
    expect(onError).toHaveBeenCalledOnce()
  })

  it('defaults to an empty alternative and remains hidden from assistive technology', () => {
    const { container } = render(
      <SceneLayer
        aria-hidden={false}
        layer="decoration"
        mediaKind="decorative-reference-extract"
        src="/media/hero-doodles-exact.png"
      />,
    )

    const image = container.querySelector('img')
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveAttribute('aria-hidden', 'true')
  })
})
