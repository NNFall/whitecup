import type { HTMLAttributes, ReactNode } from 'react'

export interface SectionFrameProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  id: string
  title: string
  kicker?: string
  children: ReactNode
}

/**
 * Shared paper scene wrapper. Keeping the heading relationship here means
 * every non-hero scene remains navigable when the page is read as landmarks.
 */
export function SectionFrame({ id, title, kicker, children, className, ...rest }: SectionFrameProps) {
  const titleId = `${id}-title`

  return (
    <section
      {...rest}
      id={id}
      className={['scene', 'section-frame', className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
      data-scene={id}
    >
      <div className="section-frame__inner">
        <div className="section-frame__heading">
          {kicker ? <p className="scene-kicker">{kicker}</p> : null}
          <h2 id={titleId}>{title}</h2>
        </div>
        {children}
      </div>
    </section>
  )
}
