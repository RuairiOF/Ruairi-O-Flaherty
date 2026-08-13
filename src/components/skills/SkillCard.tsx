import { GalleryHorizontal, Plus } from 'lucide-react'
import type { SkillShowcase } from '@/types'
import SpotlightCard from '../reactbits/SpotlightCard'
import SmartImage from '../SmartImage'
import { toManifestPath } from './skill-images'

interface SkillCardProps {
  showcase: SkillShowcase
  index: number
  onOpen: () => void
}

const CARD_SIZES = '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw'

/** Keyboard-operable card that opens the skill detail dialog. */
export function SkillCard({ showcase, index, onOpen }: SkillCardProps) {
  const cover = showcase.images[0]
  const extra = showcase.images.length - 1

  return (
    <SpotlightCard className="card-hover h-full">
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="group flex h-full w-full flex-col rounded-2xl text-left"
      >
        {cover ? (
          <span className="relative block h-40 overflow-hidden sm:h-44">
            <SmartImage
              src={toManifestPath(cover)}
              alt={showcase.title}
              sizes={CARD_SIZES}
              className={`h-full w-full object-cover transition-transform duration-slow ease-out-expo group-hover:scale-105 ${showcase.imagePosition ?? 'object-center'}`}
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/10 to-transparent"
            />
            <span className="absolute left-4 top-3 rounded-full bg-bg/60 px-2 py-0.5 font-mono text-xs text-ink-muted backdrop-blur">
              {String(index + 1).padStart(2, '0')}
            </span>
            {extra > 0 && (
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full border border-line/10 bg-bg/70 px-2 py-0.5 font-mono text-[11px] text-ink-muted backdrop-blur">
                <GalleryHorizontal className="h-3 w-3" aria-hidden="true" />
                {extra + 1}
              </span>
            )}
          </span>
        ) : (
          <span className="relative flex h-40 items-end overflow-hidden bg-gradient-to-br from-accent/15 via-accent-2/10 to-transparent p-4 sm:h-44">
            <span className="absolute left-4 top-3 font-mono text-xs text-ink-muted">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="flex flex-wrap gap-1.5">
              {showcase.tools.slice(0, 4).map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-line/10 bg-line/[0.05] px-2 py-0.5 font-mono text-[10px] text-ink-muted"
                >
                  {tool}
                </span>
              ))}
            </span>
          </span>
        )}

        <span className="flex flex-1 flex-col p-5">
          <span className="font-display text-lg font-medium text-ink transition-colors duration-fast group-hover:text-accent">
            {showcase.title}
          </span>
          <span className="prose mt-2 line-clamp-3 text-sm">{showcase.description}</span>
          <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-2">
            <Plus className="h-3 w-3" aria-hidden="true" />
            Details
          </span>
        </span>
      </button>
    </SpotlightCard>
  )
}
