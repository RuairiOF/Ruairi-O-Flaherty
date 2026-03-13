import { useEffect, useMemo } from 'react'
import type { SEOProps } from '../types'
import { siteConfig } from '../content/cv'
import { buildRobotsContent, createMetaDescription, dedupeKeywords, toAbsoluteUrl } from '../lib/seo'
import type { JsonLdSchema } from '../lib/structuredData'

interface SEOComponentProps extends SEOProps {
  children?: React.ReactNode
}

export function SEO({
  title,
  description = siteConfig.description,
  keywords = siteConfig.keywords,
  image,
  imageAlt,
  url,
  type = 'website',
  noindex,
  nofollow,
  locale = 'en_IE',
  structuredData,
  publishedTime,
  modifiedTime,
}: SEOComponentProps) {
  const siteTitle = title ? `${title} | ${siteConfig.title}` : siteConfig.title
  const canonicalUrl = useMemo(() => {
    const routePath = typeof window !== 'undefined' ? window.location.pathname : '/'
    return toAbsoluteUrl(url || routePath, siteConfig.url)
  }, [url])
  const imageUrl = useMemo(
    () => toAbsoluteUrl(image || '/images/branding/Main_Logo.png', siteConfig.url),
    [image],
  )
  const metaDescription = useMemo(() => createMetaDescription(description), [description])
  const keywordList = useMemo(() => dedupeKeywords(keywords), [keywords])
  const robotsContent = useMemo(() => buildRobotsContent(noindex, nofollow), [noindex, nofollow])
  const structuredDataList = useMemo(() => {
    if (!structuredData) {
      return []
    }
    return Array.isArray(structuredData) ? structuredData : [structuredData]
  }, [structuredData])

  useEffect(() => {
    document.title = siteTitle
    document.documentElement.lang = 'en'

    const updateMetaByName = (name: string, content: string) => {
      const selector = `meta[name="${name}"]`
      let meta = document.querySelector(selector) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    const updateMetaByProperty = (property: string, content: string) => {
      const selector = `meta[property="${property}"]`
      let meta = document.querySelector(selector) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    const updateLinkTag = (rel: string, href: string, attributes: Record<string, string> = {}) => {
      const attributeSelector = Object.entries(attributes)
        .map(([key, value]) => `[${key}="${value}"]`)
        .join('')
      const selector = `link[rel="${rel}"]${attributeSelector}`
      let link = document.querySelector(selector) as HTMLLinkElement
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', rel)
        Object.entries(attributes).forEach(([key, value]) => {
          link.setAttribute(key, value)
        })
        document.head.appendChild(link)
      }
      link.setAttribute('href', href)
    }

    const updateOrRemoveMetaByProperty = (property: string, content?: string) => {
      const selector = `meta[property="${property}"]`
      const existing = document.querySelector(selector) as HTMLMetaElement | null
      if (!content) {
        existing?.remove()
        return
      }
      updateMetaByProperty(property, content)
    }

    updateMetaByName('description', metaDescription)
    updateMetaByName('keywords', keywordList.join(', '))
    updateMetaByName('author', siteConfig.author)
    updateMetaByName('robots', robotsContent)
    updateMetaByName('googlebot', robotsContent)
    updateMetaByName('referrer', 'strict-origin-when-cross-origin')
    updateMetaByName('twitter:card', 'summary_large_image')
    updateMetaByName('twitter:title', siteTitle)
    updateMetaByName('twitter:description', metaDescription)
    updateMetaByName('twitter:image', imageUrl)
    updateMetaByName('twitter:url', canonicalUrl)
    if (siteConfig.twitterHandle) {
      updateMetaByName('twitter:site', siteConfig.twitterHandle)
      updateMetaByName('twitter:creator', siteConfig.twitterHandle)
    }

    updateMetaByProperty('og:type', type)
    updateMetaByProperty('og:title', siteTitle)
    updateMetaByProperty('og:description', metaDescription)
    updateMetaByProperty('og:url', canonicalUrl)
    updateMetaByProperty('og:image', imageUrl)
    updateMetaByProperty('og:image:secure_url', imageUrl)
    updateMetaByProperty('og:image:alt', imageAlt || siteTitle)
    updateMetaByProperty('og:site_name', siteConfig.title)
    updateMetaByProperty('og:locale', locale)

    updateOrRemoveMetaByProperty('article:published_time', type === 'article' ? publishedTime : undefined)
    updateOrRemoveMetaByProperty('article:modified_time', type === 'article' ? modifiedTime : undefined)

    updateLinkTag('canonical', canonicalUrl)
    updateLinkTag('alternate', canonicalUrl, { hreflang: 'en-IE' })
    updateLinkTag('alternate', toAbsoluteUrl('/', siteConfig.url), { hreflang: 'x-default' })

    const existingJsonLd = document.querySelectorAll('script[data-seo-jsonld="true"]')
    existingJsonLd.forEach((script) => script.remove())

    structuredDataList.forEach((schema, index) => {
      if (!schema || typeof schema !== 'object') {
        return
      }
      const jsonLdScript = document.createElement('script')
      jsonLdScript.type = 'application/ld+json'
      jsonLdScript.setAttribute('data-seo-jsonld', 'true')
      jsonLdScript.setAttribute('data-seo-jsonld-index', String(index))
      jsonLdScript.textContent = JSON.stringify(schema as JsonLdSchema)
      document.head.appendChild(jsonLdScript)
    })

    if (noindex) {
      updateMetaByName('prerender-status-code', '404')
    } else {
      const prerenderStatus = document.querySelector(
        'meta[name="prerender-status-code"]',
      ) as HTMLMetaElement | null
      prerenderStatus?.remove()
    }
  }, [
    canonicalUrl,
    imageAlt,
    imageUrl,
    keywordList,
    locale,
    metaDescription,
    modifiedTime,
    noindex,
    publishedTime,
    robotsContent,
    siteTitle,
    structuredDataList,
    type,
  ])

  return null
}
