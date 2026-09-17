import { useState, type ImgHTMLAttributes } from 'react'
import manifest from '@/content/image-manifest.json'

interface ManifestEntry {
  width: number
  height: number
  lqip: string
  variants: { w: number; src: string }[]
}

const entries = manifest as Record<string, ManifestEntry>

export function imageMeta(src: string): ManifestEntry | undefined {
  return entries[src]
}

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /** Public path as it appears in image-manifest.json, e.g. "/images/photos/gallery/IMG_2856.webp" */
  src: string
  alt: string
  /**
   * The `sizes` attribute — how wide the image renders. Defaults to full viewport width.
   * e.g. "(min-width: 1024px) 33vw, 50vw" for a grid tile.
   */
  sizes?: string
  /** Set for above-the-fold images to skip lazy-loading */
  priority?: boolean
}

/**
 * Manifest-driven <img>: srcset/sizes, intrinsic width/height (no CLS),
 * lazy loading and an inline LQIP background that hides once loaded.
 * Falls back to a plain <img> for paths not in the manifest.
 */
export default function SmartImage({
  src,
  alt,
  sizes = '100vw',
  priority = false,
  className,
  style,
  ...rest
}: SmartImageProps) {
  const meta = entries[src]
  const [loaded, setLoaded] = useState(false)
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')

  if (!meta) {
    return (
      <img
        src={`${base}${src}`}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={className}
        style={style}
        {...rest}
      />
    )
  }

  const srcSet = meta.variants.map((v) => `${base}${v.src} ${v.w}w`).join(', ')

  return (
    <img
      src={`${base}${src}`}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={meta.width}
      height={meta.height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={className}
      style={{
        ...style,
        ...(loaded
          ? undefined
          : {
              backgroundImage: `url(${meta.lqip})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }),
      }}
      {...rest}
    />
  )
}
