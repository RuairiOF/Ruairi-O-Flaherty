import SmartImage from '../SmartImage'
import { useRevealOnScroll } from '@/lib/motion'
import { isLogoPath } from './media'

export interface GalleryTile {
  src: string
  /** Index inside the project's full image list — what the lightbox opens on */
  index: number
}

interface ProjectGalleryProps {
  tiles: GalleryTile[]
  title: string
  onOpen: (index: number) => void
}

/** Responsive thumb grid; every tile opens the shared lightbox. */
export default function ProjectGallery({ tiles, title, onOpen }: ProjectGalleryProps) {
  const ref = useRevealOnScroll<HTMLDivElement>({ targets: '[data-reveal]', y: 24, stagger: 0.05 })

  if (tiles.length === 0) return null

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3"
    >
      {tiles.map((tile, position) => (
        <button
          key={tile.src}
          type="button"
          data-reveal
          onClick={() => onOpen(tile.index)}
          className="group card card-hover relative aspect-[4/3] overflow-hidden"
          style={position === 0 && tiles.length > 2 ? { gridColumn: 'span 2' } : undefined}
          aria-label={`Open image ${position + 1} of ${tiles.length} for ${title}`}
        >
          <SmartImage
            src={tile.src}
            alt={`${title} — image ${position + 1}`}
            sizes="(min-width: 768px) 33vw, 50vw"
            className={`h-full w-full transition-transform duration-slow ease-out-expo group-hover:scale-[1.04] ${
              isLogoPath(tile.src) ? 'object-contain p-6' : 'object-cover'
            }`}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/50 to-transparent opacity-0 transition-opacity duration-base group-hover:opacity-100"
          />
        </button>
      ))}
    </div>
  )
}
