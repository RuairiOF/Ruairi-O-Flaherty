import type { CVData } from '../types'

export const cvData: CVData = {
  person: {
    name: "Ruairi O'Flaherty",
    headline: 'Mechanical Engineering Student & Entrepreneur',
    location: 'Dublin, Ireland',
    email: 'ruairioflaherty1@gmail.com',
    phone: '+353 89 406 7369',
    links: {
      linkedin: 'https://linkedin.com/in/ruairi-oflaherty',
      website: 'https://eirpost.ie',
    }
  },
  
  education: [
    {
      institution: 'University College Dublin',
      degree: 'Mechanical Engineering (BEng)',
      dates: '2023 - Present',
      location: 'Dublin, Ireland',
      details: 'UCD Entrance Scholar • 589 Points: H1 Physics, H1 DCG, H1 Computer Science, H2 Maths, H2 Applied Maths, H2 English'
    }
  ],
  
  experience: [
    {
      company: 'Patch at DogPatch Labs',
      role: 'Software/Startup Fellow',
      dates: 'Summer 2025',
      location: 'Dublin, Ireland',
      bullets: [
        'Selected for competitive accelerator program; collaborated with peers and mentors to build and deliver Cashew, a demo-ready startup product',
        'Conducted user testing, managed the product backlog, and pitched outcomes to mentors and investors'
      ],
      technologies: ['Product Management', 'User Testing', 'Startup Development']
    },
    {
      company: 'Walls Construction Ltd.',
      role: 'Site Engineer',
      dates: 'Summer 2024',
      location: 'Ireland',
      bullets: [
        'Supported surveying, quality assurance, and safety compliance on-site',
        'Produced weekly progress and safety reports, coordinating subcontractors to close defects'
      ],
      technologies: ['Surveying', 'Quality Assurance', 'Safety Compliance']
    },
    {
      company: 'CareChoice',
      role: 'Catering Assistant',
      dates: 'Summer 2023',
      location: 'Ireland',
      bullets: [
        'Completed training in safeguarding, food hygiene, and manual handling',
        'Delivered professional service supporting vulnerable residents and staff'
      ],
      technologies: ['Food Safety', 'Care Services']
    },
    {
      company: 'Institute of Education',
      role: 'Exam Invigilator',
      dates: '2022',
      location: 'Ireland',
      bullets: [
        'Supervised examinations ensuring academic integrity and proper procedures'
      ],
      technologies: ['Administration', 'Supervision']
    }
  ],
  
  projects: [
    {
      slug: 'eirpost',
      title: 'EirPost',
      description: 'A logistics + shipping service for SMEs in Ireland serving hundreds of SME customers, cutting shipping costs by up to 40%. Designed pricing models, managed customer onboarding, and oversaw financial reconciliation.',
      tags: ['Logistics', 'Web Development', 'Business Development', 'Financial Management'],
      liveUrl: 'https://eirpost.ie',
      featured: true,
      priority: 1
    },
    {
      slug: 'rofs-3d',
      title: "ROF's 3D - 3D Printing Business",
      description: 'Established and scaled a 3D printing venture to 1,000+ sales, €50k+ revenue, and 4.8/5 rating. Operated an 8-printer farm using CAD to design and produce sustainable, market-driven products. Built an online following of 25k+ followers and 10M+ views.',
      tags: ['3D Printing', 'CAD', 'E-commerce', 'Social Media Marketing', 'Manufacturing'],
      liveUrl: 'https://rofs3d.com',
      featured: true,
      priority: 2
    },
    {
      slug: 'cashew',
      title: 'Cashew - Startup Product',
      description: 'Demo-ready startup product developed during the Patch accelerator program at DogPatch Labs. Collaborated with peers and mentors, conducted user testing, managed product backlog, and pitched to investors.',
      tags: ['Product Development', 'User Testing', 'Startup', 'Product Management'],
      featured: true,
      priority: 3
    }
  ],
  
  skills: {
    categories: [
      {
        name: 'Technical Skills',
        items: ['Python', 'SQL', 'CAD', '3D Printing', 'Web Development']
      },
      {
        name: 'Analysis & Operations',
        items: ['Excel (Pivots/Lookups)', 'Budgeting', 'KPI Tracking', 'Financial Reconciliation']
      },
      {
        name: 'Business & Finance',
        items: ['Pricing Strategy', 'P&L Management', 'Client Reporting', 'Advertising', 'Customer Onboarding']
      },
      {
        name: 'Communication & Leadership',
        items: ['Stakeholder Management', 'Presentations', 'Customer Relations', 'Team Collaboration']
      },
      {
        name: 'Manufacturing & Engineering',
        items: ['CAD Design', 'Quality Assurance', 'Surveying', 'Safety Compliance', 'Manufacturing Operations']
      }
    ]
  },
  
  awards: [
    {
      title: 'UCD Entrance Scholar',
      issuer: 'University College Dublin',
      date: '2023',
      description: 'Awarded for achieving 589 points in the Leaving Certificate with H1 grades in Physics, DCG, and Computer Science'
    }
  ]
}

// Site configuration
export const siteConfig = {
  title: `${cvData.person.name} - Portfolio`,
  description: `Mechanical Engineering Student & Entrepreneur - Portfolio and projects by ${cvData.person.name}`,
  url: 'https://ruairi-o-flaherty.github.io',
  author: cvData.person.name,
  keywords: [
    'portfolio',
    'mechanical engineering',
    'entrepreneur',
    'startup',
    'logistics',
    '3d printing',
    'web development',
    'business development',
    'dublin',
    'ireland',
    'ucd'
  ]
}

// Helper function to get featured projects
export const getFeaturedProjects = () => {
  return cvData.projects
    .filter(project => project.featured)
    .sort((a, b) => (a.priority || 999) - (b.priority || 999))
}

// Helper function to get all projects sorted by priority
export const getAllProjects = () => {
  return cvData.projects.sort((a, b) => (a.priority || 999) - (b.priority || 999))
}
