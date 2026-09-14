import { useLayoutEffect, type RefObject } from 'react'

/** Enhance individual scene elements without introducing layout wrappers. */
export function useElementMotion(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-motion]'))
    const groups = new Map<string, HTMLElement[]>()
    for (const element of elements) {
      const key = element.dataset.motionSync
      if (key) groups.set(key, [...(groups.get(key) ?? []), element])
    }
    const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    let observer: IntersectionObserver | undefined

    const show = (element: HTMLElement, instantly = false) => {
      // Loop copies share one entrance. Recentering the carousel must never
      // swap an already visible dish for a still-hidden copy of that dish.
      const group = groups.get(element.dataset.motionSync ?? '') ?? [element]
      group.forEach((member) => {
        member.dataset.motionState = instantly ? 'instant' : 'visible'
        observer?.unobserve(member)
      })
    }

    const showAll = () => {
      elements.forEach((element) => show(element, true))
      observer?.disconnect()
    }

    if (preference?.matches || typeof IntersectionObserver === 'undefined') {
      showAll()
    } else {
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement
          if (entry.isIntersecting && element.dataset.motionState === 'pending') show(element)
        }
      }, { threshold: 0, rootMargin: '0px 0px -24px 0px' })

      elements.forEach((element) => { element.dataset.motionState = 'pending' })
      for (const element of elements) {
        // Deep links can begin halfway down the story. Content above the
        // initial viewport remains available when the visitor scrolls back.
        if (element.getBoundingClientRect().bottom < 0) {
          show(element, true)
        } else if (element.dataset.motionState === 'pending') {
          observer.observe(element)
        }
      }
    }

    const handlePreference = (event: MediaQueryListEvent) => {
      if (event.matches) showAll()
    }

    const handleFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return
      let element = event.target.closest<HTMLElement>('[data-motion]')
      while (element && root.contains(element)) {
        show(element, true)
        element = element.parentElement?.closest<HTMLElement>('[data-motion]') ?? null
      }
    }

    preference?.addEventListener?.('change', handlePreference)
    root.addEventListener('focusin', handleFocus)

    return () => {
      observer?.disconnect()
      preference?.removeEventListener?.('change', handlePreference)
      root.removeEventListener('focusin', handleFocus)
      elements.forEach((element) => delete element.dataset.motionState)
    }
  }, [rootRef])
}
