import { describe, expect, it } from 'vitest'

import mainSource from '../main.tsx?raw'

const mobileHeroModules = import.meta.glob<string>('./mobile-hero-polish.css', {
  eager: true,
  import: 'default',
  query: '?raw',
})

const mobileHeroCss = Object.values(mobileHeroModules)[0] ?? ''

function resolveMobileBackdropStart(viewportWidth: number) {
  const preferred = -1.8 * 16 + 1.54 * viewportWidth

  return Math.min(40 * 16, Math.max(29 * 16, preferred))
}

describe('mobile hero polish contract', () => {
  it('keeps the action stack above the backdrop with an opaque quiet CTA', () => {
    const mobileGuard = mobileHeroCss.match(
      /@media\s*\(max-width:\s*720px\)\s*\{([\s\S]*)\}\s*$/,
    )
    const mobileRules = mobileGuard?.[1] ?? ''

    expect(mainSource).toMatch(
      /import\s+['"]\.\/styles\/mobile-hero-polish\.css['"]\s*$/m,
    )
    expect(mainSource.indexOf("'./styles/mobile-hero-polish.css'")).toBeGreaterThan(
      mainSource.indexOf("'./styles/scene-continuity-polish.css'"),
    )
    expect(mobileHeroCss.match(/@media\s*\(/g)).toHaveLength(1)
    expect(mobileHeroCss).not.toMatch(/@media\s*\(min-width:/)
    expect(mobileRules).toMatch(
      /\.hero-scene__actions\s*\{[^}]*position:\s*relative;[^}]*z-index:\s*6;/s,
    )
    expect(mobileRules).toMatch(
      /\.hero-scene__inner\s*\{[^}]*z-index:\s*auto;/s,
    )
    expect(mobileRules).toMatch(
      /\.hero-scene__copy\s*\{[^}]*z-index:\s*7;/s,
    )
    expect(mobileRules).not.toMatch(
      /\.hero-scene__visual\s*\{[^}]*z-index:/s,
    )
    expect(mobileRules).toMatch(
      /\.hero-scene__actions\s+\.button-link--quiet\s*\{[^}]*background-color:\s*var\(--paper-light\);/s,
    )
    expect(mobileRules).toMatch(
      /\.hero-backdrop\s*\{[^}]*pointer-events:\s*none;/s,
    )
    expect(mobileRules).toMatch(
      /\.hero-backdrop\s*\{[^}]*top:\s*clamp\(29rem,\s*calc\(-1\.8rem\s*\+\s*154vw\),\s*40rem\);/s,
    )
    expect(resolveMobileBackdropStart(320)).toBe(464)
    expect(resolveMobileBackdropStart(390)).toBeGreaterThan(559)
    expect(resolveMobileBackdropStart(435)).toBe(640)
    expect(mobileRules).not.toMatch(/background(?:-color)?:\s*transparent/)
  })
})
