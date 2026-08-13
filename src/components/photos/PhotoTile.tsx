import { Maximize2 } from 'lucide-react'
import SmartImage from '../SmartImage'
import { useRevealOnScroll } from '@/lib/motion'

interface PhotoTileProps {
  src: string
  alt: string
  /** Position in the full gallery (0-based) — used for the lightbox + a11y label */
  index: number
  total: number
  sizes: string
  onOpen: (index: number) => void
}

/**
 * One masonry tile: a real button wrapping a manifest-driven image.
 * Reveals itself on scroll, lifts and glows on hover.
 */
export default function PhotoTile({ src, alt, index, total, sizes, onOpen }: PhotoTileProps) {
  const ref = useRevealOnScroll<HTMLButtonElement>({
    y: 28,
    delay: (index % 4) * 0.06,
  })

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open photo ${index + 1} of ${total}: ${alt}`}
      className="group relative block w-full overflow-hidden rounded-xl border border-line/10 bg-surface/40 transition-all duration-base ease-out-expo hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_18px_48px_-14px_rgb(var(--glow)_/_0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <SmartImage
        src={src}
        alt={alt}
        sizes={sizes}
        className="h-auto w-full transition-transform duration-slow ease-out-expo group-hover:scale-[1.04]"
      />

      {/* Hover scrim + affordance */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-bg/0 to-bg/0 opacity-0 transition-opacity duration-base ease-out-expo group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 right-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full glass-panel text-ink opacity-0 transition-all duration-base ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        <Maximize2 className="h-4 w-4" />
      </span>
    </button>
  )
}
