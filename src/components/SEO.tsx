import { useEffect } from 'react'
import type { SEOProps } from '../types'
import { siteConfig } from '../content/cv'

interface SEOComponentProps extends SEOProps {
  children?: React.ReactNode
}

export function SEO({
  title,
  description = siteConfig.description,
  keywords = siteConfig.keywords,
  image,
  url,
  type = 'website',
}: SEOComponentProps) {
  const siteTitle = title ? `${title} | ${siteConfig.title}` : siteConfig.title
  const siteUrl = url || siteConfig.url
  const imageUrl = image ? `${siteConfig.url}${image}` : `${siteConfig.url}/og-image.png`

  useEffect(() => {
    // Update document title
    document.title = siteTitle

    // Update meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let meta = document.querySelector(selector) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        if (isProperty) {
          meta.setAttribute('property', name)
        } else {
          meta.setAttribute('name', name)
        }
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // Basic meta tags
    updateMeta('description', description)
    updateMeta('keywords', keywords.join(', '))
    updateMeta('author', siteConfig.author)

    // Open Graph
    updateMeta('og:type', type, true)
    updateMeta('og:title', siteTitle, true)
    updateMeta('og:description', description, true)
    updateMeta('og:url', siteUrl, true)
    updateMeta('og:image', imageUrl, true)
    updateMeta('og:site_name', siteConfig.title, true)

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image')
    updateMeta('twitter:title', siteTitle)
    updateMeta('twitter:description', description)
    updateMeta('twitter:image', imageUrl)

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', siteUrl)
  }, [siteTitle, description, keywords, siteUrl, imageUrl, type])

  return null
}
