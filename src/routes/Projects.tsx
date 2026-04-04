import { useMemo } from 'react'
import { SEO } from '../components/SEO'
import { Section } from '../components/Section'
import { ProjectCard } from '../components/ProjectCard'
import { getAllProjects } from '../content/cv'
import { getStaticSeoPage } from '../content/seo-pages'

export function Projects() {
  const projects = getAllProjects()
  const seo = getStaticSeoPage('/projects')

  const visibleProjects = useMemo(() => {
    return projects.filter(project => !project.title.includes('[TODO'))
  }, [projects])

  return (
    <>
      <SEO
        title={seo?.title}
        description={seo?.description}
        keywords={seo?.keywords}
        image={seo?.image}
        imageAlt={seo?.imageAlt}
        url={seo?.path}
        type={seo?.type}
        structuredData={seo?.structuredData}
      />

      <Section
        title="Projects"
        description="A collection of work, experiments, and side projects"
        centered
        titleAs="h1"
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
