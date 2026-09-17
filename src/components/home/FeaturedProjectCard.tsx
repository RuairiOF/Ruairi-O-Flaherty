import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SmartImage, { imageMeta } from '../SmartImage'
import TiltedCard from '../reactbits/TiltedCard'
import type { Project } from '../../types'

/**
 * cv.ts stores image paths already prefixed with BASE_URL, while SmartImage
 * expects raw manifest keys — strip the base back off.
 */
export function toManifestPath(src: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return base && src.startsWith(base) ? src.slice(base.length) : src
}

/**
 * Some cv.ts galleries still point at folders that were flattened into
 * /images/photos/gallery — fall back to the same filename there before giving
 * SmartImage a path it cannot resolve.
 */
function resolveThumbnail(src: string): string {
  const path = toManifestPath(src)
  if (imageMeta(path)) return path
  const file = path.split('/').pop()
  const flattened = `/images/photos/gallery/${file}`
  return imageMeta(flattened) ? flattened : path
}

const TILE_SIZES = '(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw'

interface FeaturedProjectCardProps {
  project: Project
  /** Zero-based position, rendered as the card's index label */
  index: number
}

export default function FeaturedProjectCard({
  project,
  index,
}: FeaturedProjectCardProps) {
  const gallery = (project.gallery || []).filter(
    image => image && !image.includes('[TODO')
  )
  const thumbnail =
    gallery.find(image => image !== project.image) ||
    gallery[0] ||
    project.image

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="card card-hover group flex h-full flex-col"
      aria-label={`View details for ${project.title}`}
    >
      <TiltedCard maxTilt={6} scale={1.03} className="overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden bg-line/5">
          {thumbnail ? (
            <SmartImage
              src={resolveThumbnail(thumbnail)}
              alt={`${project.title} preview`}
              sizes={TILE_SIZES}
              className={`h-full w-full object-cover transition-transform duration-slow ease-out-expo group-hover:scale-[1.04] ${project.imagePosition ?? 'object-center'}`}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink-muted">
              No preview image
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
          <span className="pointer-events-none absolute left-4 top-4 font-mono text-xs text-ink-muted">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </TiltedCard>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="heading-4 text-ink transition-colors duration-fast group-hover:text-accent">
          {project.title}
        </h3>
        <p className="prose mt-2 line-clamp-3 text-sm">{project.description}</p>

        {project.tags.length > 0 && !project.tags[0].includes('[TODO') && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="rounded-full border border-line/10 bg-line/5 px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-ink-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-accent">
          View project
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-base ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  )
}
