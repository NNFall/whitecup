import { describe, expect, it } from 'vitest'

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
})
