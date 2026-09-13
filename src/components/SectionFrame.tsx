import type { HTMLAttributes, ReactNode } from 'react'

export interface SectionFrameProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  id: string
  title: ReactNode
  kicker?: string
  children: ReactNode
}

/**
 * A section with an accessible heading and consistent page gutters.
 */
export function SectionFrame({
  id,
  title,
  kicker,
  children,
  className,
  ...rest
}: SectionFrameProps) {
  const titleId = `${id}-title`

  return (
    <section
      {...rest}
      id={id}
      className={['scene', 'section-frame', className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
      data-scene={id}
    >
      <div className="section-inner section-frame__inner">
        <div className="section-frame__heading">
          {kicker ? <p className="eyebrow scene-kicker">{kicker}</p> : null}
          <h2 id={titleId} className="section-title">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  )
}
