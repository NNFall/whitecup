export type DoodlesVariant = 'hero' | 'about' | 'visit' | 'events' | 'locations'

export interface DoodlesProps {
  variant?: DoodlesVariant
  className?: string
}

export function Doodles({ variant = 'hero', className }: DoodlesProps) {
  return (
    <div
      className={['doodles', `doodles--${variant}`, className].filter(Boolean).join(' ')}
      aria-hidden="true"
      data-doodle
    >
      <svg viewBox="0 0 160 120" focusable="false">
        {variant === 'hero' ? (
          <>
            <path d="M25 77c-4-23 10-40 28-40 17 0 25 12 24 27-2 23-22 31-52 13Z" />
            <path d="M80 36c14-13 33-13 44-1-6 4-12 5-18 4 2 9 0 17-5 24" />
            <path d="M98 79c8 4 15 4 23-1M106 85c5 3 9 3 14 0" />
          </>
        ) : null}
        {variant === 'about' ? (
          <>
            <path d="M19 42c15-16 27-19 42-8-5 12-15 20-29 24M72 22c11 6 16 17 13 30" />
            <path d="M92 67c14-11 29-10 45 3-12 6-24 7-37 3M118 34v23M108 45h20" />
          </>
        ) : null}
        {variant === 'visit' ? (
          <>
            <path d="M20 78c14-7 26-7 40 0M22 67c4-8 10-12 18-12s15 4 20 12" />
            <path d="M100 30c16 2 28 12 30 28-14 4-27 1-36-8M91 77c4-12 13-19 27-22" />
          </>
        ) : null}
        {variant === 'events' ? (
          <>
            <path d="M20 29c10 10 11 20 4 31 15 6 24 15 26 28" />
            <path d="M89 25c0 10 6 17 18 21-8 7-10 16-5 27M124 19l3 8 8 3-8 3-3 9-3-9-8-3 8-3Z" />
          </>
        ) : null}
        {variant === 'locations' ? (
          <>
            <path d="M31 81c-3-20 5-35 22-41 18 7 23 22 18 41-13 6-26 6-40 0Z" />
            <path d="M51 51v-9M51 34v-8M51 20v-7M105 78c4-12 11-18 22-18 9 0 15 7 17 18M117 60v-9" />
          </>
        ) : null}
      </svg>
    </div>
  )
}
