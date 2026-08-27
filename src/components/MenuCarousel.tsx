import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'

import { menuSceneLayerManifest, type MenuCardMediaId } from '../data/media'
import type { MenuItem } from '../data/site'
import '../styles/menu-carousel-polish.css'

export interface MenuCarouselProps {
  items: readonly MenuItem[]
  fullMenuUrl?: string
  provenanceDescriptionId?: string
}

type MenuCopy = 'leading' | 'middle' | 'trailing'
type MenuScrollBehavior = 'auto' | 'smooth'

const PROGRAMMATIC_SCROLL_FALLBACK_MS = 1000

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const modulo = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor

const isClonePhysicalIndex = (physicalIndex: number, itemCount: number) =>
  physicalIndex < itemCount || physicalIndex >= itemCount * 2

const getLogicalIndex = (physicalIndex: number, itemCount: number) => modulo(physicalIndex, itemCount)

const getNativeScrollTarget = (viewport: HTMLDivElement, card: HTMLLIElement) =>
  Math.max(0, card.offsetLeft - viewport.offsetLeft)

const getNearestCardIndex = (
  viewport: HTMLDivElement,
  cards: readonly (HTMLLIElement | null)[],
) => {
  const cardEntries = cards
    .map((card, index) => ({
      card,
      index,
      offset: card ? Math.max(0, card.offsetLeft - viewport.offsetLeft) : null,
    }))
    .filter((entry): entry is { card: HTMLLIElement; index: number; offset: number } => entry.offset !== null)

  if (cardEntries.length === 0) return 0

  const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth)
  const currentScroll = Math.max(0, Math.min(viewport.scrollLeft, maxScroll || viewport.scrollLeft))

  // At the native end boundary the browser can expose the same snap position
  // for more than one card. The final physical clone is still the correct
  // source of truth until scrollend recenters it into the middle copy.
  if (maxScroll > 1 && currentScroll >= maxScroll - 1) return cardEntries.at(-1)?.index ?? 0

  const hasDistinctOffsets = cardEntries.some(
    (entry, index) => index > 0 && Math.abs(entry.offset - cardEntries[0].offset) > 1,
  )

  // JSDOM does not calculate layout metrics. When it does expose a range but
  // no individual offsets, preserve a useful physical progress estimate.
  if (!hasDistinctOffsets) {
    if (maxScroll <= 1 || cards.length <= 1) return cardEntries[0].index
    return Math.max(0, Math.min(cards.length - 1, Math.round((currentScroll / maxScroll) * (cards.length - 1))))
  }

  return cardEntries.reduce((nearest, entry) =>
    Math.abs(entry.offset - currentScroll) < Math.abs(nearest.offset - currentScroll) ? entry : nearest,
  ).index
}

interface PendingNavigation {
  physicalIndex: number
  logicalIndex: number
}

function MenuCard({
  item,
  index,
  itemCount,
  copy,
  physicalIndex,
  clone,
  setCardRef,
}: {
  item: MenuItem
  index: number
  itemCount: number
  copy: MenuCopy
  physicalIndex: number
  clone: boolean
  setCardRef: (element: HTMLLIElement | null) => void
}) {
  const media = menuSceneLayerManifest.cards[item.id as MenuCardMediaId]
  const cardId = clone ? `menu-card-${item.id}-${copy}` : `menu-card-${item.id}`
  const descriptionId = `${cardId}-description`
  const factsId = `${cardId}-facts`

  return (
    <li
      className="menu-card"
      ref={setCardRef}
      data-menu-index={index}
      data-menu-physical-index={physicalIndex}
      data-menu-copy={copy}
      data-menu-loop-copy={copy}
      data-menu-clone={clone ? 'true' : undefined}
      aria-hidden={clone ? 'true' : undefined}
      tabIndex={clone ? -1 : undefined}
      aria-posinset={clone ? undefined : index + 1}
      aria-setsize={clone ? undefined : itemCount}
    >
      <article
        tabIndex={clone ? -1 : undefined}
        aria-labelledby={cardId}
        aria-describedby={`${descriptionId} ${factsId}`}
      >
        <div className="menu-card__art">
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
          {item.id === 'cheesecake' ? <span className="menu-card__season">Сезон</span> : null}
          <span className="menu-card__favorite" aria-hidden="true" />
        </div>
        <div className="menu-card__body">
          <h3 id={cardId}>{item.name}</h3>
          <p className="menu-card__description" id={descriptionId}>{item.description}</p>
          <span className="menu-card__facts" id={factsId}>
            {item.price ?? 'Актуальная цена — в меню'}
          </span>
        </div>
      </article>
    </li>
  )
}

