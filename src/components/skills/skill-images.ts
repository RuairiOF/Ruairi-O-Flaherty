import type { SkillShowcase } from '@/types'

const basePath = import.meta.env.BASE_URL || '/'
const baseNoSlash = basePath.replace(/\/$/, '')

/**
 * Two showcases ship without imagery of their own; these stand in for them so
 * every card in the grid reads the same way.
 */
export const skillImageFallbacks: Record<string, string> = {
  'Business & Logistics': `${basePath}images/photos/radios.webp`,
  'Software Development': `${basePath}images/photos/MeOnALaptop.webp`,
}

/** Strips the deploy base so the path matches an image-manifest key. */
export function toManifestPath(src: string): string {
  return baseNoSlash && src.startsWith(baseNoSlash) ? src.slice(baseNoSlash.length) : src
}

export function withFallbackImage(showcase: SkillShowcase): SkillShowcase {
  if (showcase.images.length > 0) return showcase

  const fallback = skillImageFallbacks[showcase.title]
  if (!fallback) return showcase

  return { ...showcase, images: [fallback] }
}
