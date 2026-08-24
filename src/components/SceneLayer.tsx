import type { ImgHTMLAttributes } from 'react'

import type { SceneLayerMediaKind } from '../data/media'

export interface SceneLayerProps extends ImgHTMLAttributes<HTMLImageElement> {
  layer: 'backdrop' | 'foreground' | 'decoration'
  mediaKind: SceneLayerMediaKind
}

export function SceneLayer({ alt = '', layer, mediaKind, ...props }: SceneLayerProps) {
  return (
    <img
      {...props}
      alt={alt}
      aria-hidden="true"
      data-layer={layer}
      data-media-kind={mediaKind}
    />
  )
}
