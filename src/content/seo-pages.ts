import { cvData, getAllProjects, siteConfig } from './cv'
import { galleryPhotos } from './photos'
import { createMetaDescription, dedupeKeywords, toAbsoluteUrl } from '../lib/seo'
import {
  buildBreadcrumbSchema,
  buildContactPageSchema,
  buildImageCollectionSchema,
  buildPersonSchema,
  buildProjectSchema,
  buildProjectsItemListSchema,
  buildSkillsItemListSchema,
  buildWebPageSchema,
  buildWebSiteSchema,
  type JsonLdSchema,
} from '../lib/structuredData'
import type { Project, SEOProps } from '../types'

export type SitemapChangeFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface SeoPageConfig extends SEOProps {
  path: string
  priority: number
  changefreq: SitemapChangeFrequency
  includeInSitemap?: boolean
  structuredData?: JsonLdSchema[]
}

const indexableProjects = getAllProjects().filter(
  (project) => !project.title.includes('[TODO') && !project.slug.includes('[TODO'),
)

const allSkillTags = Array.from(
  new Set(cvData.skills.showcases.flatMap((showcase) => showcase.tools)),
).sort()

const commonKeywords = siteConfig.keywords

const createKeywords = (keywords: string[]): string[] =>
  dedupeKeywords([...commonKeywords, ...keywords])

export const staticSeoPages: SeoPageConfig[] = [
  {
    path: '/',
    title: '',
    description: createMetaDescription(
      `${cvData.person.name} is a Mechanical Engineering student and entrepreneur building products, startups, and logistics systems in Dublin, Ireland.`,
    ),
    keywords: createKeywords([
      cvData.person.name,
      'engineering portfolio',
      'student entrepreneur',
      'startup founder',
      'dublin engineer',
    ]),
    image: '/images/branding/ruairipfp.webp',
    imageAlt: `${cvData.person.name} profile photo`,
    type: 'profile',
    priority: 1,
    changefreq: 'weekly',
    structuredData: [
      buildPersonSchema(),
      buildWebSiteSchema(),
      buildWebPageSchema({
        path: '/',
        title: `${cvData.person.name} | Engineering and Startup Portfolio`,
        description: siteConfig.description,
        image: '/images/branding/ruairipfp.webp',
        pageType: 'ProfilePage',
      }),
      buildBreadcrumbSchema([{ name: 'Home', path: '/' }]),
    ],
  },
  {
    path: '/projects',
    title: 'Projects',
    description: createMetaDescription(
      `Explore projects by ${cvData.person.name}, including EirPost, LaserLane, manufacturing ventures, hardware prototypes, and software builds.`,
    ),
    keywords: createKeywords([
      'portfolio projects',
      'engineering projects',
      'startup projects',
      'hardware projects',
      'software projects',
    ]),
    type: 'website',
    priority: 0.9,
    changefreq: 'weekly',
    structuredData: [
      buildWebPageSchema({
        path: '/projects',
        title: `Projects | ${cvData.person.name}`,
        description: `Projects built by ${cvData.person.name}`,
        pageType: 'CollectionPage',
      }),
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
      ]),
      buildProjectsItemListSchema(indexableProjects),
    ],
  },
  {
    path: '/experience',
    title: 'Experience',
    description: createMetaDescription(
      `${cvData.person.name}'s work experience, education, and achievements across engineering, logistics, startups, and operations.`,
    ),
    keywords: createKeywords([
      'work experience',
      'engineering experience',
      'startup experience',
      'education background',
      'mechanical engineering student',
    ]),
    type: 'website',
    priority: 0.8,
    changefreq: 'monthly',
    structuredData: [
      buildWebPageSchema({
        path: '/experience',
        title: `Experience | ${cvData.person.name}`,
        description: `${cvData.person.name}'s professional and academic experience.`,
      }),
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Experience', path: '/experience' },
      ]),
      buildPersonSchema(),
    ],
  },
  {
    path: '/skills',
    title: 'Skills',
    description: createMetaDescription(
      `${cvData.person.name}'s practical skills across CAD, manufacturing, software, paid media, cloud, AI automation, and business operations.`,
    ),
    keywords: createKeywords([
      'engineering skills',
      'software skills',
      'manufacturing skills',
      'cad skills',
      'ai automation',
    ]),
    type: 'website',
    priority: 0.8,
    changefreq: 'monthly',
    structuredData: [
      buildWebPageSchema({
        path: '/skills',
        title: `Skills | ${cvData.person.name}`,
        description: `${cvData.person.name}'s core skills and tools.`,
        pageType: 'CollectionPage',
      }),
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Skills', path: '/skills' },
      ]),
      buildSkillsItemListSchema(allSkillTags),
    ],
  },
  {
    path: '/photos',
    title: '3D Printing Gallery',
    description: createMetaDescription(
      `A visual gallery of products, prototypes, and manufacturing output from ${cvData.person.name}'s 3D printing portfolio.`,
    ),
    keywords: createKeywords([
      '3d printing gallery',
      'manufacturing portfolio',
      'prototype gallery',
      'product design gallery',
    ]),
    type: 'website',
    priority: 0.7,
    changefreq: 'monthly',
    structuredData: [
      buildWebPageSchema({
        path: '/photos',
        title: `3D Printing Gallery | ${cvData.person.name}`,
        description: `3D printing and manufacturing gallery for ${cvData.person.name}.`,
        pageType: 'CollectionPage',
      }),
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: '3D Printing Gallery', path: '/photos' },
      ]),
      buildImageCollectionSchema(
        '3D Printing Gallery',
        galleryPhotos.map((photo) => photo.src),
      ),
    ],
  },
  {
    path: '/contact',
    title: 'Contact',
    description: createMetaDescription(
      `Contact ${cvData.person.name} for collaborations, startup opportunities, consulting, and project inquiries.`,
    ),
    keywords: createKeywords([
      'contact',
      'hire',
      'collaboration',
      'startup consulting',
      'engineering collaboration',
    ]),
    type: 'website',
    priority: 0.7,
    changefreq: 'monthly',
    structuredData: [
      buildWebPageSchema({
        path: '/contact',
        title: `Contact | ${cvData.person.name}`,
        description: `Contact details and inquiry options for ${cvData.person.name}.`,
        pageType: 'ContactPage',
      }),
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' },
      ]),
      buildContactPageSchema('/contact'),
    ],
  },
  {
    path: '/404',
    title: 'Page Not Found',
    description: 'The page you are looking for could not be found.',
    noindex: true,
    nofollow: true,
    includeInSitemap: false,
    priority: 0.1,
    changefreq: 'yearly',
  },
]

