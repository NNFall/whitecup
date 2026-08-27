import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'

import { menuSceneLayerManifest, type MenuCardMediaId } from '../data/media'
import type { MenuItem } from '../data/site'
import '../styles/menu-carousel-polish.css'

export interface MenuCarouselProps {
  items: readonly MenuItem[]
  fullMenuUrl?: string
  provenanceDescriptionId?: string
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

type MenuScrollBehavior = 'auto' | 'smooth'

const PROGRAMMATIC_SCROLL_FALLBACK_MS = 1000

const getNativeScrollTarget = (viewport: HTMLDivElement, card: HTMLLIElement) => {
  // The isolated track stylesheet adds enough trailing range for every card
  // to align to this exact native offset. Do not clamp here: doing so would
  // collapse later dot positions whenever layout is measured before the
  // trailing range has settled, and the browser natively clamps impossible
  // values at the true scroll boundary.
  return Math.max(0, card.offsetLeft - viewport.offsetLeft)
}

const getNearestCardIndex = (
  viewport: HTMLDivElement,
  cards: readonly (HTMLLIElement | null)[],
  itemCount: number,
) => {
  const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth)
  const currentScroll = Math.max(0, Math.min(viewport.scrollLeft, maxScroll || viewport.scrollLeft))
  const offsets = cards.slice(0, itemCount).map((card) =>
    card ? Math.max(0, card.offsetLeft - viewport.offsetLeft) : null,
  )
  const measuredOffsets = offsets.filter((offset): offset is number => offset !== null)
  const hasDistinctCardOffsets = measuredOffsets.some(
    (offset, index) => index > 0 && Math.abs(offset - measuredOffsets[0]) > 1,
  )

  // Several cards can legitimately share the maximum snap position when the
  // viewport intentionally shows multiple cards. The boundary itself still
  // represents the final item for controls, dots, and assistive technology.
  if (itemCount > 1 && maxScroll > 1 && currentScroll >= maxScroll - 1) return itemCount - 1

  // Layout metrics are unavailable in JSDOM. Progress is a safe fallback for
  // that case and still maps the real maximum scroll boundary to the final
  // item when a browser exposes no individual card offsets.
  if (!hasDistinctCardOffsets) {
    if (maxScroll <= 1 || itemCount <= 1) return 0
    return Math.max(0, Math.min(itemCount - 1, Math.round((currentScroll / maxScroll) * (itemCount - 1))))
  }

  return offsets.reduce<number>((nearestIndex, offset, index) => {
    if (offset === null) return nearestIndex

    const target = maxScroll > 0 ? Math.min(offset, maxScroll) : offset
    const nearestOffset = offsets[nearestIndex]
    if (nearestOffset === null) return index

    const nearestTarget = maxScroll > 0 ? Math.min(nearestOffset, maxScroll) : nearestOffset
    return Math.abs(target - currentScroll) < Math.abs(nearestTarget - currentScroll)
      ? index
      : nearestIndex
  }, 0)
}

/**
 * The menu intentionally uses native overflow instead of a transform carousel.
 * That keeps touch scrolling natural, makes the final card reachable without
 * JavaScript, and lets browser scroll-snap do the hard work on small screens.
 */
function DecorativeMenuSliver({ item, side }: { item: MenuItem; side: 'left' | 'right' }) {
  const media = menuSceneLayerManifest.cards[item.id as MenuCardMediaId]

  return (
    <div
      className={`menu-card menu-carousel__sliver menu-carousel__sliver--${side}`}
      data-menu-sliver={side}
      aria-hidden="true"
    >
      <article>
        <div className="menu-card__art">
          <img
            src={media.src}
            srcSet={media.srcSet}
            sizes={media.sizes}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <span className="menu-card__favorite" aria-hidden="true" />
        </div>
        <div className="menu-card__body">
          <h3>{item.name}</h3>
          <p className="menu-card__description">{item.description}</p>
        </div>
      </article>
    </div>
  )
}

