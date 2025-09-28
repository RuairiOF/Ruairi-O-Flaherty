import { ExternalLink, Github } from 'lucide-react'
import type { Project } from '../types'
import { isExternalUrl } from '../lib/utils'

interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className = '' }: ProjectCardProps) {
  const hasLinks = project.repoUrl || project.liveUrl

  return (
    <div className={`card card-hover ${className}`}>
      {project.image && (
        <div className="aspect-video w-full overflow-hidden rounded-t-2xl">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="heading-4 text-gray-900 dark:text-white">
            {project.title}
          </h3>
          {hasLinks && (
            <div className="flex items-center space-x-2 ml-4">
              {project.repoUrl && !project.repoUrl.includes('[TODO') && (
                <a
                  href={project.repoUrl}
                  target={isExternalUrl(project.repoUrl) ? '_blank' : undefined}
                  rel={isExternalUrl(project.repoUrl) ? 'noopener noreferrer' : undefined}
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
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
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                  aria-label="View live demo"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>
        
        <p className="prose mb-4 line-clamp-3">
          {project.description}
        </p>
        
        {project.tags.length > 0 && !project.tags[0].includes('[TODO') && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

