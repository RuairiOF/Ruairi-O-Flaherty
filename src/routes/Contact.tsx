import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Github, Linkedin, ExternalLink } from 'lucide-react'
import { SEO } from '../components/SEO'
import { Section } from '../components/Section'
import { cvData } from '../content/cv'
import { isExternalUrl } from '../lib/utils'

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Fallback to mailto since we don't have a server
    const subject = encodeURIComponent(formData.subject || 'Contact from Portfolio')
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )
    
    window.location.href = `mailto:${cvData.person.email}?subject=${subject}&body=${body}`
  }

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
        title="Contact"
        description={`Get in touch with ${cvData.person.name}`}
      />

      <Section
        title="Get In Touch"
        description="I'd love to hear from you. Send me a message and I'll respond as soon as possible."
        centered
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card p-8">
              <h3 className="heading-3 mb-6 text-gray-900 dark:text-white">
                Send a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full group"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </button>
              </form>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Note:</strong> This form uses your default email client. 
                  If it doesn't work, please email me directly at{' '}
                  <a
                    href={`mailto:${cvData.person.email}`}
                    className="underline hover:no-underline"
                  >
                    {cvData.person.email}
                  </a>
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Methods */}
              <div className="card p-8">
                <h3 className="heading-3 mb-6 text-gray-900 dark:text-white">
                  Contact Information
                </h3>
                
                <div className="space-y-4">
                  {contactMethods.map((method, index) => {
                    const Icon = method.icon
                    const content = (
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {method.label}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {method.value}
                          </p>
                        </div>
                      </div>
                    )

                    return method.href ? (
                      <a
                        key={index}
                        href={method.href}
                        className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
                  <h3 className="heading-3 mb-6 text-gray-900 dark:text-white">
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
                          className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                        >
                          <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {link.name}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
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
        </div>
      </Section>
    </>
  )
}

