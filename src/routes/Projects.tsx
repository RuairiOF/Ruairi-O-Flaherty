import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { SEO } from '../components/SEO'
import { Section } from '../components/Section'
import { ProjectCard } from '../components/ProjectCard'
import { getAllProjects } from '../content/cv'
import { getStaticSeoPage } from '../content/seo-pages'
import { debounce } from '../lib/utils'

export function Projects() {
  const [searchTerm, setSearchTerm] = useState('')

  const projects = getAllProjects()
  const seo = getStaticSeoPage('/projects')

  // Debounced search
  const debouncedSetSearchTerm = useMemo(
    () => debounce((term: string) => setSearchTerm(term), 300),
    []
  )

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Skip projects with placeholder data
      if (project.title.includes('[TODO')) return false

      // Search filter
      const matchesSearch = !searchTerm ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      return matchesSearch
    })
  }, [projects, searchTerm])

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
        {/* Filters */}
        <div className="mb-12">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-3 border border-stone-300 dark:border-white/10 rounded-lg bg-white dark:bg-white/10 text-stone-900 dark:text-white placeholder-stone-500 dark:placeholder-stone-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                onChange={(e) => debouncedSetSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-8">
          <p className="text-stone-500 dark:text-stone-400 text-center">
            Showing {filteredProjects.length} of {projects.filter(p => !p.title.includes('[TODO')).length} projects
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-stone-500 dark:text-stone-400 mb-4">
              {projects.filter(p => !p.title.includes('[TODO')).length === 0
                ? 'No projects available yet. Please attach your CV to populate this section.'
                : 'No projects match your search.'
              }
            </p>
          </div>
        )}
      </Section>
    </>
  )
}
