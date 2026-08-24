import { describe, expect, it } from 'vitest'

import * as mediaRegistry from './media'

import {
  documentarySceneMedia,
  media,
  mediaAssets,
  mediaSource,
} from './media'
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

  it('keeps stable media kinds and classifies every decorative asset granularly', () => {
    const allowedProvenanceKinds = [
      'decorative-reference-edit',
      'decorative-reference-extract',
      'decorative-generated',
    ]

    expect(
      media.documentary.every(
        (asset) => asset.kind === 'documentary' && !('provenanceKind' in asset),
      ),
    ).toBe(true)
    expect(media.decorative.every((asset) => asset.kind === 'decorative')).toBe(true)
    expect(
      media.decorative.every((asset) =>
        allowedProvenanceKinds.includes(asset.provenanceKind),
      ),
    ).toBe(true)
    expect(new Set(media.decorative.map((asset) => asset.provenanceKind))).toEqual(
      new Set(allowedProvenanceKinds),
    )
  })

  it('keeps the generated menu photography in a production decorative manifest', () => {
    const manifest = (
      mediaRegistry as unknown as {
        menuSceneLayerManifest?: {
          backdrop: {
            asset: { kind: string; provenanceKind: string; sourceArtifactSrc?: string }
            src: string
            srcSet?: string
          }
          cards: Record<
            string,
            {
              asset: { kind: string; provenanceKind: string; sourceArtifactSrc?: string }
              src: string
              srcSet?: string
            }
          >
        }
      }
    ).menuSceneLayerManifest

    expect(manifest).toBeDefined()
    expect(manifest?.backdrop.asset.kind).toBe('decorative')
    expect(manifest?.backdrop.asset.provenanceKind).toBe('decorative-reference-edit')
    expect(manifest?.backdrop.src).toBe('/media/menu-clean-base-1672.webp')
    expect(manifest?.backdrop.srcSet?.split(',')).toHaveLength(2)

    const cards = Object.values(manifest?.cards ?? {})
    expect(cards).toHaveLength(5)
    expect(cards.every((entry) => entry.asset.kind === 'decorative')).toBe(true)
    expect(cards.every((entry) => entry.asset.provenanceKind === 'decorative-reference-edit')).toBe(true)
    expect(cards.every((entry) => entry.src.endsWith('-768.webp'))).toBe(true)
    expect(cards.every((entry) => entry.srcSet?.split(',').length === 2)).toBe(true)
    expect(manifest?.backdrop.asset.sourceArtifactSrc).toBeUndefined()
    expect(cards.every((entry) => entry.asset.sourceArtifactSrc === undefined)).toBe(true)
    expect(siteData.menuItems.every((item) => item.imageId === undefined)).toBe(true)
  })

  it('keeps the supplied About benefit copy in reference order', () => {
    expect(siteData.benefits).toEqual([
      {
        id: 'specialty-coffee',
        title: 'Спешелти-кофе',
        description: 'Только отборные зёрна и бережная обжарка',
      },
      {
        id: 'all-day-breakfast',
        title: 'Завтраки весь день',
        description: 'Любимые блюда в любое время',
      },
      {
        id: 'cozy-atmosphere',
        title: 'Уютная атмосфера',
        description: 'Тёплый интерьер и дружелюбная команда',
      },
      {
        id: 'samara-centre',
        title: 'Центр Самары',
        description: 'В самом сердце города, рядом с культурной жизнью',
      },
    ])
  })
})
