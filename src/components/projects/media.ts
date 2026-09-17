import { imageMeta } from '../SmartImage'
import type { Project } from '../../types'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

/**
 * cv.ts builds its media paths with BASE_URL already applied, while SmartImage
 * and image-manifest.json key off the bare public path. A couple of folders were
 * also renamed on disk after cv.ts was written, so normalise those here too.
 */
export function toManifestPath(src: string): string {
  let path = src
  if (BASE && path.startsWith(`${BASE}/`)) path = path.slice(BASE.length)
  if (!path.startsWith('/')) path = `/${path}`
  return path.replace('/images/photos/Printing/', '/images/photos/gallery/')
}

/** Absolute URL for elements that don't go through SmartImage (e.g. <video>). */
export function withBase(src: string): string {
  return `${BASE}${toManifestPath(src)}`
}

export function isVideoPath(src: string): boolean {
  return /\.(mp4|webm|mov)$/i.test(src)
}

export function isLogoPath(src: string): boolean {
  return /\/images\/logos\//i.test(src) || /logo/i.test(src)
}

/** Width / height from the manifest, when known. */
export function aspectOf(src: string): number | undefined {
  const meta = imageMeta(src)
  return meta ? meta.width / meta.height : undefined
}

export interface ProjectMedia {
  /** Every usable still, manifest-verified, in gallery order */
  images: string[]
  /** Any video files in the gallery */
  videos: string[]
  /** Best hero/preview still — landscape and non-logo where possible */
  cover?: string
  /** Index of `cover` inside `images` */
  coverIndex: number
  /** Brand mark, when the project has a real logo file */
  logo?: string
}

function usable(path: string): boolean {
  return Boolean(imageMeta(path))
}

/** Resolves a project's gallery into verified, manifest-keyed media. */
export function getProjectMedia(project: Project): ProjectMedia {
  const raw = (project.gallery || [])
    .filter((item) => item && !item.includes('[TODO'))
    .map(toManifestPath)

  const videos = raw.filter(isVideoPath)
  const images = raw.filter((item) => !isVideoPath(item) && usable(item))

  const rawLogo = project.image && !project.image.includes('[TODO')
    ? toManifestPath(project.image)
    : undefined
  const logo = rawLogo && usable(rawLogo) && isLogoPath(rawLogo) ? rawLogo : undefined

  const nonLogo = images.filter((item) => !isLogoPath(item))
  const landscape = nonLogo.find((item) => (aspectOf(item) ?? 1) >= 1.2)
  const cover = landscape || nonLogo[0] || images[0]

  return {
    images,
    videos,
    cover,
    coverIndex: cover ? images.indexOf(cover) : -1,
    logo,
  }
}

/** First sentence of the description — the one-line hook for list rows. */
export function hookOf(project: Project): string {
  const text = project.description.trim()
  const end = text.indexOf('. ')
  return end > 40 ? text.slice(0, end + 1) : text
}

/* -------------------------------------------------------------------------- */
/* Highlight parsing                                                          */
/* -------------------------------------------------------------------------- */

export interface MetricHighlight {
  kind: 'metric'
  value: number
  decimals: number
  suffix: string
  label: string
  source: string
}

export interface NoteHighlight {
  kind: 'note'
  label: string
}

export type ParsedHighlight = MetricHighlight | NoteHighlight

const METRIC_RE = /(\d[\d,]*(?:\.\d+)?)\s*(%|\/5|\+|k(?![a-z])|K(?![a-z])|M(?![a-z]))/

function tidy(text: string): string {
  const trimmed = text.replace(/^[\s,;:.\-–—]+/, '').replace(/[\s,;:]+$/, '')
  if (!trimmed) return trimmed
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

/**
 * Turns "40% average reduction in shipping costs" into a countable metric and
 * leaves prose-only highlights ("Automated end-to-end order fulfillment") as
 * notes. A bare number without a unit stays a note — "8-printer setup" reads
 * badly once you split the number off the noun.
 */
export function parseHighlight(text: string): ParsedHighlight {
  const match = METRIC_RE.exec(text)
  if (!match || match.index === undefined) return { kind: 'note', label: text }

  const [full, digits, rawSuffix] = match
  const numeric = digits.replace(/,/g, '')
  const value = Number.parseFloat(numeric)
  if (!Number.isFinite(value)) return { kind: 'note', label: text }

  const after = tidy(text.slice(match.index + full.length))
  const before = tidy(text.slice(0, match.index))
  const label = after || before
  if (!label) return { kind: 'note', label: text }

  const decimals = (numeric.split('.')[1] || '').length

  return {
    kind: 'metric',
    value,
    decimals,
    suffix: rawSuffix === 'K' ? 'k' : rawSuffix,
    label,
    source: text,
  }
}
