export interface Person {
  name: string
  headline: string
  location?: string
  email: string
  phone?: string
  links: {
    github?: string
    linkedin?: string
    website?: string
    twitter?: string
  }
}

export interface Education {
  institution: string
  degree: string
  dates: string
  details?: string
  gpa?: string
  location?: string
}

export interface Experience {
  company: string
  role: string
  dates: string
  location?: string
  bullets: string[]
  technologies?: string[]
  links?: {
    patch?: string
    website?: string
    linkedin?: string
  }
}

export interface Project {
  slug: string
  title: string
  description: string
  longDescription?: string
  highlights?: string[]
  gallery?: string[]
  tags: string[]
  repoUrl?: string
  liveUrl?: string
  image?: string
  imagePosition?: string
  featured?: boolean
  priority?: number
  links?: {
    website?: string
    github?: string
    patch?: string
    tiktok?: string
    linkedin?: string
  }
}

export interface SkillShowcase {
  title: string
  description: string
  images: string[]
  tools: string[]
  imagePosition?: string
}

export interface Skills {
  showcases: SkillShowcase[]
}

export interface Award {
  title: string
  issuer: string
  date: string
  description?: string
}

export interface Certificate {
  title: string
  issuer: string
  date: string
  credentialId?: string
  credentialUrl?: string
}

export interface CVData {
  person: Person
  education: Education[]
  experience: Experience[]
  projects: Project[]
  skills: Skills
  awards?: Award[]
  certificates?: Certificate[]
}

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  imageAlt?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  noindex?: boolean
  nofollow?: boolean
  locale?: string
  structuredData?: Record<string, unknown> | Record<string, unknown>[]
  publishedTime?: string
  modifiedTime?: string
}
