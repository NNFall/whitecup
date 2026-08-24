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
})
