import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SmartImage from './SmartImage'
import ShinyText from './reactbits/ShinyText'
import { getProjectMedia, hookOf } from './projects/media'
import type { Project } from '../types'

interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className = '' }: ProjectCardProps) {
  const { cover, logo } = getProjectMedia(project)

  return (
    <article className={`card card-hover group relative h-full ${className}`}>
      <div className="relative z-10 flex h-full flex-col">
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line/10 bg-surface-2/40">
          {cover ? (
            <SmartImage
              src={cover}
              alt={`${project.title} preview`}
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw"
              className={`h-full w-full object-cover transition-transform duration-slow ease-out-expo group-hover:scale-[1.04] ${
                project.imagePosition ?? 'object-center'
              }`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/15 to-accent-2/10">
              {logo ? (
                <SmartImage
                  src={logo}
                  alt={`${project.title} logo`}
                  sizes="160px"
                  className="h-16 w-16 object-contain"
                />
              ) : (
                <span className="eyebrow">{project.title}</span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            {logo && (
              <SmartImage
                src={logo}
                alt=""
                aria-hidden="true"
                sizes="40px"
                className="h-8 w-8 shrink-0 rounded-md border border-line/10 bg-surface/60 object-contain p-1"
              />
            )}
            <h3 className="heading-4 text-ink">{project.title}</h3>
          </div>

          <p className="prose line-clamp-3 text-sm">{hookOf(project)}</p>

          {project.tags.length > 0 && !project.tags[0].includes('[TODO') && (
            <ul className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag) => (
                <li
                  key={tag}
                  className="glass-panel rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          {/* Stretched link: the whole card is clickable through one real anchor */}
          <Link
            to={`/projects/${project.slug}`}
            aria-label={`View details for ${project.title}`}
            className="mt-auto inline-flex w-max items-center gap-1.5 pt-3 text-sm font-medium text-accent after:absolute after:inset-0 after:z-20 after:rounded-2xl after:content-['']"
          >
            <ShinyText>View project</ShinyText>
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-base ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </article>
  )
}
