import type { ImgHTMLAttributes } from 'react'

import type {
  DecorativeMediaProvenance,
  SceneLayerRole,
} from '../data/media'

type NativeSceneLayerImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'alt' | 'aria-hidden' | 'src'
>

export interface SceneLayerProps extends NativeSceneLayerImageProps {
  alt?: ''
  asset: DecorativeMediaProvenance
  layer: SceneLayerRole
  src: string
}

export function SceneLayer({ alt = '', asset, layer, src, ...props }: SceneLayerProps) {
  return (
    <img
      {...props}
      alt={alt}
      aria-hidden="true"
      data-layer={layer}
      data-media-kind={asset.provenanceKind}
      src={src}
    />
  )
}