function buildProjectSeoPage(project: Project): SeoPageConfig {
  const description = createMetaDescription(project.longDescription || project.description)
  const title = project.title

  return {
    path: `/projects/${project.slug}`,
    title,
    description,
    keywords: createKeywords([
      ...project.tags,
      project.title,
      'project case study',
      'portfolio project',
    ]),
    image: project.image,
    imageAlt: `${project.title} project image`,
    url: toAbsoluteUrl(`/projects/${project.slug}`, siteConfig.url),
    type: 'article',
    priority: 0.75,
    changefreq: 'monthly',
    structuredData: [
      buildWebPageSchema({
        path: `/projects/${project.slug}`,
        title: `${project.title} | ${cvData.person.name}`,
        description,
        image: project.image,
      }),
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
        { name: project.title, path: `/projects/${project.slug}` },
      ]),
      buildProjectSchema(project),
    ],
  }
}

export const projectSeoPages: SeoPageConfig[] = indexableProjects.map((project) =>
  buildProjectSeoPage(project),
)

export function getStaticSeoPage(path: string): SeoPageConfig | undefined {
  return staticSeoPages.find((page) => page.path === path)
}

export function getProjectSeoPage(slug: string): SeoPageConfig | undefined {
  return projectSeoPages.find((page) => page.path === `/projects/${slug}`)
}

export function getAllIndexableSeoPages(): SeoPageConfig[] {
  return [...staticSeoPages.filter((page) => page.includeInSitemap !== false), ...projectSeoPages]
}
