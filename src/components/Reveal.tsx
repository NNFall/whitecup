import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'

export interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  delay?: number
}

export function Reveal({ children, className, delay = 0, style, ...rest }: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'pending' | 'visible'>('pending')

  useEffect(() => {
    if (typeof window === 'undefined') {
      setState('visible')
      return
    }

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const element = elementRef.current

    if (reducedMotion || !element || typeof IntersectionObserver === 'undefined') {
      setState('visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setState('visible')
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      {...rest}
      ref={elementRef}
      className={['reveal', className].filter(Boolean).join(' ')}
      data-testid="reveal"
      data-reveal-state={state}
      style={{ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
