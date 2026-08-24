import { useId } from 'react'

import { heroLogoBadge, menuLogoReferenceCrop } from '../data/media'

interface BrandMarkProps {
  variant?: 'default' | 'badge' | 'menu'
}

export function BrandMark({ variant = 'default' }: BrandMarkProps) {
  const titleId = useId()
  const isBadge = variant === 'badge'

  if (variant === 'menu') {
    return (
      <span className="brand-mark brand-mark--menu" data-media-kind="decorative-reference">
        <img
          className="brand-mark__icon"
          src={menuLogoReferenceCrop.src}
          alt={menuLogoReferenceCrop.alt}
          data-media-kind="decorative-reference"
          draggable="false"
        />
      </span>
    )
  }

  if (isBadge) {
    return (
      <span className="brand-mark brand-mark--badge" data-media-kind="decorative-reference">
        <img
          className="brand-mark__icon"
          src={heroLogoBadge.src}
          alt={heroLogoBadge.alt}
          data-media-kind="decorative-reference"
          draggable="false"
        />
      </span>
    )
  }

  return (
    <span className="brand-mark">
      <svg
        className="brand-mark__icon"
        viewBox="0 0 48 48"
        role="img"
        aria-labelledby={titleId}
        focusable="false"
      >
        <title id={titleId}>White Cup</title>
        <path
          className="brand-mark__steam"
          d="M18.3 8.8c-2.1 2.6 2.1 3.8 0 6.5-1.8 2.2-.6 4.1 1.1 5.1"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.2"
        />
        <path
          className="brand-mark__cup"
          d="M10.1 20.9h23.8v10.2c0 5.1-4.1 9.2-9.2 9.2h-5.4c-5.1 0-9.2-4.1-9.2-9.2V20.9Z"
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2.2"
        />
        <path
          className="brand-mark__handle"
          d="M33.8 24.2h3.4c3 0 4.9 1.8 4.9 4.4s-1.9 4.4-4.9 4.4h-3.4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
        />
        <path
          className="brand-mark__accent"
          d="M13.8 25.3h16.4"
          fill="none"
          stroke="var(--orange)"
          strokeLinecap="round"
          strokeWidth="2.2"
        />
      </svg>
      {!isBadge && <span className="brand-mark__word">White Cup</span>}
    </span>
  )
}
