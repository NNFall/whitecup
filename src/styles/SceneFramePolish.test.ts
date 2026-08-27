import { describe, expect, it } from 'vitest'

const sceneFrameModules = import.meta.glob<string>('./scene-frame-polish*.css', {
  eager: true,
  import: 'default',
  query: '?raw',
})

const sceneFrameCss = Object.values(sceneFrameModules)[0] ?? ''

describe('desktop scene frame polish contract', () => {
  it('applies a restrained rounded frame and feathered inset on desktop only', () => {
    expect(sceneFrameCss).toMatch(/@media\s*\(min-width:\s*1024px\)/)
    expect(sceneFrameCss).toMatch(
      /\.app-shell\s*>\s*\.scene\s*\{[\s\S]*border-radius:\s*var\(--scene-edge-radius\);[\s\S]*box-shadow:/,
    )
    expect(sceneFrameCss).toMatch(
      /\.app-shell\s*>\s*\.scene::after\s*\{[\s\S]*border-radius:\s*inherit;[\s\S]*box-shadow:\s*inset/,
    )
    expect(sceneFrameCss).not.toMatch(/clip-path:\s*polygon\s*\(/)
    expect(sceneFrameCss).not.toMatch(/scene-(?:route|ribbon)/i)
  })

  it('keeps the hero open at the top so the full-width navigation can merge into it', () => {
    expect(sceneFrameCss).toMatch(
      /\.app-shell\s*>\s*\.scene\.hero-scene\s*\{[\s\S]*border-top-left-radius:\s*0;[\s\S]*border-top-right-radius:\s*0;/,
    )
  })

  it('does not install a mobile frame override or a new horizontal scroll axis', () => {
    expect(sceneFrameCss).not.toMatch(/@media\s*\(max-width:/)
    expect(sceneFrameCss).not.toMatch(/width:\s*calc\([^;]*100vw/)
    expect(sceneFrameCss).not.toMatch(/translateX\s*\(/)
  })
})
