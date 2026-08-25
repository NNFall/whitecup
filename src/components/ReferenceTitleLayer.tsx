import type { ImgHTMLAttributes } from 'react'

import type { ResponsiveDecorativeMediaProvenance } from '../data/media'
import { SceneLayer } from './SceneLayer'

const transparentPixel =
  'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='

export interface ReferenceTitleLayerProps {
  asset: ResponsiveDecorativeMediaProvenance
  className?: string
  imageProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'aria-hidden' | 'src'>
}

/**
 * Desktop-only exact title artwork extracted from a supplied screen reference.
 * The semantic heading remains in SectionFrame; this layer only restores the
 * reference lettering and its baked accent/underline at measured coordinates.
 */
export function ReferenceTitleLayer({ asset, className, imageProps }: ReferenceTitleLayerProps) {
  return (
    <picture
      className={['section-frame__title-reference', className].filter(Boolean).join(' ')}
      data-conditional-layer={`title-reference-${asset.id}`}
      data-media-kind={asset.provenanceKind}
      data-reference-asset={asset.id}
      aria-hidden="true"
    >
      <source media="(min-width: 1024px)" srcSet={asset.srcSet} sizes={asset.sizes} />
      <SceneLayer
        {...imageProps}
        className="section-frame__title-reference-image"
        asset={asset}
        layer="decoration"
        src={transparentPixel}
        loading="eager"
        decoding="sync"
      />
    </picture>
  )
}
