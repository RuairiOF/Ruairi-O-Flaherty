import { useState, useMemo } from 'react'
import { Search, Filter } from 'lucide-react'
import { SEO } from '../components/SEO'
import { Section } from '../components/Section'
import { ProjectCard } from '../components/ProjectCard'
import { getAllProjects } from '../content/cv'
import { debounce } from '../lib/utils'

export function Projects() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const projects = getAllProjects()

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    projects.forEach(project => {
      project.tags.forEach(tag => {
        if (!tag.includes('[TODO')) {
          tags.add(tag)
        }
      })
    })
    return Array.from(tags).sort()
  }, [projects])

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

      // Tag filter
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => project.tags.includes(tag))

      return matchesSearch && matchesTags
    })
  }, [projects, searchTerm, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedTags([])
  }

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

            {/* Tag filters */}
            {allTags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="h-4 w-4 text-stone-500 dark:text-stone-400" />
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Filter by technology:
                  </span>
                  {selectedTags.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-teal-600 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-white/10 dark:text-stone-300 dark:hover:bg-white/20'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                : 'No projects match your current filters.'
              }
            </p>
            {(searchTerm || selectedTags.length > 0) && (
              <button
                onClick={clearFilters}
                className="btn btn-primary btn-md"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </Section>
    </>
  )
}
