import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import SmartImage from '../SmartImage'
import Magnet from '../reactbits/Magnet'
import { getProjectMedia } from './media'
import type { Project } from '../../types'

interface ProjectNavProps {
  previous: Project
  next: Project
}

interface NavCardProps {
  project: Project
  direction: 'previous' | 'next'
}

function NavCard({ project, direction }: NavCardProps) {
  const { cover, logo } = getProjectMedia(project)
  const peek = cover || logo
  const isNext = direction === 'next'
  const Arrow = isNext ? ArrowRight : ArrowLeft

  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`card card-hover group flex items-center gap-4 p-4 sm:p-5 ${
        isNext ? 'sm:flex-row-reverse sm:text-right' : ''
      }`}
    >
      <Magnet className="shrink-0 text-ink-muted transition-colors duration-base group-hover:text-accent" padding={12}>
        <Arrow aria-hidden="true" className="h-5 w-5" />
      </Magnet>

      <div className="min-w-0 flex-1">
        <p className="eyebrow">{isNext ? 'Next project' : 'Previous project'}</p>
        <p className="heading-4 mt-1 truncate text-ink">{project.title}</p>
      </div>

      {peek && (
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-line/10 bg-surface-2/40 sm:h-16 sm:w-16">
          <SmartImage
            src={peek}
            alt=""
            aria-hidden="true"
            sizes="64px"
            className={`h-full w-full ${peek === logo ? 'object-contain p-2' : 'object-cover'}`}
          />
        </div>
      )}
    </Link>
  )
}

/** Wrapping prev / next case-study links. */
export default function ProjectNav({ previous, next }: ProjectNavProps) {
  return (
    <nav aria-label="More projects" className="grid gap-4 sm:grid-cols-2">
      <NavCard project={previous} direction="previous" />
      <NavCard project={next} direction="next" />
    </nav>
  )
}
