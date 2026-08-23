import type { CSSProperties } from 'react'

import type { DocumentaryMediaProvenance } from '../data/media'

export interface OrganicPhotoProps {
  media: DocumentaryMediaProvenance
  className?: string
  aspectRatio?: string
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
  sizes?: string
  caption?: string
}

/** A documentary photo frame with an explicit layout ratio and organic edge. */
export function OrganicPhoto({
  media,
  className,
  aspectRatio = '4 / 3',
  loading = 'lazy',
  fetchPriority = 'auto',
  sizes = '(max-width: 720px) 92vw, 48vw',
  caption,
}: OrganicPhotoProps) {
  return (
    <figure
      className={['organic-photo', className].filter(Boolean).join(' ')}
      style={{ '--photo-ratio': aspectRatio } as CSSProperties}
      data-media-id={media.id}
      data-media-kind={media.kind}
    >
      <picture>
        <source media="(max-width: 720px)" srcSet={media.src} />
        <img
          src={media.src}
          alt={media.alt}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          sizes={sizes}
        />
      </picture>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}
