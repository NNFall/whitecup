import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'

import { menuSceneLayerManifest, type MenuCardMediaId } from '../data/media'
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
  const requestedIndexRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex((currentIndex) => Math.min(currentIndex, Math.max(0, items.length - 1)))
  }, [items.length])

  const moveTo = useCallback(
    (index: number) => {
      if (items.length === 0) return

      const nextIndex = Math.max(0, Math.min(index, items.length - 1))
      requestedIndexRef.current = nextIndex
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

    // Wide desktop layouts can expose almost the entire track: the final card
    // then reaches max-scroll without ever aligning to the leading edge. Keep
    // explicit arrow/dot choices stable, and reconcile manual scrolling by
    // normalized track progress so both boundaries remain reachable.
    if (requestedIndexRef.current !== null) {
      setActiveIndex(requestedIndexRef.current)
      return
    }

    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth)
    if (maxScroll <= 1) return

    const progress = Math.max(0, Math.min(viewport.scrollLeft / maxScroll, 1))
    setActiveIndex(Math.round(progress * (items.length - 1)))
  }

  const handleManualScrollIntent = () => {
    requestedIndexRef.current = null
  }

  if (items.length === 0) {
    return <p className="menu-carousel__empty">Актуальное меню скоро появится.</p>
  }

  return (
    <div className="menu-carousel" role="region" aria-roledescription="carousel" aria-label="Избранное меню White Cup">
      <div className="menu-carousel__toolbar">
        <p className="menu-carousel__hint">Популярное и сезонное</p>
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
        onWheel={handleManualScrollIntent}
        onPointerDown={handleManualScrollIntent}
        onTouchStart={handleManualScrollIntent}
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
                <div className="menu-card__art">
                  <img
                    src={menuSceneLayerManifest.cards[item.id as MenuCardMediaId].src}
                    srcSet={menuSceneLayerManifest.cards[item.id as MenuCardMediaId].srcSet}
                    sizes={menuSceneLayerManifest.cards[item.id as MenuCardMediaId].sizes}
                    alt=""
                    aria-hidden="true"
                    data-scene-card-image=""
                    data-media-kind={menuSceneLayerManifest.cards[item.id as MenuCardMediaId].asset.provenanceKind}
                    loading="lazy"
                    decoding="async"
                  />
                  {item.id === 'cheesecake' ? <span className="menu-card__season">Сезон</span> : null}
                  <span className="menu-card__favorite" aria-hidden="true" />
                </div>
                <div className="menu-card__body">
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
      <p className="menu-carousel__note">
        <span className="menu-carousel__note-mark" aria-hidden="true" />
        Это лишь часть меню — <span>листайте</span>, чтобы увидеть больше!
      </p>
    </div>
  )
}
