import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { SEO } from '../components/SEO'
import Lightbox from '../components/Lightbox'
import CarrierStrip from '../components/projects/CarrierStrip'
import MetricsStrip from '../components/projects/MetricsStrip'
import ProjectGallery, { type GalleryTile } from '../components/projects/ProjectGallery'
import ProjectHero, { type ProjectLink } from '../components/projects/ProjectHero'
import ProjectNav from '../components/projects/ProjectNav'
import ProjectStory from '../components/projects/ProjectStory'
import ProjectVideo from '../components/projects/ProjectVideo'
import Reveal from '../components/projects/Reveal'
import { getProjectMedia } from '../components/projects/media'
import { getAllProjects, siteConfig } from '../content/cv'
import { getProjectSeoPage, getStaticSeoPage } from '../content/seo-pages'

/** Gallery size at which the story column earns interleaved imagery. */
const RICH_GALLERY = 6

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const projects = getAllProjects().filter((item) => !item.title.includes('[TODO'))
  const position = projects.findIndex((item) => item.slug === slug)
  const project = position >= 0 ? projects[position] : undefined
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
        <section className="pb-16 pt-32 lg:pb-24 lg:pt-40">
          <div className="shell">
            <div className="glass-panel mx-auto max-w-2xl rounded-2xl p-8 text-center sm:p-10">
              <p className="eyebrow">404</p>
              <h1 className="heading-3 mt-3 text-ink">Project not found</h1>
              <p className="prose mt-3">
                This project either does not exist or has been removed.
              </p>
              <Link to="/projects" className="btn btn-secondary btn-md mt-7">
                <ArrowLeft aria-hidden="true" className="mr-2 h-4 w-4" />
                Back to projects
              </Link>
            </div>
          </div>
        </section>
      </>
    )
  }

  const media = getProjectMedia(project)

  const rawLinks: ProjectLink[] = [
    { key: 'live', label: 'View live', url: project.liveUrl || '', primary: true },
    { key: 'website', label: 'Website', url: project.links?.website || '' },
    { key: 'repo', label: 'Source', url: project.repoUrl || '' },
    { key: 'github', label: 'GitHub', url: project.links?.github || '' },
    { key: 'patch', label: 'Patch', url: project.links?.patch || '' },
    { key: 'tiktok', label: 'TikTok', url: project.links?.tiktok || '' },
    { key: 'linkedin', label: 'LinkedIn', url: project.links?.linkedin || '' },
  ]

  const seenUrls = new Set<string>()
  const links = rawLinks.filter((item) => {
    if (!item.url || item.url.includes('[TODO')) return false
    if (seenUrls.has(item.url)) return false
    seenUrls.add(item.url)
    return true
  })

  const description = project.longDescription || project.description
  const paragraphs = (project.longDescription || '')
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)

  const tiles: GalleryTile[] = media.images.map((src, index) => ({ src, index }))
  const remaining = tiles.filter((tile) => tile.index !== media.coverIndex)
  // Only pull images into the story column when both the gallery and the copy
  // are long enough to carry them — otherwise they'd vanish from the page.
  const inlineCount =
    media.images.length >= RICH_GALLERY ? Math.min(2, Math.max(0, paragraphs.length - 2)) : 0
  const inlineTiles = remaining.slice(0, inlineCount)
  const gridTiles = remaining.slice(inlineCount)

  const lightboxItems = media.images.map((src, index) => ({
    src,
    alt: `${project.title} — image ${index + 1}`,
    caption: project.title,
  }))

  const previous = projects[(position - 1 + projects.length) % projects.length]
  const next = projects[(position + 1) % projects.length]

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

      <article>
        <ProjectHero project={project} cover={media.cover} logo={media.logo} links={links} />

        <div className="space-y-16 pb-16 pt-14 lg:space-y-24 lg:pb-24 lg:pt-20">
          {project.highlights && project.highlights.length > 0 && (
            <section className="shell">
              <MetricsStrip highlights={project.highlights} />
            </section>
          )}

          {project.slug === 'eirpost' && (
            <section className="shell">
              <Reveal>
                <CarrierStrip />
              </Reveal>
            </section>
          )}

          <section className="shell">
            <ProjectStory
              title={project.title}
              about={project.about}
              paragraphs={paragraphs}
              inline={inlineTiles}
              onOpen={setLightboxIndex}
              linkRofs={project.slug !== 'rofs-3d'}
            />
          </section>

          {media.videos.length > 0 && (
            <section className="shell">
              <Reveal>
                <div className="flex items-end justify-between gap-4">
                  <h2 className="heading-3 text-ink">In production</h2>
                  <span className="eyebrow">Video</span>
                </div>
              </Reveal>
              <div className="mt-6 space-y-6">
                {media.videos.map((video) => (
                  <ProjectVideo
                    key={video}
                    src={video}
                    title={project.title}
                    poster={media.cover}
                    caption={`${project.title} — production footage`}
                  />
                ))}
              </div>
            </section>
          )}

          {gridTiles.length > 0 && (
            <section className="shell">
              <Reveal>
                <div className="flex items-end justify-between gap-4">
                  <h2 className="heading-3 text-ink">Gallery</h2>
                  <span className="font-mono text-xs text-ink-muted">
                    {media.images.length.toString().padStart(2, '0')} images
                  </span>
                </div>
              </Reveal>
              <div className="mt-6">
                <ProjectGallery
                  tiles={gridTiles}
                  title={project.title}
                  onOpen={setLightboxIndex}
                />
              </div>
            </section>
          )}

          {projects.length > 1 && (
            <section className="shell">
              <ProjectNav previous={previous} next={next} />
            </section>
          )}
        </div>
      </article>

      <Lightbox
        items={lightboxItems}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  )
}
