import { render, screen } from '@testing-library/react'
import App from './App'

describe('Landing navigation', () => {
  const scrollIntoView = vi.fn()
  beforeEach(() => {
    scrollIntoView.mockReset()
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: scrollIntoView })
  })
  afterEach(() => window.history.replaceState(null, '', '/'))

  it('opens a direct address link after the page mounts', () => {
    window.history.replaceState(null, '', '/#locations')
    render(<App />)
    expect(scrollIntoView.mock.instances[0]).toBe(document.getElementById('locations'))
  })

  it('does not fail on a malformed URL fragment', () => {
    window.history.replaceState(null, '', '/#%E0%A4%A')
    expect(() => render(<App />)).not.toThrow()
    expect(screen.getByRole('heading', { level: 1 })).toBeVisible()
  })

  it('keeps every on-page navigation target reachable', () => {
    const { container } = render(<App />)
    const links = container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
    expect(links.length).toBeGreaterThan(4)
    for (const link of links) {
      expect(document.getElementById(link.hash.slice(1)), link.textContent ?? link.hash).not.toBeNull()
    }
  })

  it('does not pull the reader back to a fragment after they start scrolling', () => {
    vi.useFakeTimers()
    try {
      window.history.replaceState(null, '', '/#locations')
      render(<App />)
      const calls = scrollIntoView.mock.calls.length
      window.dispatchEvent(new WheelEvent('wheel'))
      vi.advanceTimersByTime(2000)
      expect(scrollIntoView).toHaveBeenCalledTimes(calls)
    } finally { vi.useRealTimers() }
  })
})
