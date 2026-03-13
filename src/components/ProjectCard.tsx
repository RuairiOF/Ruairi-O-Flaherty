import { ExternalLink, Github } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { KeyboardEvent, MouseEvent } from 'react'
import type { Project } from '../types'
import { isExternalUrl } from '../lib/utils'

interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className = '' }: ProjectCardProps) {
  const navigate = useNavigate()
  const hasLinks = project.repoUrl || project.liveUrl
  const projectPath = `/projects/${project.slug}`

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
      className={`card card-hover cursor-pointer ${className}`}
      role="link"
      tabIndex={0}
      aria-label={`View details for ${project.title}`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {project.image && (
              <img
                src={project.image}
                alt={`${project.title} logo`}
                className="h-8 w-8 object-contain rounded-md bg-white dark:bg-white/10 border border-stone-200/60 dark:border-white/10"
                loading="lazy"
                decoding="async"
              />
            )}
            <h3 className="heading-4 text-stone-900 dark:text-white">
              {project.title}
            </h3>
          </div>
          {hasLinks && (
            <div className="flex items-center space-x-2 ml-4">
              {project.repoUrl && !project.repoUrl.includes('[TODO') && (
                <a
                  href={project.repoUrl}
                  target={isExternalUrl(project.repoUrl) ? '_blank' : undefined}
                  rel={isExternalUrl(project.repoUrl) ? 'noopener noreferrer' : undefined}
                  className="text-stone-500 hover:text-teal-600 dark:text-stone-400 dark:hover:text-teal-400 transition-colors"
                  aria-label="View source code"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {project.liveUrl && !project.liveUrl.includes('[TODO') && (
                <a
                  href={project.liveUrl}
                  target={isExternalUrl(project.liveUrl) ? '_blank' : undefined}
                  rel={isExternalUrl(project.liveUrl) ? 'noopener noreferrer' : undefined}
                  className="text-stone-500 hover:text-teal-600 dark:text-stone-400 dark:hover:text-teal-400 transition-colors"
                  aria-label="View live demo"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>

        <p className="prose mb-4">
          {project.description}
        </p>

        {project.tags.length > 0 && !project.tags[0].includes('[TODO') && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate(projectPath)}
          className="mt-5 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
        >
          View project details →
        </button>
      </div>
    </div>
  )
}
