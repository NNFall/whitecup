import { describe, expect, it } from 'vitest'
import { menuSceneLayerManifest, mediaAssets } from './media'
import { siteData } from './site'

describe('White Cup source data', () => {
  it('routes each address to its own organization card', () => {
    expect(siteData.locations.map(location => location.address)).toEqual([
      'Красноармейская, 17', 'Куйбышева, 128А',
    ])
    expect(siteData.locations[0].routeUrl).toContain('19381755919')
    expect(siteData.locations[1].routeUrl).toContain('193710716150')
    expect(siteData.phoneHref).toBe('tel:+79372355715')
  })
  it('keeps real interior photos distinct from menu illustrations', () => {
    expect(Object.values(mediaAssets).every(asset => asset.kind === 'documentary')).toBe(true)
    expect(Object.values(menuSceneLayerManifest.cards).every(card => card.asset.kind === 'decorative')).toBe(true)
    expect(siteData.menuItems.every(item => item.id in menuSceneLayerManifest.cards)).toBe(true)
  })
})
