import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import SmartImage from '../SmartImage'
import BlurText from '../reactbits/BlurText'
import ShinyText from '../reactbits/ShinyText'
import { isExternalUrl } from '../../lib/utils'
import type { Project } from '../../types'

export interface ProjectLink {
  key: string
  label: string
  url: string
  primary?: boolean
}

interface ProjectHeroProps {
  project: Project
  cover?: string
  logo?: string
  links: ProjectLink[]
}

/** Full-bleed cover, brand chip, blur-in title and a glass meta bar. */
export default function ProjectHero({ project, cover, logo, links }: ProjectHeroProps) {
  return (
    <header className="relative">
      <div className="relative h-[52vh] min-h-[20rem] w-full overflow-hidden sm:h-[60vh]">
        {cover ? (
          <SmartImage
            src={cover}
            alt={`${project.title} cover image`}
            priority
            sizes="100vw"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/25 via-bg to-accent-2/20">
            {logo && (
              <SmartImage
                src={logo}
                alt={`${project.title} logo`}
                priority
                sizes="320px"
                className="h-28 w-28 object-contain sm:h-40 sm:w-40"
              />
            )}
          </div>
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-transparent"
        />
      </div>

      <div className="relative z-10 -mt-28 sm:-mt-36">
        <div className="shell">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors duration-base hover:text-accent"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            All projects
          </Link>

          <div className="mt-5 flex items-center gap-3 sm:gap-4">
            {logo && cover && (
              <SmartImage
                src={logo}
                alt={`${project.title} logo`}
                sizes="80px"
                className="glass-panel h-12 w-12 shrink-0 rounded-xl object-contain p-1.5 sm:h-16 sm:w-16 sm:p-2"
              />
            )}
            <BlurText
              as="h1"
              text={project.title}
              className="heading-1 block text-ink"
              duration={0.8}
              stagger={0.06}
            />
          </div>

          <p className="prose mt-4 max-w-2xl text-base sm:text-lg">{project.description}</p>

          <div className="glass-panel mt-6 flex flex-wrap items-center gap-x-3 gap-y-3 rounded-2xl px-4 py-3 font-mono text-xs">
            <ul className="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-muted">
              {project.tags
                .filter((tag) => !tag.includes('[TODO'))
                .map((tag, i) => (
                  <li key={tag} className="flex items-center gap-2">
                    {i > 0 && (
                      <span aria-hidden="true" className="text-ink-muted/50">
                        ·
                      </span>
                    )}
                    <span className="uppercase tracking-wider">{tag}</span>
                  </li>
                ))}
            </ul>

            {links.length > 0 && (
              <>
                <span aria-hidden="true" className="hidden h-4 w-px bg-line/15 sm:block" />
                <div className="flex flex-wrap items-center gap-2">
                  {links.map((link) => (
                    <a
                      key={link.key}
                      href={link.url}
                      target={isExternalUrl(link.url) ? '_blank' : undefined}
                      rel={isExternalUrl(link.url) ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1 rounded-full border border-line/10 px-3 py-1.5 text-ink transition-colors duration-base hover:border-accent/40 hover:text-accent"
                    >
                      {link.primary ? <ShinyText>{link.label}</ShinyText> : link.label}
                      <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
