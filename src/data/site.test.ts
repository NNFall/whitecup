import { describe, expect, it } from 'vitest'

import { documentarySceneMedia, mediaAssets, mediaSource } from './media'
import { siteData } from './site'

describe('White Cup site data', () => {
  it('contains verified locations, phone, and Yandex organization route', () => {
    expect(siteData.locations).toHaveLength(2)
    expect(siteData.locations.map((location) => location.address)).toEqual([
      'Красноармейская, 15',
      'Куйбышева, 128/1',
    ])
    expect(siteData.phone).toBe('+7 (937) 235-57-15')
    expect(siteData.locations[0].routeUrl).toContain('19381755919')
  })

  it('keeps documentary interiors mapped to scenes and never presents them as food photos', () => {
    expect(documentarySceneMedia.hero).toEqual([mediaAssets['interior-01']])
    expect(documentarySceneMedia.about).toEqual([mediaAssets['interior-05']])
    expect(documentarySceneMedia.events).toEqual([mediaAssets['interior-03']])
    expect(documentarySceneMedia.locations).toEqual([
      mediaAssets['interior-02'],
      mediaAssets['interior-04'],
    ])
    expect(Object.values(mediaAssets).every((asset) => asset.kind === 'documentary')).toBe(true)
    expect(siteData.menuItems.every((item) => item.imageId === undefined)).toBe(true)
  })

  it('records the VK URL and the fact that its content was not verified', () => {
    expect(mediaSource.vk.url).toBe('https://vk.ru/white_cup')
    expect(mediaSource.vk.status).toBe('unverified-blocked')
    expect(mediaSource.vk.verified).toBe(false)
  })
})
