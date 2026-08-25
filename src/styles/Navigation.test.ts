import globalCss from './global.css?raw'

describe('reference navigation layout guards', () => {
  it('does not force a synthetic 320px document width', () => {
    expect(globalCss).not.toMatch(/html\s*\{[^}]*min-width:\s*320px;/)
    expect(globalCss).not.toMatch(/body\s*\{[^}]*min-width:\s*320px;/)
  })

  it('keeps scene anchors below the persistent navigation without a magic viewport edge', () => {
    expect(globalCss).toMatch(/--anchor-header-offset:\s*clamp\(5rem,\s*5vw,\s*5\.85rem\);/)
    expect(globalCss).toMatch(
      /\.scene\s*\{[^}]*scroll-margin-top:\s*var\(--anchor-header-offset\);/,
    )
  })

  it('keeps the fixed header transparent to underlying pointer input', () => {
    expect(globalCss).toMatch(/\.site-nav\s*\{[^}]*pointer-events:\s*none;/)
    expect(globalCss).toMatch(/\.site-nav__desktop-shell[^}]*\{[^}]*pointer-events:\s*auto;/)
    expect(globalCss).toMatch(/\.site-nav__desktop[^}]*\{[^}]*pointer-events:\s*auto;/)
    expect(globalCss).toMatch(
      /\.site-nav__desktop-shell\s+\.site-nav__desktop a\s*\{[^}]*letter-spacing:\s*-0\.025em;/,
    )
    expect(globalCss).toMatch(/\.site-nav__toggle[^}]*\{[^}]*pointer-events:\s*auto;/)
  })

  it('keeps responsive bridge asset selection in the component rather than CSS URLs', () => {
    expect(globalCss).not.toMatch(/story-route-connector-/)
    expect(globalCss).toMatch(/\.scene-bridge__route\s*\{[^}]*pointer-events:\s*none;/)
  })

  it('gives the compact desktop header a soft paper veil while it crosses scene art', () => {
    expect(globalCss).toMatch(
      /\.site-nav__desktop-shell\[data-nav-profile='compact'\]::before\s*\{[^}]*background:\s*linear-gradient\(/,
    )
    expect(globalCss).toMatch(
      /\.site-nav__desktop-shell\[data-nav-profile='compact'\]::before\s*\{[^}]*pointer-events:\s*none;/,
    )
  })

  it('animates the measured header geometry instead of only changing opacity', () => {
    expect(globalCss).toMatch(
      /\.site-nav__desktop-shell\s*\{[^}]*transition:[^}]*min-height[^}]*padding[^}]*gap[^}]*;/,
    )
  })

  it('keeps the compact rail clear of reference title copy with a numeric glide', () => {
    expect(globalCss).toMatch(
      /\.site-nav__desktop-shell\[data-nav-profile='compact'\] \.site-nav__desktop\s*\{[^}]*margin-left:\s*3\.2vw;[^}]*transform:\s*translateX\(/,
    )
  })

  it('keeps compact desktop links inside the viewport at 125% zoom widths', () => {
    expect(globalCss).toContain('@media (min-width: 1024px) and (max-width: 1600px)')
    expect(globalCss).toContain(
      "transform: translateX(clamp(15rem, 44vw, 40rem));",
    )
    expect(globalCss).toContain('gap: clamp(1rem, 2.4vw, 3rem);')
  })
})
