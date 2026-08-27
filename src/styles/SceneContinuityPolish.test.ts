const continuityModules = import.meta.glob<string>('./scene-continuity-polish*.css', {
  eager: true,
  import: 'default',
  query: '?raw',
})

const continuityCss = Object.values(continuityModules)[0] ?? ''
const globalCss = (await import('./global.css?raw')).default as string

function declarationsFor(selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = continuityCss.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`))

  return match?.[1] ?? ''
}

describe('scene continuity polish contract', () => {
  it('keeps each bridge inert, clipped and in normal flow', () => {
    const bridgeRule = declarationsFor('.scene-bridge')

    expect(bridgeRule).toMatch(/position:\s*relative;/)
    expect(bridgeRule).toMatch(/z-index:\s*0;/)
    expect(bridgeRule).toMatch(/inline-size:\s*100%;/)
    expect(bridgeRule).toMatch(/max-inline-size:\s*100%;/)
    expect(bridgeRule).toMatch(/margin-block:\s*0;/)
    expect(bridgeRule).toMatch(/overflow:\s*clip;/)
    expect(bridgeRule).toMatch(/isolation:\s*isolate;/)
    expect(bridgeRule).toMatch(/pointer-events:\s*none;/)
    expect(bridgeRule).not.toMatch(/margin[^;]*-\d/)
    expect(continuityCss).toMatch(
      /\.scene-bridge::before,\s*\.scene-bridge::after\s*\{[^}]*content:\s*none;/,
    )
  })

  it('places the organic paper layer below the route artwork', () => {
    const paperRule = declarationsFor('.scene-bridge__paper')
    const routeRule = declarationsFor('.scene-bridge__route')

    expect(paperRule).toMatch(/position:\s*absolute;/)
    expect(paperRule).toMatch(/z-index:\s*0;/)
    expect(paperRule).toMatch(/var\(--paper-light\)/)
    expect(paperRule).toMatch(/var\(--orange\)/)
    expect(continuityCss).not.toContain('--orange-display')
    expect(routeRule).toMatch(/position:\s*absolute;/)
    expect(routeRule).toMatch(/z-index:\s*1;/)
    expect(routeRule).toMatch(/pointer-events:\s*none;/)
  })

  it('uses one restrained desktop header geometry for both profile hooks', () => {
    expect(continuityCss).toContain(
      ".site-nav__desktop-shell:is([data-nav-profile='reference'], [data-nav-profile='compact'])",
    )
    expect(continuityCss).toMatch(
      /@media \(min-width:\s*1024px\)[\s\S]*\.site-nav__desktop-shell:is\([^{]+\)\s*\{[^}]*width:\s*min\(calc\(100% - 2\.5rem\),\s*78rem\);[^}]*min-height:\s*clamp\(4\.5rem,\s*4\.6vw,\s*5\.25rem\);/,
    )
    expect(continuityCss).toMatch(
      /\.site-nav__desktop-shell:is\([^{]+\)\s+\.site-nav__desktop-brand\s*\{[^}]*width:\s*clamp\(3rem,\s*3vw,\s*3\.6rem\);/,
    )
    expect(continuityCss).not.toMatch(/backdrop-filter/)
    expect(
      Array.from(continuityCss.matchAll(/box-shadow:\s*([^;]+);/g), (match) => match[1].trim()),
    ).toEqual(['none'])
  })

  it('keeps the mobile header inside narrow viewports', () => {
    expect(continuityCss).toMatch(
      /@media \(max-width:\s*1023px\)[\s\S]*\.site-nav__mobile\s*\{[^}]*width:\s*min\(calc\(100% - 2rem\),\s*42rem\);/,
    )
  })

  it('reserves a visible runway for title, intro and cards on short desktop scenes', () => {
    expect(globalCss).toMatch(
      /@media \(min-width:\s*1024px\) and \(max-height:\s*800px\) and \(min-aspect-ratio:\s*4 \/ 3\)[\s\S]*\.about-scene \.section-frame__heading\s*\{[^}]*top:\s*9\.5%;/,
    )
    expect(globalCss).toMatch(
      /@media \(min-width:\s*1024px\) and \(max-height:\s*800px\) and \(min-aspect-ratio:\s*4 \/ 3\)[\s\S]*\.visit-scene \.section-frame__heading\s*\{[^}]*top:\s*0%;/,
    )
    expect(globalCss).toMatch(
      /@media \(min-width:\s*1024px\) and \(max-height:\s*800px\) and \(min-aspect-ratio:\s*4 \/ 3\)[\s\S]*\.events-scene \.section-frame__heading\s*\{[^}]*top:\s*18%;/,
    )
    expect(globalCss).toMatch(
      /@media \(min-width:\s*1024px\) and \(min-height:\s*681px\) and \(max-height:\s*720px\) and \(min-aspect-ratio:\s*4 \/ 3\)[\s\S]*\.about-scene \.benefits-list\s*\{[^}]*bottom:\s*6\.2%;/,
    )
    expect(globalCss).toMatch(
      /@media \(min-width:\s*1024px\) and \(min-height:\s*681px\) and \(max-height:\s*720px\) and \(min-aspect-ratio:\s*4 \/ 3\)[\s\S]*\.events-scene__cards\s*\{[^}]*top:\s*60\.1%;/,
    )
  })

  it('keeps Visit card offsets height-led across desktop and tablet bands', () => {
    expect(globalCss).toMatch(
      /@media \(min-width:\s*1024px\) and \(max-width:\s*1439px\) and \(max-height:\s*720px\)[\s\S]*\.visit-scene__cards\s*\{[^}]*top:\s*43\.2%;/,
    )
    expect(globalCss).toMatch(
      /@media \(min-width:\s*1024px\) and \(max-height:\s*640px\) and \(min-aspect-ratio:\s*4 \/ 3\)[\s\S]*\.visit-scene__cards\s*\{[^}]*top:\s*46%;/,
    )
    expect(globalCss).toMatch(
      /@media \(min-width:\s*1440px\) and \(max-height:\s*760px\)[\s\S]*\.visit-scene__cards\s*\{[^}]*top:\s*max\(46%,\s*calc\(34\.8% \+ 5\.05rem\)\);/,
    )
  })

  it('transitions only transform and opacity', () => {
    expect(declarationsFor('.site-nav')).toMatch(/transition:/)

    const declarations = Array.from(
      continuityCss.matchAll(/transition\s*:\s*([^;]+);/g),
      (match) => match[1],
    )

    expect(declarations.length).toBeGreaterThan(0)

    declarations.forEach((declaration) => {
      const clauses = declaration
        .replace(/cubic-bezier\([^)]*\)/g, 'easing')
        .split(',')

      clauses.forEach((entry) => {
        expect(entry.trim()).toMatch(/^(?:transform|opacity|none)\b/)
      })
    })

    expect(continuityCss).not.toMatch(
      /transition\s*:[^;]*(?:width|height|min-height|max-height|padding|margin|gap|inset|top|right|bottom|left)/,
    )
  })

  it('removes header and bridge motion for reduced-motion visitors', () => {
    expect(continuityCss).toMatch(
      /@media \(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*\.site-nav,[\s\S]*\.site-nav \*,[\s\S]*\.scene-bridge,[\s\S]*\.scene-bridge \*[\s\S]*animation:\s*none !important;[\s\S]*transition:\s*none !important;/,
    )
  })
})
