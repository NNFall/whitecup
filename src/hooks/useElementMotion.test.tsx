import { StrictMode, useRef } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'

import { useElementMotion } from './useElementMotion'

function Story() {
  const ref = useRef<HTMLDivElement>(null)
  useElementMotion(ref)
  return (
    <div ref={ref}>
      <p data-motion="rise">First paragraph</p>
      <div data-motion="soft" data-testid="actions">
        <a href="#location" data-motion="rise">Find a table</a>
      </div>
    </div>
  )
}

describe('useElementMotion', () => {
  let notifyIntersection: IntersectionObserverCallback
  let notifyPreference: (event: MediaQueryListEvent) => void
  let observe: ReturnType<typeof vi.fn>
  let unobserve: ReturnType<typeof vi.fn>
  let disconnect: ReturnType<typeof vi.fn>
  let removePreferenceListener: ReturnType<typeof vi.fn>

  beforeEach(() => {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    removePreferenceListener = vi.fn()
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: IntersectionObserverCallback) { notifyIntersection = callback }
      observe = observe
      unobserve = unobserve
      disconnect = disconnect
    })
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn((_type, callback) => { notifyPreference = callback }),
      removeEventListener: removePreferenceListener,
    }))
  })

  afterEach(() => { vi.unstubAllGlobals() })

  function enter(element: Element) {
    act(() => notifyIntersection(
      [{ target: element, isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    ))
  }

  it('reveals the intersecting element independently and stops observing it', () => {
    render(<Story />)
    const paragraph = screen.getByText('First paragraph')
    expect(paragraph).toHaveAttribute('data-motion-state', 'pending')
    enter(paragraph)
    expect(paragraph).toHaveAttribute('data-motion-state', 'visible')
    expect(screen.getByTestId('actions')).toHaveAttribute('data-motion-state', 'pending')
    expect(unobserve).toHaveBeenCalledWith(paragraph)
    expect(observe).toHaveBeenCalledTimes(3)
  })

  it('makes a focused action and its pending ancestors immediately available', () => {
    render(<Story />)
    const link = screen.getByRole('link')
    fireEvent.focusIn(link)
    expect(link).toHaveAttribute('data-motion-state', 'instant')
    expect(screen.getByTestId('actions')).toHaveAttribute('data-motion-state', 'instant')
    enter(link)
    expect(link).toHaveAttribute('data-motion-state', 'instant')
  })

  it('shares one entrance between loop copies to avoid a flash when the carousel recenters', () => {
    function LoopCopies() {
      const ref = useRef<HTMLDivElement>(null)
      useElementMotion(ref)
      return (
        <div ref={ref}>
          {[0, 1, 2].map((copy) => (
            <div key={copy} data-motion="art" data-motion-sync="coffee" data-testid="copy" />
          ))}
        </div>
      )
    }
    render(<LoopCopies />)
    const copies = screen.getAllByTestId('copy')
    enter(copies[1])
    copies.forEach((copy) => expect(copy).toHaveAttribute('data-motion-state', 'visible'))
    expect(unobserve).toHaveBeenCalledTimes(3)
    enter(copies[2])
    expect(unobserve).toHaveBeenCalledTimes(3)
  })

  it('settles all elements when reduced motion is enabled while reading', () => {
    render(<Story />)
    const paragraph = screen.getByText('First paragraph')
    enter(paragraph)
    act(() => notifyPreference({ matches: true } as MediaQueryListEvent))
    for (const element of [paragraph, screen.getByRole('link'), screen.getByTestId('actions')]) {
      expect(element).toHaveAttribute('data-motion-state', 'instant')
    }
    enter(paragraph)
    expect(paragraph).toHaveAttribute('data-motion-state', 'instant')
    expect(disconnect).toHaveBeenCalled()
  })

  it.each(['reduced motion', 'missing observer'])('keeps all content available with %s', (fallback) => {
    if (fallback === 'missing observer') vi.stubGlobal('IntersectionObserver', undefined)
    else vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    render(<Story />)
    expect(screen.getByText('First paragraph')).toHaveAttribute('data-motion-state', 'instant')
    expect(screen.getByRole('link')).toHaveAttribute('data-motion-state', 'instant')
    expect(observe).not.toHaveBeenCalled()
  })

  it('disconnects observers and preference listeners on unmount, including StrictMode', () => {
    const view = render(<StrictMode><Story /></StrictMode>)
    const paragraph = screen.getByText('First paragraph')
    expect(paragraph).toHaveAttribute('data-motion-state', 'pending')
    view.unmount()
    expect(paragraph).not.toHaveAttribute('data-motion-state')
    expect(disconnect).toHaveBeenCalledTimes(2)
    expect(removePreferenceListener).toHaveBeenCalledTimes(2)
  })
})
