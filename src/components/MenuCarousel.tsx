import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'

import { menuSceneLayerManifest, type MenuCardMediaId } from '../data/media'
import type { MenuItem } from '../data/site'

export interface MenuCarouselProps {
  items: readonly MenuItem[]
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const getCardOffset = (viewport: HTMLDivElement, card: HTMLLIElement) =>
  Math.max(0, card.offsetLeft - viewport.offsetLeft)

const getNearestCardIndex = (
  viewport: HTMLDivElement,
  cards: readonly (HTMLLIElement | null)[],
  requestedScrollLeft = viewport.scrollLeft,
) => {
  const scrollLeft = Math.max(0, requestedScrollLeft)
  let nearestIndex = 0
  let nearestDistance = Number.POSITIVE_INFINITY

  cards.forEach((card, index) => {
    if (!card) return

    const distance = Math.abs(getCardOffset(viewport, card) - scrollLeft)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestIndex = index
    }
  })

  return nearestIndex
}

interface PendingScrollTarget {
  left: number
}

function MenuCard({
  item,
  index,
  itemCount,
  setCardRef,
}: {
  item: MenuItem
  index: number
  itemCount: number
  setCardRef: (element: HTMLLIElement | null) => void
}) {
  const media = menuSceneLayerManifest.cards[item.id as MenuCardMediaId]
  const cardId = `menu-card-${item.id}`
  const descriptionId = `${cardId}-description`

  return (
    <li
      className="menu-card"
      ref={setCardRef}
      data-menu-index={index}
      aria-posinset={index + 1}
      aria-setsize={itemCount}
    >
      <article aria-labelledby={cardId} aria-describedby={descriptionId}>
        <div className="menu-card__media">
          {media ? (
            <img
              src={media.src}
              srcSet={media.srcSet}
              sizes={media.sizes}
              alt=""
              aria-hidden="true"
              data-scene-card-image=""
              data-media-kind={media.asset.provenanceKind}
              loading="lazy"
              decoding="async"
            />
          ) : null}
        </div>
        <div className="menu-card__body">
          <h3 id={cardId}>{item.name}</h3>
          <p className="menu-card__description" id={descriptionId}>
            {item.description}
          </p>
        </div>
      </article>
    </li>
  )
}

export function MenuCarousel({ items }: MenuCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLLIElement | null>>([])
  const pendingScrollRef = useRef<PendingScrollTarget | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [navigation, setNavigation] = useState({ atStart: true, atEnd: false })

  const getNavigation = (viewport: HTMLDivElement) => {
    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth)
    const scrollLeft = Math.max(0, viewport.scrollLeft)

    return {
      atStart: scrollLeft <= 1,
      atEnd: scrollLeft >= maxScroll - 1,
    }
  }

  const scrollToIndex = (requestedIndex: number) => {
    if (items.length === 0) return

    const index = Math.max(0, Math.min(requestedIndex, items.length - 1))
    const viewport = viewportRef.current
    const card = cardRefs.current[index]

    if (!viewport || !card) return

    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth)
    const left = Math.min(getCardOffset(viewport, card), maxScroll)
    const targetIndex = getNearestCardIndex(viewport, cardRefs.current.slice(0, items.length), left)
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'

    pendingScrollRef.current = { left }
    setActiveIndex(targetIndex)
    setNavigation(getNavigation(viewport))

    if (typeof viewport.scrollTo === 'function') {
      viewport.scrollTo({ left, behavior })
    } else {
      viewport.scrollLeft = left
    }
  }

  const handleViewportKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollToIndex(activeIndex - 1)
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollToIndex(activeIndex + 1)
    }
  }

  const handleViewportScroll = () => {
    const viewport = viewportRef.current
    if (!viewport) return

    const pendingTarget = pendingScrollRef.current
    if (pendingTarget) {
      // Smooth scrolling emits intermediate events. Keep the announced card
      // stable until the requested snap point is reached, otherwise the
      // counter briefly jumps back to the card the animation started from.
      if (Math.abs(viewport.scrollLeft - pendingTarget.left) > 1) {
        setNavigation(getNavigation(viewport))
        return
      }

      pendingScrollRef.current = null
    }

    const nextIndex = getNearestCardIndex(viewport, cardRefs.current.slice(0, items.length))
    setActiveIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex))
    setNavigation(getNavigation(viewport))
  }

  const cancelPendingScroll = () => {
    pendingScrollRef.current = null
  }

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const updateNavigation = () => {
      setNavigation(getNavigation(viewport))
    }

    updateNavigation()
    window.addEventListener('resize', updateNavigation)

    if (typeof ResizeObserver === 'undefined') {
      return () => window.removeEventListener('resize', updateNavigation)
    }

    const observer = new ResizeObserver(updateNavigation)
    observer.observe(viewport)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateNavigation)
    }
  }, [items.length])

  if (items.length === 0) {
    return <p className="menu-carousel__empty">Актуальное меню скоро появится.</p>
  }

  return (
    <div className="menu-carousel" role="region" aria-label="Меню White Cup">
      <div className="menu-carousel__toolbar">
        <p className="menu-carousel__guide">Листайте меню</p>
        <div className="menu-carousel__controls" role="group" aria-label="Навигация по меню">
          <button
            className="menu-carousel__control"
            type="button"
            data-touch-target="44"
            aria-label="Предыдущая позиция меню"
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={navigation.atStart}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            className="menu-carousel__control"
            type="button"
            data-touch-target="44"
            aria-label="Следующая позиция меню"
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={navigation.atEnd}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div className="menu-carousel__viewport-shell">
        <div
          ref={viewportRef}
          className="menu-carousel__viewport"
          data-testid="menu-carousel-viewport"
          tabIndex={0}
          onKeyDown={handleViewportKeyDown}
          onScroll={handleViewportScroll}
          onWheel={cancelPendingScroll}
          onPointerDown={cancelPendingScroll}
          onTouchStart={cancelPendingScroll}
          aria-label="Позиции меню, используйте стрелки для навигации"
        >
          <ul className="menu-carousel__track" aria-label="Позиции меню">
            {items.map((item, index) => (
              <MenuCard
                key={item.id}
                item={item}
                index={index}
                itemCount={items.length}
                setCardRef={(element) => {
                  cardRefs.current[index] = element
                }}
              />
            ))}
          </ul>
        </div>
      </div>

      <div className="menu-carousel__footer">
        <div
          className="menu-carousel__progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={items.length}
          aria-valuenow={activeIndex + 1}
          aria-valuetext={`Позиция ${activeIndex + 1} из ${items.length}`}
        >
          <span
            style={{ '--menu-progress': `${((activeIndex + 1) / items.length) * 100}%` } as CSSProperties}
          />
        </div>
        <p className="menu-carousel__position" aria-live="polite" aria-atomic="true">
          {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </p>
      </div>
    </div>
  )
}
