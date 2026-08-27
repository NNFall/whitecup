import { statSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The build manifest for font files copied to the public root. Keep this list
 * explicit so a clean checkout cannot silently ship without a local face.
 */
export const requiredFontAssets = Object.freeze([
  'public/fonts/white-cup-display-cyrillic.woff2',
  'public/fonts/white-cup-hand-cyrillic.woff2',
  'public/fonts/golos-text-cyrillic-variable.woff2',
])

export function verifyFontAssets({ rootDir = process.cwd(), files = requiredFontAssets } = {}) {
  const missing = []

  for (const relativePath of files) {
    const absolutePath = resolve(rootDir, relativePath)

    try {
      const stats = statSync(absolutePath)
      if (!stats.isFile()) {
        missing.push(`${relativePath} (not a file)`)
      } else if (stats.size === 0) {
        missing.push(`${relativePath} (empty file)`)
      }
    } catch {
      missing.push(`${relativePath} (not found)`)
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required font assets:\n${missing.map((asset) => `- ${asset}`).join('\n')}`)
  }

  return [...files]
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const verified = verifyFontAssets()
    console.log(`Verified ${verified.length} required font assets.`)
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
