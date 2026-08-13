#!/usr/bin/env tsx
/**
 * Image pipeline: for every image under public/images/
 *  - sanitizes filenames (spaces/parens -> dashes) and rewrites references in src/ + index.html
 *  - caps the full-size webp at 2000px on the longest side (q78)
 *  - generates responsive variants `name-w{320,640,960,1440,2000}.webp` (never upscaled)
 *  - emits src/content/image-manifest.json with { width, height, lqip, variants } per public path
 * Idempotent: variant files are skipped as sources; unchanged full-size files are re-encoded
 * only when they exceed the cap or aren't webp yet.
 */

import { readdirSync } from 'node:fs'
import { readFile, rename, rm, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import sharp from 'sharp'

const PROJECT_ROOT = process.cwd()
const PUBLIC_DIR = resolve(PROJECT_ROOT, 'public')
const IMAGES_DIR = resolve(PUBLIC_DIR, 'images')
const MANIFEST_PATH = resolve(PROJECT_ROOT, 'src', 'content', 'image-manifest.json')

const SOURCE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp'])
const TEXT_FILE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.html'])
const VARIANT_WIDTHS = [320, 640, 960, 1440, 2000]
const MAX_DIMENSION = 2000
const QUALITY = 78
const VARIANT_PATTERN = /-w\d+\.webp$/i

interface ManifestEntry {
  width: number
  height: number
  lqip: string
  variants: { w: number; src: string }[]
}

function walk(directory: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...walk(fullPath))
    else files.push(fullPath)
  }
  return files
}

function publicPath(filePath: string): string {
  return `/${relative(PUBLIC_DIR, filePath).replace(/\\/g, '/')}`
}

function sanitizeName(fileName: string): string {
  const ext = extname(fileName)
  const stem = fileName.slice(0, -ext.length)
  const clean = stem
    .replace(/[()]/g, '')
    .replace(/[\s_]+/g, (m) => (m.includes(' ') ? '-' : m))
    .replace(/-+/g, '-')
    .replace(/-$/, '')
  return `${clean}${ext}`
}

async function rewriteReferences(replacements: Map<string, string>): Promise<void> {
  if (replacements.size === 0) return
  const targets = [
    resolve(PROJECT_ROOT, 'index.html'),
    resolve(PUBLIC_DIR, 'manifest.webmanifest'),
    ...walk(resolve(PROJECT_ROOT, 'src')).filter((f) =>
      TEXT_FILE_EXTENSIONS.has(extname(f).toLowerCase()),
    ),
  ]
  for (const filePath of targets) {
    let content: string
    try {
      content = await readFile(filePath, 'utf8')
    } catch {
      continue
    }
    let next = content
    for (const [from, to] of replacements) {
      next = next.split(from).join(to)
      next = next.split(from.replace(/ /g, '%20')).join(to)
    }
    if (next !== content) await writeFile(filePath, next, 'utf8')
  }
}

async function main(): Promise<void> {
  // 1. Sanitize filenames with spaces/parens and rewrite code references.
  const replacements = new Map<string, string>()
  for (const filePath of walk(IMAGES_DIR)) {
    const name = basename(filePath)
    const clean = sanitizeName(name)
    if (clean !== name) {
      const target = join(dirname(filePath), clean)
      await rename(filePath, target)
      replacements.set(name, clean)
    }
  }
  await rewriteReferences(replacements)

  // 2. Collect source images (skip generated variants).
  const sources = walk(IMAGES_DIR).filter((f) => {
    const ext = extname(f).toLowerCase()
    return SOURCE_EXTENSIONS.has(ext) && !VARIANT_PATTERN.test(basename(f))
  })

  const manifest: Record<string, ManifestEntry> = {}
  const conversionRenames = new Map<string, string>()
  let beforeTotal = 0
  let afterTotal = 0

  for (const sourcePath of sources) {
    const ext = extname(sourcePath).toLowerCase()
    const sourceStat = await stat(sourcePath)
    beforeTotal += sourceStat.size

    const meta = await sharp(sourcePath).rotate().metadata()
    const srcWidth = meta.width ?? 0
    const srcHeight = meta.height ?? 0
    if (!srcWidth || !srcHeight) {
      console.warn(`skipping (no dimensions): ${sourcePath}`)
      continue
    }

    const webpPath = ext === '.webp' ? sourcePath : sourcePath.slice(0, -ext.length) + '.webp'
    const needsCap = srcWidth > MAX_DIMENSION || srcHeight > MAX_DIMENSION
    const scale = needsCap ? Math.min(MAX_DIMENSION / srcWidth, MAX_DIMENSION / srcHeight) : 1
    const fullWidth = Math.round(srcWidth * scale)
    const fullHeight = Math.round(srcHeight * scale)

    // Full-size (capped) webp.
    if (needsCap || ext !== '.webp') {
      const buffer = await sharp(sourcePath)
        .rotate()
        .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
        .toBuffer()
      // Only replace an existing webp if the re-encode actually helps.
      if (ext !== '.webp' || buffer.byteLength < sourceStat.size) {
        await writeFile(webpPath, buffer)
        if (ext !== '.webp') {
          await rm(sourcePath)
          conversionRenames.set(basename(sourcePath), basename(webpPath))
        }
      }
    }

    // Responsive variants.
    const stemPath = webpPath.slice(0, -'.webp'.length)
    const variants: { w: number; src: string }[] = []
    for (const width of VARIANT_WIDTHS) {
      if (width >= fullWidth) break
      const variantPath = `${stemPath}-w${width}.webp`
      try {
        await stat(variantPath)
      } catch {
        await sharp(webpPath)
          .resize({ width })
          .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
          .toFile(variantPath)
      }
      variants.push({ w: width, src: publicPath(variantPath) })
    }
    variants.push({ w: fullWidth, src: publicPath(webpPath) })

    // LQIP: tiny blurred placeholder inlined as a data URI.
    const lqipBuffer = await sharp(webpPath).resize({ width: 16 }).webp({ quality: 20 }).toBuffer()

    const finalStat = await stat(webpPath)
    afterTotal += finalStat.size
    manifest[publicPath(webpPath)] = {
      width: fullWidth,
      height: fullHeight,
      lqip: `data:image/webp;base64,${lqipBuffer.toString('base64')}`,
      variants,
    }
  }

  await rewriteReferences(conversionRenames)

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)))
  await writeFile(MANIFEST_PATH, JSON.stringify(sorted, null, 2))

  const mb = (n: number) => `${(n / (1024 * 1024)).toFixed(1)} MB`
  console.log(`Processed ${sources.length} images.`)
  console.log(`Full-size total: ${mb(beforeTotal)} -> ${mb(afterTotal)}`)
  console.log(`Manifest entries: ${Object.keys(sorted).length} -> ${relative(PROJECT_ROOT, MANIFEST_PATH)}`)
}

main().catch((error) => {
  console.error('Image optimization failed:', error)
  process.exit(1)
})
