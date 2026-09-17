import { ExternalLink, Github, Linkedin, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import Magnet from './reactbits/Magnet'
import { cvData } from '../content/cv'
import { isExternalUrl } from '../lib/utils'

const buildDate = new Date(__BUILD_DATE__).toLocaleDateString('en-IE', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'GitHub',
      url: cvData.person.links.github,
      icon: Github,
      key: 'github',
    },
    {
      name: 'LinkedIn',
      url: cvData.person.links.linkedin,
      icon: Linkedin,
      key: 'linkedin',
    },
    {
      name: 'Website',
      url: cvData.person.links.website,
      icon: ExternalLink,
      key: 'website',
    },
    {
      name: 'Email',
      url: `mailto:${cvData.person.email}`,
      icon: Mail,
      key: 'email',
    },
  ].filter(link => link.url && !link.url.includes('[TODO'))

  const internalLinks = [
    { label: 'Home', to: '/' },
    { label: 'Projects', to: '/projects' },
    { label: 'Experience', to: '/experience' },
    { label: 'Skills', to: '/skills' },
    { label: 'Photos', to: '/photos' },
    { label: 'Contact', to: '/contact' },
  ]

  return (
    <footer className="mt-24 border-t border-line/10 bg-surface/30 backdrop-blur-sm">
      <div className="shell py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <div>
            <p className="eyebrow">Get in touch</p>
            <p className="heading-3 mt-3 text-ink">
              Say <span className="gradient-text">hello.</span>
            </p>
            <p className="prose mt-3 max-w-sm text-sm">
              {cvData.person.headline} — {cvData.person.location}
            </p>

            {socialLinks.length > 0 && (
              <div className="mt-6 flex items-center gap-4">
                {socialLinks.map(link => {
                  const Icon = link.icon
                  const external = isExternalUrl(link.url || '')
                  return (
                    <Magnet key={link.key} padding={12} magnetStrength={0.4}>
                      <a
                        href={link.url}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        aria-label={link.name}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-line/10 bg-line/5 text-ink-muted transition-colors duration-base ease-out-expo hover:border-accent/40 hover:text-accent"
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </Magnet>
                  )
                })}
              </div>
            )}
          </div>

          <nav aria-label="Footer navigation">
            <p className="eyebrow">Sitemap</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
              {internalLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-ink-muted transition-colors duration-fast hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-line/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-ink-muted">
            &copy; {currentYear} {cvData.person.name}. All rights reserved.
          </p>
          <p className="font-mono text-xs text-ink-muted/80">
            Last built {buildDate}
          </p>
        </div>
      </div>
    </footer>
  )
}
