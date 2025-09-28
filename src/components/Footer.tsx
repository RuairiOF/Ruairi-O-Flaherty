import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react'
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

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
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
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    aria-label={link.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          )}

          {/* Copyright */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© {currentYear} {cvData.person.name}. All rights reserved.</p>
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
