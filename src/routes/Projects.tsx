import { useMemo } from 'react'
import { SEO } from '../components/SEO'
import BlurText from '../components/reactbits/BlurText'
import ProjectRow from '../components/projects/ProjectRow'
import Reveal from '../components/projects/Reveal'
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

      <section className="pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-40">
        <div className="shell-wide">
          <div className="max-w-3xl">
            <Reveal>
              <p className="eyebrow">Selected work</p>
            </Reveal>
            <BlurText
              as="h1"
              text="Projects"
              className="heading-1 mt-4 block text-ink"
              duration={0.8}
              stagger={0.06}
            />
            <Reveal delay={0.1}>
              <p className="prose mt-5 text-lg">
                Businesses I have built, hardware I have shipped and experiments that got out of
                hand — from logistics automation used by hundreds of Irish SMEs to a bedside sleep
                tracker running on a Raspberry Pi.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                {visibleProjects.length.toString().padStart(2, '0')} case studies
              </p>
            </Reveal>
          </div>

          {visibleProjects.length > 0 ? (
            <div className="mt-14 space-y-8 sm:space-y-12 lg:mt-20 lg:space-y-16">
              {visibleProjects.map((project, index) => (
                <ProjectRow
                  key={project.slug}
                  project={project}
                  index={index}
                  reversed={index % 2 === 1}
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel mt-14 rounded-2xl p-10 text-center">
              <p className="prose">No projects available yet.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
