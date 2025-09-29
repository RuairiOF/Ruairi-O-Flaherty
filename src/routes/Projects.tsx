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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => debouncedSetSearchTerm(e.target.value)}
              />
            </div>

            {/* Tag filters */}
            {allTags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filter by technology:
                  </span>
                  {selectedTags.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
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
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
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
          <p className="text-gray-600 dark:text-gray-400 text-center">
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
            <p className="text-gray-600 dark:text-gray-400 mb-4">
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


