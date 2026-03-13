import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Github, Globe } from 'lucide-react'
import { SEO } from '../components/SEO'
import { Section } from '../components/Section'
import { getAllProjects, siteConfig } from '../content/cv'
import { getProjectSeoPage, getStaticSeoPage } from '../content/seo-pages'
import { isExternalUrl } from '../lib/utils'

interface ProjectImageViewerProps {
  images: string[]
  title: string
}

function ProjectImageViewer({ images, title }: ProjectImageViewerProps) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-white/5 p-6 text-center text-stone-500 dark:text-stone-400">
        No images added for this project yet.
      </div>
    )
  }

  return (
    <div className="relative w-full h-[60vh] rounded-2xl overflow-hidden bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/10">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`${title} ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          loading="lazy"
          decoding="async"
        />
      ))}

      {images.length > 1 && (
        <>
          <button
            onClick={() => setActive((active - 1 + images.length) % images.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActive((active + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all ${
                  i === active ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70 w-2'
                }`}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = getAllProjects().find((item) => item.slug === slug && !item.title.includes('[TODO'))
  const missingProjectSeo = getStaticSeoPage('/404')

  if (!project) {
    return (
      <>
        <SEO
          title={missingProjectSeo?.title || 'Project Not Found'}
          description="The requested project could not be found."
          noindex
          nofollow
        />
        <Section className="pt-8 lg:pt-16">
          <div className="max-w-3xl mx-auto text-center rounded-3xl border border-stone-200 dark:border-white/10 bg-white dark:bg-white/5 p-8">
            <h1 className="heading-3 text-stone-900 dark:text-white">Project not found</h1>
            <p className="prose mt-3">This project either does not exist or has been removed.</p>
            <Link
              to="/projects"
              className="inline-flex items-center mt-6 text-teal-600 dark:text-teal-400 hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to projects
            </Link>
          </div>
        </Section>
      </>
    )
  }

  const galleryImages = [...(project.gallery || [])]
    .filter((img) => img && !img.includes('[TODO'))

  if (galleryImages.length === 0 && project.image && !project.image.includes('[TODO')) {
    galleryImages.push(project.image)
  }

  const rawLinks = [
    { key: 'live', label: 'Live Project', url: project.liveUrl, icon: ExternalLink },
    { key: 'repo', label: 'Source Code', url: project.repoUrl, icon: Github },
    { key: 'website', label: 'Website', url: project.links?.website, icon: Globe },
    { key: 'github', label: 'GitHub', url: project.links?.github, icon: Github },
    { key: 'tiktok', label: 'TikTok', url: project.links?.tiktok, icon: ExternalLink },
    { key: 'linkedin', label: 'LinkedIn', url: project.links?.linkedin, icon: ExternalLink },
  ]

  const seenUrls = new Set<string>()
  const links = rawLinks.filter((item) => {
    if (!item.url || item.url.includes('[TODO')) return false
    if (seenUrls.has(item.url)) return false
    seenUrls.add(item.url)
    return true
  })

  const description = project.longDescription || project.description
  const seo = getProjectSeoPage(project.slug)

  return (
    <>
      <SEO
        title={seo?.title || project.title}
        description={seo?.description || description}
        keywords={seo?.keywords}
        image={seo?.image || project.image}
        imageAlt={seo?.imageAlt || `${project.title} project image`}
        url={seo?.path || `${siteConfig.url}/projects/${project.slug}`}
        type={seo?.type || 'article'}
        structuredData={seo?.structuredData}
      />

      <Section className="pt-8 lg:pt-16">
        <div className="max-w-6xl mx-auto space-y-8">
          <Link
            to="/projects"
            className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to projects
          </Link>

          <article className="rounded-3xl border border-stone-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                {project.image && (
                  <img
                    src={project.image}
                    alt={`${project.title} logo`}
                    className="h-14 w-14 object-contain rounded-xl bg-white dark:bg-white/10 border border-stone-200/60 dark:border-white/10 p-1"
                    loading="eager"
                    decoding="async"
                  />
                )}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-stone-900 dark:text-white">
                    {project.title}
                  </h1>
                  <p className="prose mt-3 text-stone-600 dark:text-stone-400">
                    {project.description}
                  </p>
                </div>
              </div>

              {links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {links.map((item) => {
                    const Icon = item.icon
                    return (
                      <a
                        key={item.key}
                        href={item.url}
                        target={isExternalUrl(item.url || '') ? '_blank' : undefined}
                        rel={isExternalUrl(item.url || '') ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-white/10 dark:text-stone-300 dark:hover:bg-white/20 transition-colors"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>

            {project.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          <div className="rounded-3xl border border-stone-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 lg:p-8">
            <h2 className="heading-4 text-stone-900 dark:text-white mb-3">Overview</h2>
            <p className="prose whitespace-pre-line">{description}</p>

            {project.highlights && project.highlights.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-3">Highlights</h3>
                <ul className="space-y-2">
                  {project.highlights.map((item) => (
                    <li key={item} className="text-stone-600 dark:text-stone-300 flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-stone-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 lg:p-8">
            <h2 className="heading-4 text-stone-900 dark:text-white mb-4">Project Gallery</h2>
            <ProjectImageViewer images={galleryImages} title={project.title} />
          </div>
        </div>
      </Section>
    </>
  )
}
