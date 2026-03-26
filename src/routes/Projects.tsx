import { useMemo } from 'react'
import { SEO } from '../components/SEO'
import { Section } from '../components/Section'
import { ProjectCard } from '../components/ProjectCard'
import { getAllProjects } from '../content/cv'

export function Projects() {
  const projects = getAllProjects()

  const visibleProjects = useMemo(() => {
    return projects.filter(project => !project.title.includes('[TODO'))
  }, [projects])

  return (
    <>
      <SEO
        title="Projects"
        description="Portfolio of projects and work"
      />

      <Section
        title="Projects"
        description="A collection of work, experiments, and side projects"
        centered
      >
        {/* Projects Grid */}
        {visibleProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleProjects.map(project => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-stone-500 dark:text-stone-400">
              No projects available yet.
            </p>
          </div>
        )}
      </Section>
    </>
  )
}
