import { X } from 'lucide-react'
import type { SkillShowcase } from '@/types'
import { Dialog } from '../Lightbox'
import SmartImage from '../SmartImage'
import { toManifestPath } from './skill-images'

interface SkillDialogProps {
  showcase: SkillShowcase | null
  onClose: () => void
  /** Opens the shared lightbox at `index` within `showcase.images`. */
  onViewImage: (index: number) => void
}

/** Skill detail panel built on the shared glass `Dialog`. */
export function SkillDialog({ showcase, onClose, onViewImage }: SkillDialogProps) {
  return (
    <Dialog
      open={showcase !== null}
      onClose={onClose}
      label={showcase ? `${showcase.title} details` : 'Skill details'}
      className="w-full max-w-2xl"
    >
      {showcase && (
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Skill</p>
              <h2 className="heading-3 mt-2 text-ink">{showcase.title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 rounded-full border border-line/10 p-2 text-ink-muted transition-colors duration-fast hover:bg-line/5 hover:text-ink"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <p className="prose mt-4">{showcase.description}</p>

          {showcase.images.length > 0 && (
            <div className="mt-6">
              <p className="eyebrow">Gallery</p>
              <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {showcase.images.map((image, index) => (
                  <li key={image}>
                    <button
                      type="button"
                      onClick={() => onViewImage(index)}
                      className="group block w-full overflow-hidden rounded-xl border border-line/10"
                      aria-label={`View ${showcase.title} image ${index + 1} full size`}
                    >
                      <SmartImage
                        src={toManifestPath(image)}
                        alt={`${showcase.title} — image ${index + 1}`}
                        sizes="(min-width: 640px) 200px, 45vw"
                        className={`h-24 w-full object-cover transition-transform duration-base ease-out-expo group-hover:scale-105 ${showcase.imagePosition ?? 'object-center'}`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <p className="eyebrow">Tools</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {showcase.tools.map((tool) => (
                <li
                  key={tool}
                  className="rounded-full border border-line/10 bg-line/[0.04] px-3 py-1 font-mono text-xs text-ink-muted"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Dialog>
  )
}
