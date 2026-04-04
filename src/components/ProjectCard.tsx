import type { KeyboardEvent, MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Project } from '../types'

interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className = '' }: ProjectCardProps) {
  const navigate = useNavigate()
  const projectPath = `/projects/${project.slug}`
  const galleryImages = (project.gallery || []).filter((image) => image && !image.includes('[TODO'))
  const thumbnail = galleryImages.find((image) => image !== project.image) || galleryImages[0] || project.image
  const hasLogoImage = Boolean(
    project.image &&
    !project.image.includes('[TODO') &&
    (/\/images\/logos\//i.test(project.image) || /logo/i.test(project.image))
  )

  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (target.closest('a, button')) return
    navigate(projectPath)
  }

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      navigate(projectPath)
    }
  }

  return (
    <div
      className={`card card-hover h-full cursor-pointer ${className}`}
      role="link"
      tabIndex={0}
      aria-label={`View details for ${project.title}`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {hasLogoImage && (
              <img
                src={project.image}
                alt={`${project.title} logo`}
                className="h-8 w-8 flex-shrink-0 rounded-md border border-stone-200/60 bg-white object-contain dark:border-white/10 dark:bg-white/10"
                loading="lazy"
                decoding="async"
              />
            )}
            <h3 className="heading-4 text-stone-900 dark:text-white">{project.title}</h3>
          </div>
          <p className="mt-1 truncate text-sm text-stone-600 dark:text-stone-300">
            {project.description}
          </p>
        </div>

        <div className="mb-4 overflow-hidden rounded-xl border border-stone-200/70 bg-stone-50 dark:border-white/10 dark:bg-white/5">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={`${project.title} thumbnail`}
              className={`h-48 w-full object-cover ${project.imagePosition ?? 'object-center'}`}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-stone-500 dark:text-stone-400">
              No preview image
            </div>
          )}
        </div>

        {project.tags.length > 0 && !project.tags[0].includes('[TODO') && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800 dark:bg-teal-500/15 dark:text-teal-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link
          to={projectPath}
          className="mt-auto pt-5 inline-flex text-sm font-medium text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
        >
          View project details
        </Link>
      </div>
    </div>
  )
}
