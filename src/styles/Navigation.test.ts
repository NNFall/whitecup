import globalCss from './global.css?raw'

describe('reference navigation layout guards', () => {
  it('does not force a synthetic 320px document width', () => {
    expect(globalCss).not.toMatch(/html\s*\{[^}]*min-width:\s*320px;/)
    expect(globalCss).not.toMatch(/body\s*\{[^}]*min-width:\s*320px;/)
  })

  it('aligns every scene hash with the viewport edge', () => {
    expect(globalCss).toMatch(/\.scene\s*\{[^}]*scroll-margin-top:\s*0;/)

    const sceneMargins = Array.from(
      globalCss.matchAll(/\.scene\s*\{[^}]*scroll-margin-top:\s*([^;]+);/g),
      (match) => match[1].trim(),
    )
    expect(sceneMargins).toEqual(['0'])
  })

  it('keeps the fixed header transparent to underlying pointer input', () => {
    expect(globalCss).toMatch(/\.site-nav\s*\{[^}]*pointer-events:\s*none;/)
    expect(globalCss).toMatch(/\.site-nav__brand[^}]*\{[^}]*pointer-events:\s*auto;/)
    expect(globalCss).toMatch(/\.site-nav__desktop[^}]*\{[^}]*pointer-events:\s*auto;/)
    expect(globalCss).toMatch(/\.site-nav__toggle[^}]*\{[^}]*pointer-events:\s*auto;/)
  })
})
