import { describe, expect, it } from 'vitest'

import indexHtml from '../index.html?raw'

const noScriptMarkup = indexHtml.match(/<noscript\b[^>]*>([\s\S]*?)<\/noscript>/i)?.[1] ?? ''

describe('meaningful no-JavaScript fallback', () => {
  it('keeps the essential White Cup journey available without the React app', () => {
    expect(noScriptMarkup).toMatch(
      /<section\b[^>]*aria-labelledby=["']noscript-title["'][^>]*>[\s\S]*<h1\b[^>]*id=["']noscript-title["'][^>]*>[^<]*White Cup/i,
    )
    expect(noScriptMarkup).toMatch(/(?:кофе|завтраки)[^<]*(?:Самар|день|весь)/i)
    expect(noScriptMarkup).toMatch(
      /<a\b[^>]*href=["']tel:\+79372355715["'][^>]*>\s*\+7 \(937\) 235-57-15\s*<\/a>/i,
    )
    expect(noScriptMarkup).toContain('Красноармейская, 15')
    expect(noScriptMarkup).toContain('Куйбышева, 128/1')
    expect(noScriptMarkup).toMatch(/href=["'][^"']*yandex\.ru\/maps[^"']*["']/i)
    expect(noScriptMarkup).toMatch(/href=["']https:\/\/vk\.ru\/white_cup["']/i)
    expect(noScriptMarkup).toMatch(/href=["'][^"']*\/menu\/[^"']*["']/i)
  })

  it('uses self-contained responsive paper styling instead of loading assets', () => {
    expect(noScriptMarkup).toMatch(
      /<section\b[^>]*style=["'][^"']*(?:background|color):[^"']*(?:#f7f2e9|#fbf7f0|#183b45)/i,
    )
    expect(noScriptMarkup).toMatch(/(?:color|background):#c93608/i)
    expect(noScriptMarkup).not.toMatch(/#e84b16/i)
    expect(noScriptMarkup).toMatch(/style=["'][^"']*(?:clamp\(|min\([^"']*100%)/i)
    expect(noScriptMarkup).not.toMatch(/<(?:img|link|script)\b|\bsrc\s*=|url\s*\(/i)
  })
})
