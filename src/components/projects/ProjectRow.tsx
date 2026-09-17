import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SmartImage from '../SmartImage'
import SpotlightCard from '../reactbits/SpotlightCard'
import ShinyText from '../reactbits/ShinyText'
import { gsap, useGSAP, useReducedMotion, useRevealOnScroll } from '@/lib/motion'
import { getProjectMedia, hookOf } from './media'
import type { Project } from '../../types'

interface ProjectRowProps {
  project: Project
  /** Zero-based position — rendered as the "01" index marker */
  index: number
  /** Flip the media to the leading column */
  reversed?: boolean
}

/** One full-width editorial row on the Projects index. */
export default function ProjectRow({ project, index, reversed = false }: ProjectRowProps) {
  const rootRef = useRevealOnScroll<HTMLDivElement>({ y: 40, duration: 0.8 })
  const mediaRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { cover, logo } = getProjectMedia(project)

  useGSAP(
    () => {
      const frame = mediaRef.current
      if (!frame || reduced || !cover) return
      const target = frame.querySelector('img')
      if (!target) return
      gsap.fromTo(
        target,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: frame,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      )
    },
    { scope: mediaRef, dependencies: [reduced, cover] },
  )

  return (
    <article ref={rootRef}>
      <SpotlightCard className="card-hover group grid items-center gap-6 p-4 sm:p-6 lg:grid-cols-2 lg:gap-10 lg:p-8">
        <div
          ref={mediaRef}
          className={`relative z-10 overflow-hidden rounded-xl border border-line/10 bg-surface-2/40 ${
            reversed ? 'lg:order-first' : ''
          }`}
        >
          <div className="aspect-[16/10] w-full">
            {cover ? (
              <SmartImage
                src={cover}
                alt={`${project.title} preview`}
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="h-full w-full scale-110 object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/15 to-accent-2/10">
                {logo ? (
                  <SmartImage
                    src={logo}
                    alt={`${project.title} logo`}
                    sizes="200px"
                    className="h-20 w-20 object-contain sm:h-28 sm:w-28"
                  />
                ) : (
                  <span className="eyebrow">{project.title}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-ink-muted">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-line/10" />
            {project.featured && <span className="eyebrow">Featured</span>}
          </div>

          <div className="flex items-center gap-3">
            {logo && (
              <SmartImage
                src={logo}
                alt=""
                aria-hidden="true"
                sizes="48px"
                className="h-9 w-9 shrink-0 rounded-lg border border-line/10 bg-surface/60 object-contain p-1"
              />
            )}
            <h2 className="heading-3 text-ink">{project.title}</h2>
          </div>

          <p className="prose">{hookOf(project)}</p>

          {project.tags.length > 0 && !project.tags[0].includes('[TODO') && (
            <ul className="flex flex-wrap gap-2">
              {project.tags.slice(0, 5).map((tag) => (
                <li
                  key={tag}
                  className="glass-panel rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          {/* Stretched link: one real anchor, whole row clickable, text stays selectable */}
          <Link
            to={`/projects/${project.slug}`}
            aria-label={`View the ${project.title} case study`}
            className="mt-1 inline-flex w-max items-center gap-1.5 text-sm font-medium text-accent after:absolute after:inset-0 after:z-20 after:rounded-2xl after:content-['']"
          >
            <ShinyText>View case study</ShinyText>
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-base ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </SpotlightCard>
    </article>
  )
}
