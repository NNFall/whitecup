import { render } from '@testing-library/react'

import { MenuSection } from '../sections/MenuSection'
import globalCss from './global.css?raw'
import liveTypographyCss from './live-typography.css?raw'

function extractAtRuleContents(css: string, atRule: string) {
  const start = css.indexOf(atRule)
  const open = css.indexOf('{', start)
  let depth = 0

  for (let index = open; index < css.length; index += 1) {
    if (css[index] === '{') depth += 1
    if (css[index] !== '}') continue

    depth -= 1
    if (depth === 0) return css.slice(open + 1, index)
  }

  throw new Error(`Unclosed CSS block ${atRule}`)
}

describe('live typography cascade', () => {
  it('lets the later live stylesheet reset legacy desktop menu title geometry', () => {
    const previousWidth = window.innerWidth
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 })

    const globalStyle = document.createElement('style')
    globalStyle.textContent = globalCss
    const liveStyle = document.createElement('style')
    liveStyle.textContent = liveTypographyCss
    const activeDesktopStyle = document.createElement('style')
    /* jsdom does not evaluate viewport media queries. Re-apply the live
     * desktop block as active rules after loading both full stylesheets. */
    activeDesktopStyle.textContent = extractAtRuleContents(
      liveTypographyCss,
      '@media (min-width: 1024px)',
    )
    document.head.append(globalStyle, liveStyle, activeDesktopStyle)

    try {
      const { container } = render(<MenuSection />)
      const titleLine = container.querySelector('.menu-scene__title-line') as HTMLElement
      const titleInitial = container.querySelector('.menu-scene__title-initial') as HTMLElement

      expect(getComputedStyle(titleLine).position).toBe('static')
      expect(getComputedStyle(titleLine).top).toBe('auto')
      expect(getComputedStyle(titleLine).left).toBe('auto')
      expect(getComputedStyle(titleLine).transform).toBe('none')
      expect(getComputedStyle(titleInitial).position).toBe('static')
      expect(getComputedStyle(titleInitial).top).toBe('auto')
      expect(getComputedStyle(titleInitial).left).toBe('auto')
      expect(getComputedStyle(titleInitial).transform).toBe('none')
    } finally {
      globalStyle.remove()
      liveStyle.remove()
      activeDesktopStyle.remove()
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: previousWidth,
      })
    }
  })
})
