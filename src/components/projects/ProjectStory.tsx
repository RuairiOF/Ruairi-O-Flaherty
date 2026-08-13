import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Maximize2 } from 'lucide-react'
import SmartImage from '../SmartImage'
import Reveal from './Reveal'
import type { GalleryTile } from './ProjectGallery'

interface ProjectStoryProps {
  title: string
  about?: string
  /** longDescription split on blank lines */
  paragraphs: string[]
  /** Images to breathe between the text blocks (empty for thin galleries) */
  inline: GalleryTile[]
  onOpen: (index: number) => void
  /** Link the phrase "ROF's 3D" to its case study (off on that page itself) */
  linkRofs: boolean
}

/** Auto-links the one cross-reference that appears in the copy. */
function withProjectLinks(text: string, enabled: boolean): ReactNode {
  if (!enabled || !text.includes("ROF's 3D")) return text
  return text.split(/(ROF's 3D)/g).map((part, index) =>
    part === "ROF's 3D" ? (
      <Link
        key={index}
        to="/projects/rofs-3d"
        className="font-medium text-accent underline-offset-4 hover:underline"
      >
        {part}
      </Link>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  )
}

interface StoryFigureProps {
  tile: GalleryTile
  title: string
  onOpen: (index: number) => void
}

function StoryFigure({ tile, title, onOpen }: StoryFigureProps) {
  return (
    <Reveal y={28}>
      <button
        type="button"
        onClick={() => onOpen(tile.index)}
        className="card card-hover group relative block aspect-[16/9] w-full overflow-hidden"
        aria-label={`Open a larger view of ${title}`}
      >
        <SmartImage
          src={tile.src}
          alt={`${title} in context`}
          sizes="(min-width: 1024px) 46rem, 92vw"
          className="h-full w-full object-cover transition-transform duration-slow ease-out-expo group-hover:scale-[1.03]"
        />
        <span
          aria-hidden="true"
          className="glass-panel absolute bottom-3 right-3 rounded-full p-2 text-ink opacity-0 transition-opacity duration-base group-hover:opacity-100"
        >
          <Maximize2 className="h-4 w-4" />
        </span>
      </button>
    </Reveal>
  )
}

/** The narrative column: sticky label, lead paragraph, story, interleaved media. */
export default function ProjectStory({
  title,
  about,
  paragraphs,
  inline,
  onOpen,
  linkRofs,
}: ProjectStoryProps) {
  if (!about && paragraphs.length === 0) return null

  // Drop a figure after the 2nd and 4th paragraph when there's media to spare.
  const figureAfter = new Map<number, GalleryTile>()
  inline.forEach((tile, i) => {
    const at = i === 0 ? 1 : 3
    if (at < paragraphs.length - 1) figureAfter.set(at, tile)
  })

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] lg:gap-12">
      <div className="lg:sticky lg:top-28 lg:h-max">
        <p className="eyebrow">The story</p>
        <span aria-hidden="true" className="mt-4 hidden h-px w-12 bg-line/15 lg:block" />
      </div>

      <div className="max-w-2xl space-y-6">
        {about && (
          <Reveal>
            <p className="text-lg leading-relaxed text-ink">{about}</p>
          </Reveal>
        )}

        {paragraphs.map((paragraph, index) => (
          <Fragment key={index}>
            <Reveal>
              <p className="prose">{withProjectLinks(paragraph, linkRofs)}</p>
            </Reveal>
            {figureAfter.has(index) && (
              <StoryFigure
                tile={figureAfter.get(index) as GalleryTile}
                title={title}
                onOpen={onOpen}
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
