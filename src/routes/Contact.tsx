import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react'
import { SEO } from '../components/SEO'
import { Section } from '../components/Section'
import { cvData } from '../content/cv'
import { getStaticSeoPage } from '../content/seo-pages'
import { isExternalUrl } from '../lib/utils'

export function Contact() {
  const seo = getStaticSeoPage('/contact')

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: cvData.person.email,
      href: `mailto:${cvData.person.email}`,
      available: !cvData.person.email.includes('[TODO')
    },
    {
      icon: Phone,
      label: 'Phone',
      value: cvData.person.phone,
      href: `tel:${cvData.person.phone}`,
      available: cvData.person.phone && !cvData.person.phone.includes('[TODO')
    },
    {
      icon: MapPin,
      label: 'Location',
      value: cvData.person.location,
      href: null,
      available: cvData.person.location && !cvData.person.location.includes('[TODO')
    }
  ].filter(method => method.available)

  const socialLinks = [
    {
      name: 'GitHub',
      url: cvData.person.links.github,
      icon: Github,
      available: cvData.person.links.github && !cvData.person.links.github.includes('[TODO')
    },
    {
      name: 'LinkedIn',
      url: cvData.person.links.linkedin,
      icon: Linkedin,
      available: cvData.person.links.linkedin && !cvData.person.links.linkedin.includes('[TODO')
    },
    {
      name: 'Website',
      url: cvData.person.links.website,
      icon: ExternalLink,
      available: cvData.person.links.website && !cvData.person.links.website.includes('[TODO')
    }
  ].filter(link => link.available)

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
        title="Get In Touch"
        description="I'd love to hear from you. Send me a message and I'll respond as soon as possible."
        centered
        titleAs="h1"
      >
        <div className="max-w-2xl mx-auto">
          <div className="space-y-8">
              {/* Contact Methods */}
              <div className="card p-8">
                <h3 className="heading-3 mb-6 text-stone-900 dark:text-white">
                  Contact Information
                </h3>

                <div className="space-y-4">
                  {contactMethods.map((method, index) => {
                    const Icon = method.icon
                    const content = (
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-stone-900 dark:text-white">
                            {method.label}
                          </p>
                          <p className="text-stone-500 dark:text-stone-400">
                            {method.value}
                          </p>
                        </div>
                      </div>
                    )

                    return method.href ? (
                      <a
                        key={index}
                        href={method.href}
                        className="block p-3 rounded-lg hover:bg-stone-50 dark:hover:bg-white/10 transition-colors"
                      >
                        {content}
                      </a>
                    ) : (
                      <div key={index} className="p-3">
                        {content}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="card p-8">
                  <h3 className="heading-3 mb-6 text-stone-900 dark:text-white">
                    Connect Online
                  </h3>

                  <div className="space-y-4">
                    {socialLinks.map((link, index) => {
                      const Icon = link.icon
                      return (
                        <a
                          key={index}
                          href={link.url}
                          target={isExternalUrl(link.url || '') ? '_blank' : undefined}
                          rel={isExternalUrl(link.url || '') ? 'noopener noreferrer' : undefined}
                          className="flex items-center p-3 rounded-lg hover:bg-stone-50 dark:hover:bg-white/10 transition-colors group"
                        >
                          <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400 mr-3 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-stone-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                              {link.name}
                            </p>
                            <p className="text-stone-500 dark:text-stone-400 text-sm">
                              {link.url}
                            </p>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
          </div>
        </div>
      </Section>
    </>
  )
}
