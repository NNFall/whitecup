import { act, render } from '@testing-library/react'

import App from './App'

describe('App hash navigation', () => {
  const scrollIntoView = vi.fn()

  beforeEach(() => {
    scrollIntoView.mockReset()
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    })
  })

  afterEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('aligns the initial deep link after the React scene tree mounts', () => {
    window.history.replaceState(null, '', '/#visit')

    render(<App />)

    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'auto' })
    expect(scrollIntoView.mock.instances[0]).toBe(document.getElementById('visit'))
  })

  it('realigns a scene when the URL hash changes', () => {
    window.history.replaceState(null, '', '/#hero')
    render(<App />)
    scrollIntoView.mockClear()

    act(() => {
      window.history.replaceState(null, '', '/#locations')
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })

    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'auto' })
    expect(scrollIntoView.mock.instances[0]).toBe(document.getElementById('locations'))
  })

  it('rechecks a deep link after responsive media has settled its scene heights', () => {
    vi.useFakeTimers()
    window.history.replaceState(null, '', '/#locations')

    render(<App />)
    const initialCalls = scrollIntoView.mock.calls.length

    act(() => {
      vi.advanceTimersByTime(1_250)
    })

    expect(scrollIntoView.mock.calls.length).toBeGreaterThan(initialCalls)
    expect(scrollIntoView.mock.instances.at(-1)).toBe(document.getElementById('locations'))
    vi.useRealTimers()
  })

  it.each([
    ['wheel', () => window.dispatchEvent(new WheelEvent('wheel', { bubbles: true }))],
    ['touch', () => window.dispatchEvent(new Event('touchstart', { bubbles: true }))],
    ['pointer', () => window.dispatchEvent(new Event('pointerdown', { bubbles: true }))],
    ['navigation key', () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }))],
  ])('cancels a pending hash re-alignment after %s input', (_label, dispatchIntent) => {
    vi.useFakeTimers()
    window.history.replaceState(null, '', '/#locations')

    try {
      render(<App />)
      const initialCalls = scrollIntoView.mock.calls.length

      act(() => {
        dispatchIntent()
        vi.advanceTimersByTime(1_250)
      })

      expect(scrollIntoView).toHaveBeenCalledTimes(initialCalls)
    } finally {
      vi.useRealTimers()
    }
  })

  it('threads the six scenes through inert paper-route bridges in story order', () => {
    render(<App />)

    const bridges = Array.from(document.querySelectorAll<HTMLElement>('[data-scene-bridge]'))

    expect(bridges.map((bridge) => bridge.dataset.sceneBridge)).toEqual([
      'hero-menu',
      'menu-about',
      'about-visit',
      'visit-events',
      'events-locations',
    ])

    bridges.forEach((bridge) => {
      expect(bridge).toHaveAttribute('aria-hidden', 'true')
      expect(bridge).not.toHaveAttribute('tabindex')
      expect(bridge.querySelector('[role="heading"]')).toBeNull()
    })
  })
})