export function MenuCarousel({ items, fullMenuUrl, provenanceDescriptionId }: MenuCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLLIElement | null>>([])
  const activePhysicalIndexRef = useRef(0)
  const pendingNavigationRef = useRef<PendingNavigation | null>(null)
  const pendingFallbackTimerRef = useRef<number | null>(null)
  const initializedItemCountRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const clearPendingFallbackTimer = useCallback(() => {
    if (pendingFallbackTimerRef.current === null) return

    if (typeof window !== 'undefined') window.clearTimeout(pendingFallbackTimerRef.current)
    pendingFallbackTimerRef.current = null
  }, [])

  const recenterToMiddle = useCallback((logicalIndex: number) => {
    const viewport = viewportRef.current
    const itemCount = items.length
    if (!viewport || itemCount === 0) return

    const normalizedIndex = modulo(logicalIndex, itemCount)
    const physicalIndex = itemCount + normalizedIndex
    const card = cardRefs.current[physicalIndex]
    if (!card) return

    activePhysicalIndexRef.current = physicalIndex
    const targetLeft = getNativeScrollTarget(viewport, card)
    if (viewport.scrollLeft !== targetLeft) viewport.scrollLeft = targetLeft
  }, [items.length])

  const reconcileViewport = useCallback(() => {
    const viewport = viewportRef.current
    const itemCount = items.length
    if (!viewport || itemCount === 0) return 0

    const physicalIndex = getNearestCardIndex(viewport, cardRefs.current.slice(0, itemCount * 3))
    activePhysicalIndexRef.current = physicalIndex
    const logicalIndex = getLogicalIndex(physicalIndex, itemCount)
    setActiveIndex(logicalIndex)
    return physicalIndex
  }, [items.length])

  const schedulePendingFallback = useCallback(() => {
    clearPendingFallbackTimer()
    if (typeof window === 'undefined') return

    pendingFallbackTimerRef.current = window.setTimeout(() => {
      pendingFallbackTimerRef.current = null
      const pending = pendingNavigationRef.current
      pendingNavigationRef.current = null
      if (!pending) return

      const physicalIndex = reconcileViewport()
      const logicalIndex = getLogicalIndex(physicalIndex, items.length)
      setActiveIndex(logicalIndex)
      if (isClonePhysicalIndex(physicalIndex, items.length)) recenterToMiddle(logicalIndex)
    }, PROGRAMMATIC_SCROLL_FALLBACK_MS)
  }, [clearPendingFallbackTimer, items.length, reconcileViewport, recenterToMiddle])

  const moveToPhysical = useCallback(
    (physicalIndex: number, logicalIndex: number) => {
      const itemCount = items.length
      if (itemCount === 0) return

      const boundedPhysicalIndex = Math.max(0, Math.min(physicalIndex, itemCount * 3 - 1))
      const normalizedLogicalIndex = modulo(logicalIndex, itemCount)
      const viewport = viewportRef.current
      const card = cardRefs.current[boundedPhysicalIndex]

      activePhysicalIndexRef.current = boundedPhysicalIndex
      setActiveIndex(normalizedLogicalIndex)

      if (!viewport || !card) {
        pendingNavigationRef.current = null
        clearPendingFallbackTimer()
        return
      }

      pendingNavigationRef.current = {
        physicalIndex: boundedPhysicalIndex,
        logicalIndex: normalizedLogicalIndex,
      }
      schedulePendingFallback()

      const behavior: MenuScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth'
      const targetLeft = getNativeScrollTarget(viewport, card)

      if (typeof viewport.scrollTo === 'function') {
        viewport.scrollTo({ left: targetLeft, behavior })
      } else {
        viewport.scrollLeft = targetLeft
      }
    },
    [clearPendingFallbackTimer, items.length, schedulePendingFallback],
  )

  const moveToLogical = useCallback(
    (logicalIndex: number) => {
      if (items.length === 0) return
      moveToPhysical(items.length + modulo(logicalIndex, items.length), logicalIndex)
    },
    [items.length, moveToPhysical],
  )

  const moveBy = useCallback(
    (delta: -1 | 1) => {
      const itemCount = items.length
      if (itemCount === 0) return

      const physicalCount = itemCount * 3
      const currentPhysical = Math.max(
        0,
        Math.min(physicalCount - 1, activePhysicalIndexRef.current),
      )
      const currentLogical = getLogicalIndex(currentPhysical, itemCount)
      let targetPhysical = currentPhysical + delta

      if (targetPhysical < 0) targetPhysical = physicalCount - 1
      if (targetPhysical >= physicalCount) targetPhysical = itemCount

      moveToPhysical(targetPhysical, currentLogical + delta)
    },
    [items.length, moveToPhysical],
  )

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const itemCount = items.length
    if (!viewport || itemCount === 0 || initializedItemCountRef.current === itemCount) return

    const middleFirstCard = cardRefs.current[itemCount]
    if (!middleFirstCard) return

    activePhysicalIndexRef.current = itemCount
    const targetLeft = getNativeScrollTarget(viewport, middleFirstCard)
    if (viewport.scrollLeft !== targetLeft) viewport.scrollLeft = targetLeft
    initializedItemCountRef.current = itemCount
  }, [items.length])

  useEffect(() => {
    if (items.length === 0) {
      setActiveIndex(0)
      return
    }

    setActiveIndex((currentIndex) => modulo(currentIndex, items.length))
  }, [items.length])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => {
      const pending = pendingNavigationRef.current
      if (pending) {
        const card = cardRefs.current[pending.physicalIndex]
        if (!card) return

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
  }, [reconcileViewport, schedulePendingFallback])

  useEffect(() => () => clearPendingFallbackTimer(), [clearPendingFallbackTimer])

  const handleViewportKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      moveBy(1)
      return
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      moveBy(-1)
    }
  }

  const handleViewportScroll = () => {
    const pending = pendingNavigationRef.current
    if (pending) {
      activePhysicalIndexRef.current = pending.physicalIndex
      setActiveIndex(pending.logicalIndex)
      return
    }

    reconcileViewport()
  }

  const handleViewportScrollEnd = () => {
    const pending = pendingNavigationRef.current
    pendingNavigationRef.current = null
    clearPendingFallbackTimer()

    if (pending) {
      activePhysicalIndexRef.current = pending.physicalIndex
      setActiveIndex(pending.logicalIndex)
      if (isClonePhysicalIndex(pending.physicalIndex, items.length)) {
        recenterToMiddle(pending.logicalIndex)
      }
      return
    }

    const physicalIndex = reconcileViewport()
    if (items.length > 0 && isClonePhysicalIndex(physicalIndex, items.length)) {
      recenterToMiddle(getLogicalIndex(physicalIndex, items.length))
    }
  }

  const handleNativeScrollIntent = () => {
    pendingNavigationRef.current = null
    clearPendingFallbackTimer()
  }

  if (items.length === 0) {
    return <p className="menu-carousel__empty">Актуальное меню скоро появится.</p>
  }

  const copies: Array<{ name: MenuCopy; clone: boolean; offset: number }> = [
    { name: 'leading', clone: true, offset: 0 },
    { name: 'middle', clone: false, offset: items.length },
    { name: 'trailing', clone: true, offset: items.length * 2 },
  ]

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
            onClick={() => moveBy(-1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            className="menu-carousel__control"
            type="button"
            data-touch-target="44"
            aria-label="Следующая позиция"
            onClick={() => moveBy(1)}
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
          onScrollEnd={handleViewportScrollEnd}
          onWheel={handleNativeScrollIntent}
          onPointerDown={handleNativeScrollIntent}
          onTouchStart={handleNativeScrollIntent}
          aria-label="Позиции меню, используйте стрелки для навигации"
        >
          <ul className="menu-carousel__track" aria-label="Позиции меню" data-menu-loop-copies="3">
            {copies.flatMap(({ name, clone, offset }) =>
              items.map((item, index) => (
                <MenuCard
                  key={`${name}-${item.id}`}
                  item={item}
                  index={index}
                  itemCount={items.length}
                  copy={name}
                  physicalIndex={offset + index}
                  clone={clone}
                  setCardRef={(element) => {
                    cardRefs.current[offset + index] = element
                  }}
                />
              )),
            )}
          </ul>
        </div>
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
              onClick={() => moveToLogical(index)}
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
