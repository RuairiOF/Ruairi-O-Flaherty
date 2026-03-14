#!/usr/bin/env tsx

import { readdirSync, statSync } from 'node:fs'
import { readFile, rm, writeFile } from 'node:fs/promises'
import { extname, join, relative, resolve } from 'node:path'
import sharp from 'sharp'

const PROJECT_ROOT = process.cwd()
const IMAGES_DIR = resolve(PROJECT_ROOT, 'public', 'images')
const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg'])
const TEXT_FILE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.html'])

interface ConversionResult {
  sourcePath: string
  outputPath: string
  beforeBytes: number
  afterBytes: number
}

interface WebpCandidate {
  alphaQuality?: number
  effort: number
  lossless?: boolean
  nearLossless?: boolean
  quality?: number
  smartSubsample?: boolean
}

function walkDirectory(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkDirectory(fullPath))
      continue
    }

    files.push(fullPath)
  }

  return files
}

function getImageFiles(directory: string): string[] {
  return walkDirectory(directory).filter((filePath) =>
    SUPPORTED_EXTENSIONS.has(extname(filePath).toLowerCase()),
  )
}

function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function convertToWebp(sourcePath: string): Promise<ConversionResult | null> {
  const extension = extname(sourcePath).toLowerCase()
  const outputPath = sourcePath.replace(new RegExp(`${extension}$`, 'i'), '.webp')

  if (outputPath === sourcePath) {
    return null
  }

  const sourceStats = statSync(sourcePath)
  const targetRatio = extension === '.png' && sourceStats.size <= 1024 * 1024 ? 1 : 0.85
  const targetSize = sourceStats.size * targetRatio

  const candidates: WebpCandidate[] =
    extension === '.png'
      ? sourceStats.size <= 1024 * 1024
        ? [
            { lossless: true, effort: 6, alphaQuality: 100 },
            { nearLossless: true, quality: 92, effort: 6, alphaQuality: 100 },
            { nearLossless: true, quality: 86, effort: 6, alphaQuality: 96 },
          ]
        : [
            { nearLossless: true, quality: 92, effort: 6, alphaQuality: 100 },
            { nearLossless: true, quality: 88, effort: 6, alphaQuality: 98 },
            { nearLossless: true, quality: 84, effort: 6, alphaQuality: 96 },
          ]
      : [
          { quality: 92, effort: 6, alphaQuality: 100, smartSubsample: true },
          { quality: 88, effort: 6, alphaQuality: 98, smartSubsample: true },
          { quality: 84, effort: 6, alphaQuality: 96, smartSubsample: true },
          { quality: 82, effort: 6, alphaQuality: 95, smartSubsample: true },
        ]

  let bestBuffer: Buffer | null = null
  let bestSize = Number.POSITIVE_INFINITY

  for (const candidate of candidates) {
    const candidateBuffer = await sharp(sourcePath)
      .rotate()
      .webp(candidate)
      .toBuffer()
    const candidateSize = candidateBuffer.byteLength

    if (!bestBuffer || candidateSize < bestSize) {
      bestBuffer = candidateBuffer
      bestSize = candidateSize
    }

    if (candidateSize <= targetSize) {
      bestBuffer = candidateBuffer
      break
    }
  }

  if (!bestBuffer) {
    return null
  }

  await writeFile(outputPath, bestBuffer)

  const outputStats = statSync(outputPath)
  return {
    sourcePath,
    outputPath,
    beforeBytes: sourceStats.size,
    afterBytes: outputStats.size,
  }
}

async function updateImageReferences(convertedFiles: ConversionResult[]): Promise<void> {
  const filesToPatch = [
    resolve(PROJECT_ROOT, 'index.html'),
    resolve(PROJECT_ROOT, 'public', 'manifest.webmanifest'),
  ]

  const sourceFiles = walkDirectory(resolve(PROJECT_ROOT, 'src')).filter((file) =>
    TEXT_FILE_EXTENSIONS.has(extname(file).toLowerCase()),
  )

  const scriptFiles = walkDirectory(resolve(PROJECT_ROOT, 'scripts')).filter((file) =>
    TEXT_FILE_EXTENSIONS.has(extname(file).toLowerCase()),
  )

  filesToPatch.push(...sourceFiles, ...scriptFiles)

  const replacements = new Map<string, string>()

  for (const conversion of convertedFiles) {
    const sourceRelativePath = `/${relative(resolve(PROJECT_ROOT, 'public'), conversion.sourcePath).replace(/\\/g, '/')}`
    const outputRelativePath = `/${relative(resolve(PROJECT_ROOT, 'public'), conversion.outputPath).replace(/\\/g, '/')}`

    replacements.set(sourceRelativePath, outputRelativePath)
    replacements.set(sourceRelativePath.replace(/ /g, '%20'), outputRelativePath.replace(/ /g, '%20'))

    const sourceName = conversion.sourcePath.split(/[/\\]/).pop()
    const outputName = conversion.outputPath.split(/[/\\]/).pop()
    if (sourceName && outputName) {
      replacements.set(sourceName, outputName)
      replacements.set(sourceName.replace(/ /g, '%20'), outputName.replace(/ /g, '%20'))
    }
  }

  for (const filePath of filesToPatch) {
    let content = ''
    try {
      content = await readFile(filePath, 'utf8')
    } catch {
      continue
    }

    let next = content
    for (const [from, to] of replacements) {
      next = next.split(from).join(to)
    }

    next = next.replace(/"type"\s*:\s*"image\/png"/g, '"type": "image/webp"')
    next = next.replace(/"type"\s*:\s*"image\/jpeg"/g, '"type": "image/webp"')

    if (next !== content) {
      await writeFile(filePath, next, 'utf8')
    }
  }
}

async function removeOriginalFiles(convertedFiles: ConversionResult[]): Promise<void> {
  for (const conversion of convertedFiles) {
    await rm(conversion.sourcePath)
  }
}

async function main(): Promise<void> {
  const imageFiles = getImageFiles(IMAGES_DIR)
  const results: ConversionResult[] = []

  for (const imageFile of imageFiles) {
    const result = await convertToWebp(imageFile)
    if (result) {
      results.push(result)
    }
  }

  await updateImageReferences(results)
  await removeOriginalFiles(results)

  const totalBefore = results.reduce((sum, item) => sum + item.beforeBytes, 0)
  const totalAfter = results.reduce((sum, item) => sum + item.afterBytes, 0)
  const percentSaved = totalBefore === 0 ? 0 : ((totalBefore - totalAfter) / totalBefore) * 100

  console.log(`Converted ${results.length} images to WebP.`)
  console.log(`Before: ${formatSize(totalBefore)}`)
  console.log(`After: ${formatSize(totalAfter)}`)
  console.log(`Saved: ${formatSize(totalBefore - totalAfter)} (${percentSaved.toFixed(2)}%)`)
  console.log('Removed original PNG/JPG/JPEG files from /public/images after conversion.')
}

main().catch((error) => {
  console.error('Image optimization failed:', error)
  process.exit(1)
})
