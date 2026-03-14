import type { Project } from '../types'
import { cvData, siteConfig } from '../content/cv'
import { createMetaDescription, toAbsoluteUrl } from './seo'

export type JsonLdSchema = Record<string, unknown>

export interface BreadcrumbItem {
  name: string
  path: string
}

export interface WebPageSchemaOptions {
  path: string
  title: string
  description: string
  image?: string
  pageType?: 'WebPage' | 'CollectionPage' | 'ContactPage' | 'ProfilePage'
}

const PERSON_ID = `${siteConfig.url}#person`
const WEBSITE_ID = `${siteConfig.url}#website`

function pruneUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => {
      if (item === null || item === undefined) {
        return false
      }
      if (Array.isArray(item) && item.length === 0) {
        return false
      }
      return true
    }),
  ) as T
}

function toPublicAbsolute(pathOrUrl?: string): string | undefined {
  if (!pathOrUrl) {
    return undefined
  }
  return toAbsoluteUrl(pathOrUrl, siteConfig.url)
}

function getSocialProfiles(): string[] {
  const links = Object.values(cvData.person.links).filter(
    (value): value is string => Boolean(value && value.startsWith('http')),
  )
  return Array.from(new Set(links))
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path, siteConfig.url),
    })),
  }
}

export function buildPersonSchema(): JsonLdSchema {
  const alumniOf = cvData.education.map((entry) => ({
    '@type': 'EducationalOrganization',
    name: entry.institution,
  }))

  return pruneUndefined({
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: cvData.person.name,
    url: siteConfig.url,
    jobTitle: cvData.person.headline,
    address: cvData.person.location
      ? {
          '@type': 'PostalAddress',
          addressLocality: cvData.person.location,
          addressCountry: 'IE',
        }
      : undefined,
    email: cvData.person.email ? `mailto:${cvData.person.email}` : undefined,
    telephone: cvData.person.phone,
    image: toPublicAbsolute('/images/branding/ruairipfp.webp'),
    sameAs: getSocialProfiles(),
    alumniOf,
  })
}

export function buildWebSiteSchema(): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.title,
    description: createMetaDescription(siteConfig.description),
    inLanguage: 'en-IE',
    author: {
      '@id': PERSON_ID,
    },
    publisher: {
      '@id': PERSON_ID,
    },
  }
}

export function buildWebPageSchema({
  path,
  title,
  description,
  image,
  pageType = 'WebPage',
}: WebPageSchemaOptions): JsonLdSchema {
  const absoluteUrl = toAbsoluteUrl(path, siteConfig.url)

  return pruneUndefined({
    '@context': 'https://schema.org',
    '@type': pageType,
    '@id': `${absoluteUrl}#webpage`,
    url: absoluteUrl,
    name: title,
    description: createMetaDescription(description),
    inLanguage: 'en-IE',
    image: toPublicAbsolute(image),
    isPartOf: {
      '@id': WEBSITE_ID,
    },
    about: {
      '@id': PERSON_ID,
    },
  })
}

export function buildProjectsItemListSchema(projects: Project[]): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Projects',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: project.title,
      url: toAbsoluteUrl(`/projects/${project.slug}`, siteConfig.url),
    })),
  }
}

export function buildProjectSchema(project: Project): JsonLdSchema {
  const projectUrl = toAbsoluteUrl(`/projects/${project.slug}`, siteConfig.url)
  const relatedLinks = Array.from(
    new Set(
      [project.liveUrl, project.repoUrl, ...Object.values(project.links || {})].filter(
        (value): value is string => Boolean(value && value.startsWith('http')),
      ),
    ),
  )

  return pruneUndefined({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${projectUrl}#creativework`,
    name: project.title,
    headline: project.title,
    description: createMetaDescription(project.longDescription || project.description, 220),
    url: projectUrl,
    image: toPublicAbsolute(project.image),
    keywords: project.tags.join(', '),
    genre: project.tags,
    inLanguage: 'en-IE',
    creator: {
      '@id': PERSON_ID,
    },
    author: {
      '@id': PERSON_ID,
    },
    mainEntityOfPage: {
      '@id': `${projectUrl}#webpage`,
    },
    sameAs: relatedLinks,
  })
}

export function buildSkillsItemListSchema(skills: string[]): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Skills and Tools',
    numberOfItems: skills.length,
    itemListElement: skills.map((skill, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: skill,
    })),
  }
}

export function buildContactPageSchema(path: string): JsonLdSchema {
  const absoluteUrl = toAbsoluteUrl(path, siteConfig.url)

  return pruneUndefined({
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${absoluteUrl}#contact`,
    url: absoluteUrl,
    name: 'Contact',
    description: createMetaDescription(`Contact ${cvData.person.name}`),
    inLanguage: 'en-IE',
    mainEntity: {
      '@id': PERSON_ID,
    },
  })
}

export function buildImageCollectionSchema(title: string, images: string[]): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: title,
    isPartOf: {
      '@id': WEBSITE_ID,
    },
    associatedMedia: images.map((image) => ({
      '@type': 'ImageObject',
      contentUrl: toAbsoluteUrl(image, siteConfig.url),
    })),
  }
}
