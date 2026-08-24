import { fireEvent, render } from '@testing-library/react'
import { vi } from 'vitest'

import { heroSceneLayerManifest } from '../data/media'
import { SceneLayer, type SceneLayerProps } from './SceneLayer'

type Assert<T extends true> = T
type IsRequired<T, K extends keyof T> = {} extends Pick<T, K> ? false : true
type SceneLayerRequiresSrc = Assert<IsRequired<SceneLayerProps, 'src'>>
type SceneLayerOwnsAriaHidden = Assert<
  'aria-hidden' extends keyof SceneLayerProps ? false : true
>
type SceneLayerAltIsDecorativeOnly = Assert<
  Exclude<SceneLayerProps['alt'], '' | undefined> extends never ? true : false
>

void (0 as unknown as SceneLayerRequiresSrc)
void (0 as unknown as SceneLayerOwnsAriaHidden)
void (0 as unknown as SceneLayerAltIsDecorativeOnly)

describe('SceneLayer', () => {
  it('renders the requested layer provenance and forwards native image props', () => {
    const onError = vi.fn()
    const foreground = heroSceneLayerManifest.foregrounds[0]
    const { container } = render(
      <SceneLayer
        {...foreground}
        className="hero-bagel"
        onError={onError}
      />,
    )

    const image = container.querySelector('img')
    expect(image).toHaveClass('hero-bagel')
    expect(image).toHaveAttribute('src', foreground.src)
    expect(image).toHaveAttribute('data-layer', 'foreground')
    expect(image).toHaveAttribute('data-media-kind', 'decorative-reference-edit')

    fireEvent.error(image as HTMLImageElement)
    expect(onError).toHaveBeenCalledOnce()
  })

  it('defaults to an empty alternative and remains hidden from assistive technology', () => {
    const decoration = heroSceneLayerManifest.decorations[0]
    const { container } = render(
      <SceneLayer {...decoration} />,
    )

    const image = container.querySelector('img')
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveAttribute('aria-hidden', 'true')
  })
})
