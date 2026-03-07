import type { CVData } from '../types'

const basePath = import.meta.env.BASE_URL || '/'
const logoBasePath = `${basePath}images/logos/`
const skillBasePath = `${basePath}images/skills/`

export const cvData: CVData = {
  person: {
    name: "Ruairi O'Flaherty",
    headline: 'Mechanical Engineering Student & Developer',
    location: 'Dublin, Ireland',
    email: 'ruairioflaherty1@gmail.com',
    phone: '+353 89 406 7369',
    links: {
      linkedin: 'https://www.linkedin.com/in/ruairioflaherty/',
      website: 'https://eirpost.ie',
    }
  },
  
  education: [
    {
      institution: 'University College Dublin',
      degree: 'Mechanical Engineering (BEng)',
      dates: '2023 - Present',
      location: 'Dublin, Ireland',
      details: 'UCD Entrance Scholar'
    },
    {
      institution: 'Leaving Certificate',
      degree: 'State Examinations',
      dates: '2023',
      location: 'Ireland',
      details: '589 Points: H1 Physics, H1 DCG, H1 Computer Science, H2 Maths, H2 Applied Maths, H2 English'
    }
  ],
  
  experience: [
    {
      company: 'EirPost',
      role: 'Founder & Operations Lead',
      dates: '2025 - Present',
      location: 'Ireland',
      bullets: [
        'Running EirPost, a logistics and shipping service for SMEs across Ireland',
        'Managing pricing models, customer onboarding, and day-to-day operations for hundreds of SME customers',
        'Overseeing financial reconciliation and data-driven cost optimisation to reduce shipping costs by up to 40%'
      ],
      technologies: ['Logistics', 'Web Development', 'Business Operations', 'Customer Relations', 'Financial Management'],
      links: {
        website: 'https://eirpost.ie'
      }
    },
    {
      company: 'Patch at DogPatch Labs',
      role: 'Software/Startup Fellow',
      dates: 'Summer 2025',
      location: 'Dublin, Ireland',
      bullets: [
        'Selected for competitive accelerator program; collaborated with peers and mentors to build and deliver Cashew, a demo-ready startup product',
        'Conducted user testing, managed the product backlog, and pitched outcomes to mentors and investors'
      ],
      technologies: ['Product Management', 'User Testing', 'Startup Development'],
      links: {
        patch: 'https://www.joinpatch.org/ruair-oflaherty'
      }
    },
    {
      company: 'Walls Construction Ltd.',
      role: 'Site Engineer',
      dates: 'Summer 2024',
      location: 'Dublin, Ireland',
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
      location: 'Dublin, Ireland',
      bullets: [
        'Completed training in safeguarding, food hygiene, and manual handling',
        'Delivered professional service supporting vulnerable residents and staff'
      ],
      technologies: ['Food Safety', 'Care Services']
    },
    {
      company: 'Institute of Education',
      role: 'Exam Invigilator',
      dates: 'Summer 2022',
      location: 'Dublin, Ireland',
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
      image: `${logoBasePath}EirpostLogoPNG.png`,
      liveUrl: 'https://eirpost.ie',
      featured: true,
      priority: 1
    },
    {
      slug: 'laserlane',
      title: 'LaserLane',
      description: 'Co-running LaserLane, a bike safety tech startup. Building hardware and software solutions for cyclists while handling operations, product development, and growth. Getting ready for our crowdfunding launch.',
      tags: ['Bike Technology', 'Product Development', 'Hardware', 'Business Operations', 'Entrepreneurship', 'Safety Tech'],
      image: `${logoBasePath}LaserLaneLogoPNG.png`,
      liveUrl: 'https://laserlane.ie',
      links: {
        website: 'https://laserlane.ie'
      },
      featured: true,
      priority: 2
    },
    {
      slug: 'rofs-3d',
      title: "ROF's 3D - 3D Printing Business",
      description: 'Established and scaled a 3D printing venture to 1,000+ sales, €50k+ revenue, and 4.8/5 rating. Operated an 8-printer farm using CAD to design and produce sustainable, market-driven products. Built an online following of 25k+ followers and 10M+ views.',
      tags: ['3D Printing', 'CAD', 'E-commerce', 'Social Media Marketing', 'Manufacturing'],
      image: `${logoBasePath}Rofs3D_Logo.jpg`,
      liveUrl: 'https://www.tiktok.com/@rofs3d.com',
      links: {
        website: 'https://rofs3d.com',
        tiktok: 'https://www.tiktok.com/@rofs3d.com'
      },
      featured: true,
      priority: 3
    },
    {
      slug: 'cashew',
      title: 'Cashew - Startup Product',
      description: 'Demo-ready startup product developed during the Patch accelerator program at DogPatch Labs. Collaborated with peers and mentors, conducted user testing, managed product backlog, and pitched to investors.',
      tags: ['Product Development', 'User Testing', 'Startup', 'Product Management'],
      image: `${logoBasePath}CashewLogo.png`,
      liveUrl: 'https://cashew.ie',
      featured: true,
      priority: 4
    },
    {
      slug: 'nukacolaradio',
      title: 'Nukacola Radio',
      description: 'E-commerce business sourcing retro and vintage-style radios from Chinese manufacturers and reselling them. Handles product sourcing, quality control, import logistics, and customer fulfilment.',
      tags: ['E-commerce', 'Sourcing', 'Import/Export', 'Retail', 'Consumer Electronics'],
      image: `${logoBasePath}NukaColaRadioLOGO.png`,
      liveUrl: 'https://nukacolaradio.com',
      links: {
        website: 'https://nukacolaradio.com'
      },
      featured: true,
      priority: 6
    }
  ],
  
  skills: {
    showcases: [
      {
        title: 'Advertising & Paid Media',
        description: 'Running and optimising ad campaigns across Meta and TikTok for multiple businesses, managing budgets and tracking ROAS to drive real revenue.',
        images: [
          `${skillBasePath}ADs/MetaADS_Dashboard.png`,
          `${skillBasePath}ADs/TikTokDash.png`
        ],
        tools: ['Meta Ads', 'TikTok Ads', 'Google Analytics', 'A/B Testing', 'Budget Management']
      },
      {
        title: 'Social Media & Content',
        description: 'Built an audience of 25k+ followers and 10M+ views across platforms, creating content that converts followers into customers.',
        images: [],
        tools: ['TikTok', 'Instagram', 'Content Strategy', 'Video Editing', 'Community Building']
      },
      {
        title: 'Business Operations & Logistics',
        description: 'Running day-to-day operations for multiple businesses, from pricing strategy and customer onboarding to financial reconciliation and supply chain management.',
        images: [],
        tools: ['Excel', 'P&L Management', 'Pricing Strategy', 'Customer Relations', 'Supply Chain']
      },
      {
        title: '3D Modelling & Rendering',
        description: 'Creating photorealistic renders and 3D models for product visualisation, marketing materials, and manufacturing. Experienced across Blender, SolidWorks, Fusion 360, and AutoCAD.',
        images: [
          `${skillBasePath}Blender/Screenshot 2026-03-07 134047.png`,
          `${skillBasePath}Blender/Screenshot 2026-03-07 134055.png`
        ],
        tools: ['Blender', 'SolidWorks', 'Fusion 360', 'AutoCAD']
      },
      {
        title: '3D Printing & Manufacturing',
        description: 'Operated an 8-printer farm producing 1,000+ products. From CAD design through to slicing, printing, post-processing, and quality control.',
        images: [],
        tools: ['FDM Printing', 'Resin Printing', 'CAD Design', 'Slicing', 'Post-Processing']
      },
      {
        title: 'Electronics & Prototyping',
        description: 'Building hardware prototypes with microcontrollers, custom PCBs, and embedded systems. Comfortable with soldering, circuit design, and integrating sensors.',
        images: [],
        tools: ['Arduino', 'Raspberry Pi', 'Soldering', 'Circuit Design', 'Sensors']
      },
      {
        title: 'Software Development',
        description: 'Building web apps, mobile apps, and automation tools to solve real problems across my businesses and projects.',
        images: [],
        tools: ['Python', 'TypeScript', 'JavaScript', 'C', 'C++', 'Java', 'React', 'React Native', 'Next.js', 'Flutter']
      },
      {
        title: 'Cloud & Infrastructure',
        description: 'Deploying and managing production applications with modern cloud tooling, databases, and CI/CD pipelines.',
        images: [],
        tools: ['Supabase', 'PostgreSQL', 'MySQL', 'Vercel', 'Railway', 'Docker', 'AWS']
      },
      {
        title: 'AI & Automation',
        description: 'Leveraging LLMs and AI tools extensively across all my work, from automating business processes to building AI-powered features into products.',
        images: [],
        tools: ['ChatGPT', 'Claude', 'LLM APIs', 'Prompt Engineering', 'Workflow Automation']
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
  url: 'https://www.ruairioflaherty.ie',
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
