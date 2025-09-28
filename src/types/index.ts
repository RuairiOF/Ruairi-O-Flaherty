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
}

export interface Project {
  slug: string
  title: string
  description: string
  tags: string[]
  repoUrl?: string
  liveUrl?: string
  image?: string
  featured?: boolean
  priority?: number
}

export interface SkillCategory {
  name: string
  items: string[]
}

export interface Skills {
  categories: SkillCategory[]
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
  url?: string
  type?: 'website' | 'article' | 'profile'
}

