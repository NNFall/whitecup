import { render } from '@testing-library/react'
import { createElement } from 'react'

import { SceneBridge } from '../components/SceneBridge'
import globalCss from './global.css?raw'

const bridgeModules = import.meta.glob<string>('./scene-bridge-polish*.css', {
  eager: true,
  import: 'default',
  query: '?raw',
})

const bridgeCss = Object.values(bridgeModules)[0] ?? ''
const tokenModules = import.meta.glob<string>('./tokens.css', {
  eager: true,
  import: 'default',
  query: '?raw',
})

const tokensCss = Object.values(tokenModules)[0] ?? ''

describe('SceneBridge polish contract', () => {
  it('renders only independent paper and marker layers with decorative provenance', () => {
    const { container } = render(createElement(SceneBridge, { from: 'hero', to: 'menu' }))
    const bridge = container.querySelector<HTMLElement>('[data-scene-bridge="hero-menu"]')

    expect(bridge).toHaveAttribute('aria-hidden', 'true')
    expect(bridge).toHaveAttribute('data-bridge-layer', 'transition')
    expect(bridge).toHaveAttribute('data-media-kind', 'decorative-generated')
    expect(bridge).toHaveAttribute('data-provenance', 'local-css')
    expect(bridge?.querySelector('img, picture, svg, canvas')).toBeNull()

    const layers = Array.from(bridge?.children ?? [], (layer) => layer as HTMLElement)

    expect(layers.map((layer) => layer.dataset.bridgeLayer)).toEqual(['paper', 'marker'])
    layers.forEach((layer) => {
      expect(layer).toHaveAttribute('aria-hidden', 'true')
      expect(layer).toHaveAttribute('data-media-kind', 'decorative-generated')
      expect(layer).toHaveAttribute('data-provenance', 'local-css')
    })
  })

  it('derives a quiet atmospheric signature from the scene pair', () => {
    const { container } = render(createElement(SceneBridge, { from: 'about', to: 'visit' }))
    const bridge = container.querySelector<HTMLElement>('[data-scene-bridge="about-visit"]')

    expect(bridge).toHaveAttribute('data-bridge-label', 'ваш ритм — ваш стол')
    expect(bridge?.querySelector('.scene-bridge__label')).toHaveTextContent('ваш ритм — ваш стол')
  })

  it('uses a transparent warm-paper crossfade without a raster route ribbon', () => {
    expect(bridgeCss).toMatch(
      /\.scene-bridge\s*\{[\s\S]*position:\s*relative;[\s\S]*height:\s*clamp\(5\.25rem,\s*6vw,\s*8rem\);[\s\S]*margin-block:\s*0\s*!important;[\s\S]*overflow:\s*visible\s*!important;[\s\S]*pointer-events:\s*none;/,
    )
    expect(bridgeCss).toMatch(/background:\s*linear-gradient\(/)
    expect(bridgeCss).toMatch(
      /\.scene-bridge__paper\s*\{[\s\S]*border:\s*none;[\s\S]*border-radius:\s*0;[\s\S]*linear-gradient\([\s\S]*box-shadow:\s*none;/,
    )
    expect(bridgeCss).toMatch(
      /\.scene-bridge__paper\s*\{[\s\S]*inset:\s*clamp\([^;]+\)\s+!important;/,
    )
    expect(bridgeCss).toMatch(
      /\.scene-bridge__paper\s*\{[\s\S]*background:[\s\S]*!important;[\s\S]*clip-path:\s*none\s*!important;/,
    )
    expect(bridgeCss).toMatch(
      /\.scene-bridge__paper\s*\{[\s\S]*-webkit-mask-image:\s*linear-gradient\([\s\S]*transparent\s+0%[\s\S]*transparent\s+100%\);[\s\S]*mask-image:\s*linear-gradient\(/,
    )
    expect(bridgeCss).toMatch(
      /\.scene-bridge__label\s*\{[\s\S]*font-family:\s*var\(--font-script\);[\s\S]*font-weight:\s*400;[\s\S]*letter-spacing:\s*0\.04em;/,
    )
    expect(bridgeCss).toMatch(
      /\.scene-bridge__marker\s*\{[\s\S]*width:\s*min\([^;]*11rem[^;]*\);[\s\S]*var\(--petrol\)/,
    )
    expect(bridgeCss).toMatch(
      /@media\s*\(max-width:\s*1023px\)[\s\S]*\.scene-bridge\s*\{[\s\S]*height:\s*clamp\(2\.5rem,\s*13vw,\s*4rem\);/,
    )
    expect(bridgeCss).not.toMatch(/margin-block:\s*calc\([^;]*\*\s*-1\)/)
    expect(bridgeCss).not.toMatch(/clip-path:\s*polygon\s*\(/)
    expect(bridgeCss).toMatch(/\.scene-bridge__paper\s*\{[\s\S]*border:\s*none;/)
    expect(bridgeCss).toMatch(/\.scene-bridge__paper\s*\{[\s\S]*border-radius:\s*0;/)
    expect(bridgeCss).toMatch(/\.scene-bridge__paper\s*\{[\s\S]*box-shadow:\s*none;/)
    expect(bridgeCss).not.toMatch(/story-route-connector|scene-bridge__route|route-ribbon/)
  })

  it('keeps the bridge wash neutral and anchors it with a subtle petrol edge', () => {
    const bridgeRule = bridgeCss.match(/\.scene-bridge\s*\{([\s\S]*?)\n\}/)?.[1] ?? ''
    const paperRule = bridgeCss.match(/\.scene-bridge__paper\s*\{([\s\S]*?)\n\}/)?.[1] ?? ''

    expect(tokensCss).toMatch(/--petrol:\s*#26454a;/)
    expect(tokensCss).toMatch(/--orange-action:\s*#c93608;/)
    expect(bridgeRule).not.toMatch(/var\(--orange\)/)
    expect(paperRule).not.toMatch(/var\(--orange\)/)
    expect(bridgeCss).not.toMatch(/var\(--orange\)/)
    expect(bridgeCss).toContain('color-mix(in oklch, var(--paper-light) 64%, transparent)')
    expect(bridgeCss).toContain('color-mix(in oklch, var(--paper-light) 78%, transparent)')
    expect(bridgeCss).toContain('border: none;')
    expect(bridgeCss).toContain('border-radius: 0;')
    expect(bridgeCss).toContain('box-shadow: none;')
    expect(bridgeCss).toContain('color: color-mix(in oklch, var(--petrol) 78%, var(--ink-soft) 22%);')
  })

  it('keeps inactive carousel dots readable and the narrow menu controls inside 320px', () => {
    const compactMobile = globalCss.slice(globalCss.lastIndexOf('@media (max-width: 340px)'))

    expect(globalCss).toMatch(/\.menu-scene \.menu-carousel__dot\s*\{[\s\S]*color:\s*color-mix\(in oklch, var\(--ink\) 60%, var\(--paper-light\) 40%\);/)
    expect(compactMobile).toMatch(
      /\.scene\.menu-scene \.menu-carousel__toolbar,\s*\.scene\.menu-scene \.menu-carousel__viewport-shell,\s*\.scene\.menu-scene \.menu-carousel__footer,\s*\.scene\.menu-scene \.menu-carousel__note\s*\{[\s\S]*width:\s*100%;[\s\S]*max-width:\s*100%;[\s\S]*box-sizing:\s*border-box;/s,
    )
    expect(compactMobile).toMatch(
      /\.scene\.menu-scene \.menu-carousel__controls\s*\{[\s\S]*position:\s*static;[\s\S]*max-width:\s*100%;[\s\S]*overflow:\s*visible;/s,
    )
    expect(compactMobile).toMatch(
      /\.scene\.menu-scene \.menu-carousel__dot\s*\{[\s\S]*width:\s*44px;[\s\S]*min-width:\s*44px;[\s\S]*height:\s*44px;[\s\S]*min-height:\s*44px;/s,
    )
    expect(compactMobile).toMatch(
      /\.scene\.menu-scene \.menu-carousel__dots\s*\{[\s\S]*display:\s*grid;[\s\S]*grid-template-columns:\s*repeat\(4,\s*minmax\(44px,\s*1fr\)\);[\s\S]*max-width:\s*100%;/s,
    )
  })

  it('removes bridge animation and transitions for reduced-motion visitors', () => {
    expect(bridgeCss).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.scene-bridge,[\s\S]*\.scene-bridge\s+\*[\s\S]*animation:\s*none\s*!important;[\s\S]*transition:\s*none\s*!important;/,
    )
  })
})