export function MenuCarousel({ items, fullMenuUrl, provenanceDescriptionId }: MenuCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLLIElement | null>>([])
  const pendingIndexRef = useRef<number | null>(null)
  const pendingFallbackTimerRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex((currentIndex) => Math.min(currentIndex, Math.max(0, items.length - 1)))
  }, [items.length])

  const reconcileViewport = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport || viewport.clientWidth === 0) return

    setActiveIndex(getNearestCardIndex(viewport, cardRefs.current, items.length))
  }, [items.length])

  const clearPendingFallbackTimer = useCallback(() => {
    if (pendingFallbackTimerRef.current === null) return

    if (typeof window !== 'undefined') {
      window.clearTimeout(pendingFallbackTimerRef.current)
    }
    pendingFallbackTimerRef.current = null
  }, [])

  const clearPendingProgrammaticTarget = useCallback(
    (reconcile = false) => {
      pendingIndexRef.current = null
      clearPendingFallbackTimer()
      if (reconcile) reconcileViewport()
    },
    [clearPendingFallbackTimer, reconcileViewport],
  )

  const schedulePendingFallback = useCallback(() => {
    clearPendingFallbackTimer()
    if (typeof window === 'undefined') return

    pendingFallbackTimerRef.current = window.setTimeout(() => {
      pendingFallbackTimerRef.current = null
      pendingIndexRef.current = null
      reconcileViewport()
    }, PROGRAMMATIC_SCROLL_FALLBACK_MS)
  }, [clearPendingFallbackTimer, reconcileViewport])

  const moveTo = useCallback(
    (index: number) => {
      if (items.length === 0) return

      const nextIndex = Math.max(0, Math.min(index, items.length - 1))
      setActiveIndex(nextIndex)

      const viewport = viewportRef.current
      const card = cardRefs.current[nextIndex]
      if (!viewport || !card) {
        clearPendingProgrammaticTarget()
        return
      }

      pendingIndexRef.current = nextIndex
      schedulePendingFallback()

      const behavior: MenuScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth'
      const targetLeft = getNativeScrollTarget(viewport, card)

      if (typeof viewport.scrollTo === 'function') {
        viewport.scrollTo({ left: targetLeft, behavior })
      } else {
        // scrollTo is supported by target browsers; this keeps the control
        // useful in older engines without hijacking touch or wheel scrolling.
        viewport.scrollLeft = targetLeft
      }
    },
    [clearPendingProgrammaticTarget, items.length, schedulePendingFallback],
  )

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => {
      const pendingIndex = pendingIndexRef.current
      if (pendingIndex !== null) {
        // Recalculate a pending target after responsive geometry changes so a
        // viewport resize cannot leave the requested card at a stale offset.
        const card = cardRefs.current[pendingIndex]
        if (!card) {
          clearPendingProgrammaticTarget(true)
          return
        }

        const targetLeft = getNativeScrollTarget(viewport, card)
        const behavior: MenuScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth'
        if (typeof viewport.scrollTo === 'function') {
          viewport.scrollTo({ left: targetLeft, behavior })
        } else {
          viewport.scrollLeft = targetLeft
        }
        schedulePendingFallback()
        return
      }

      reconcileViewport()
    })

    observer.observe(viewport)
    return () => observer.disconnect()
  }, [clearPendingProgrammaticTarget, reconcileViewport, schedulePendingFallback])

  useEffect(() => () => clearPendingFallbackTimer(), [clearPendingFallbackTimer])

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

    const pendingIndex = pendingIndexRef.current
    if (pendingIndex !== null) {
      setActiveIndex(pendingIndex)
      return
    }

    reconcileViewport()
  }

  const handleViewportScrollEnd = () => {
    clearPendingProgrammaticTarget(true)
  }

  const handleNativeScrollIntent = () => {
    clearPendingProgrammaticTarget(true)
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

      <div className="menu-carousel__viewport-shell">
        {items[1] ? <DecorativeMenuSliver item={items[1]} side="left" /> : null}
        <div
          ref={viewportRef}
          className="menu-carousel__viewport"
          data-testid="menu-carousel-viewport"
          tabIndex={0}
          onKeyDown={handleViewportKeyDown}
          onScroll={handleViewportScroll}
          onScrollEnd={handleViewportScrollEnd}
          onWheel={handleNativeScrollIntent}
          onPointerDown={handleNativeScrollIntent}
          onTouchStart={handleNativeScrollIntent}
          aria-label="Позиции меню, используйте стрелки для навигации"
        >
          <ul className="menu-carousel__track" aria-label="Позиции меню">
            {items.map((item, index) => {
              const descriptionId = `menu-card-${item.id}-description`
              const factsId = `menu-card-${item.id}-facts`

              return (
                <li
                  className="menu-card"
                  key={item.id}
                  ref={(element) => {
                    cardRefs.current[index] = element
                  }}
                  data-menu-index={index}
                >
                  <article
                    aria-labelledby={`menu-card-${item.id}`}
                    aria-describedby={`${descriptionId} ${factsId}`}
                  >
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
                      <p className="menu-card__description" id={descriptionId}>{item.description}</p>
                      <span className="menu-card__facts" id={factsId}>
                        {item.price ?? 'Актуальная цена — в меню'}
                      </span>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
        {items[0] ? <DecorativeMenuSliver item={items[0]} side="right" /> : null}
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
        <span className="menu-carousel__note-copy">
          Это лишь часть меню —{' '}
          {fullMenuUrl ? (
            <a
              className="menu-carousel__menu-link"
              href={fullMenuUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Листайте: открыть полное меню в Яндекс Картах"
              aria-describedby={provenanceDescriptionId}
            >
              листайте
            </a>
          ) : (
            <span className="menu-carousel__scroll-word">листайте</span>
          )}
          {', чтобы увидеть больше!'}
        </span>
      </p>
    </div>
  )
}
