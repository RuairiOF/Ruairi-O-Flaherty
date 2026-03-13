import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cvData } from '../content/cv'
import { isExternalUrl } from '../lib/utils'


export function Footer() {
  const currentYear = new Date().getFullYear()
  const buildTime = new Date().toISOString()

  const socialLinks = [
    {
      name: 'GitHub',
      url: cvData.person.links.github,
      icon: Github,
      key: 'github'
    },
    {
      name: 'LinkedIn',
      url: cvData.person.links.linkedin,
      icon: Linkedin,
      key: 'linkedin'
    },
    {
      name: 'Website',
      url: cvData.person.links.website,
      icon: ExternalLink,
      key: 'website'
    },
    {
      name: 'Email',
      url: `mailto:${cvData.person.email}`,
      icon: Mail,
      key: 'email'
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
    <footer className="bg-stone-100 dark:bg-black/20 border-t border-stone-200 dark:border-white/10">
      <div className="container py-12">
        <div className="flex flex-col items-center space-y-6">
          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center space-x-6">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.key}
                    href={link.url}
                    target={isExternalUrl(link.url || '') ? '_blank' : undefined}
                    rel={isExternalUrl(link.url || '') ? 'noopener noreferrer' : undefined}
                    className="text-stone-500 hover:text-teal-600 dark:text-stone-400 dark:hover:text-teal-400 transition-colors"
                    aria-label={link.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          )}

          <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {internalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-stone-600 hover:text-teal-600 dark:text-stone-300 dark:hover:text-teal-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <div className="text-center text-sm text-stone-500 dark:text-stone-400">
            <p>&copy; {currentYear} {cvData.person.name}. All rights reserved.</p>
            <p className="mt-1 text-xs">
              Last built: {new Date(buildTime).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
