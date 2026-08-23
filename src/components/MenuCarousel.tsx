import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'

import type { MenuItem } from '../data/site'

export interface MenuCarouselProps {
  items: readonly MenuItem[]
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/**
 * The menu intentionally uses native overflow instead of a transform carousel.
 * That keeps touch scrolling natural, makes the final card reachable without
 * JavaScript, and lets browser scroll-snap do the hard work on small screens.
 */
export function MenuCarousel({ items }: MenuCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLLIElement | null>>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex((currentIndex) => Math.min(currentIndex, Math.max(0, items.length - 1)))
  }, [items.length])

  const moveTo = useCallback(
    (index: number) => {
      if (items.length === 0) return

      const nextIndex = Math.max(0, Math.min(index, items.length - 1))
      setActiveIndex(nextIndex)

      const card = cardRefs.current[nextIndex]
      if (!card) return

      card.scrollIntoView?.({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'start',
      })
    },
    [items.length],
  )

  const handleViewportKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      moveTo(activeIndex + 1)
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      moveTo(activeIndex - 1)
    }
  }

  const handleViewportScroll = () => {
    const viewport = viewportRef.current
    if (!viewport || viewport.clientWidth === 0) return

    // Snap points align cards to the leading edge. Tracking that edge keeps
    // arrow navigation sequential even when desktop shows several cards at
    // once (a center-distance calculation could skip an item in that layout).
    const viewportStart = viewport.scrollLeft
    let closestIndex = activeIndex
    let closestDistance = Number.POSITIVE_INFINITY

    cardRefs.current.forEach((card, index) => {
      if (!card || card.clientWidth === 0) return

      const distance = Math.abs(card.offsetLeft - viewportStart)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    setActiveIndex(closestIndex)
  }

  if (items.length === 0) {
    return <p className="menu-carousel__empty">Актуальное меню скоро появится.</p>
  }

  return (
    <div className="menu-carousel" role="region" aria-roledescription="carousel" aria-label="Избранное меню White Cup">
      <div className="menu-carousel__toolbar">
        <p className="menu-carousel__hint">Листайте, чтобы выбрать свой ритм</p>
        <div className="menu-carousel__controls" role="group" aria-label="Навигация по меню">
          <button
            className="menu-carousel__control"
            type="button"
            data-touch-target="44"
            aria-label="Предыдущая позиция"
            onClick={() => moveTo(activeIndex - 1)}
            disabled={activeIndex === 0}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            className="menu-carousel__control"
            type="button"
            data-touch-target="44"
            aria-label="Следующая позиция"
            onClick={() => moveTo(activeIndex + 1)}
            disabled={activeIndex === items.length - 1}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="menu-carousel__viewport"
        data-testid="menu-carousel-viewport"
        tabIndex={0}
        onKeyDown={handleViewportKeyDown}
        onScroll={handleViewportScroll}
        aria-label="Позиции меню, используйте стрелки для навигации"
      >
        <ul className="menu-carousel__track" aria-label="Позиции меню">
          {items.map((item, index) => (
            <li
              className="menu-card"
              key={item.id}
              ref={(element) => {
                cardRefs.current[index] = element
              }}
              data-menu-index={index}
            >
              <article aria-labelledby={`menu-card-${item.id}`}>
                <div className={`menu-card__art menu-card__art--${index % 3}`} aria-hidden="true">
                  <span className="menu-card__art-mark">{String(index + 1).padStart(2, '0')}</span>
                  <span className="menu-card__art-line" />
                </div>
                <div className="menu-card__body">
                  <p className="menu-card__eyebrow">{String(index + 1).padStart(2, '0')} / White Cup</p>
                  <h3 id={`menu-card-${item.id}`}>{item.name}</h3>
                  <p className="menu-card__description">{item.description}</p>
                  <p className="menu-card__price" aria-label={item.price ? `Цена: ${item.price}` : 'Цена уточняется'}>
                    {item.price ?? 'Актуальная цена — в меню'}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <div className="menu-carousel__footer">
        <div className="menu-carousel__dots" role="group" aria-label="Выбор позиции меню">
          {items.map((item, index) => (
            <button
              className="menu-carousel__dot"
              key={item.id}
              type="button"
              aria-label={`Перейти к ${item.name}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => moveTo(index)}
            >
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
        <p className="menu-carousel__position" aria-live="polite">
          {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </p>
      </div>
    </div>
  )
}
