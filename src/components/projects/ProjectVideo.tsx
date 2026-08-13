import { imageMeta } from '../SmartImage'
import Reveal from './Reveal'
import { withBase } from './media'

interface ProjectVideoProps {
  src: string
  title: string
  /** Manifest path used as the poster frame */
  poster?: string
  caption?: string
}

/** Inline production video — metadata-only until the visitor presses play. */
export default function ProjectVideo({ src, title, poster, caption }: ProjectVideoProps) {
  const posterMeta = poster ? imageMeta(poster) : undefined

  return (
    <Reveal y={28}>
      <figure className="card overflow-hidden">
        <video
          src={withBase(src)}
          poster={poster ? withBase(poster) : undefined}
          controls
          playsInline
          preload="metadata"
          width={posterMeta?.width}
          height={posterMeta?.height}
          aria-label={`${title} production video`}
          className="aspect-video h-auto w-full bg-surface-2/60 object-cover"
        />
        {caption && (
          <figcaption className="px-4 py-3 font-mono text-xs text-ink-muted">{caption}</figcaption>
        )}
      </figure>
    </Reveal>
  )
}
