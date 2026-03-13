import type { CVData } from '../types'

const basePath = import.meta.env?.BASE_URL || '/'
const logoBasePath = `${basePath}images/logos/`
const skillBasePath = `${basePath}images/skills/`
const photoBasePath = `${basePath}images/photos/`

export const cvData: CVData = {
  person: {
    name: "Ruairí O'Flaherty",
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
      description: 'I founded EirPost to give Irish SMEs instant discounted shipping labels and simpler logistics workflows. It supports Etsy and Shopify sellers across Ireland and helps customers cut international shipping costs by up to 40%.',
      longDescription: `EirPost started as an operations project to solve a clear problem: small Irish businesses were paying high shipping rates and losing time to manual admin around labels, billing, and support exceptions.

I built the model end to end, including pricing logic, customer onboarding, and the internal workflows that keep shipping reliable every day. That includes rate iteration, margin monitoring, billing and reconciliation checks, and customer support processes for issues like delayed parcels or incorrect label data.

Today EirPost supports hundreds of SME customers across Ireland. The result is a simpler workflow for merchants and measurable savings, with many customers reducing international shipping costs by up to 40%.`,
      highlights: [
        'Supports hundreds of SME customers across Ireland',
        'Helps Etsy, Shopify, and other e-commerce sellers buy discounted labels instantly',
        'Reduced international shipping costs by up to 40% for customers',
        'Built and iterated pricing, onboarding, and reconciliation workflows',
        'Runs day-to-day operations including support, exception handling, and margin tracking',
      ],
      gallery: [
        `${photoBasePath}EirPost/small_business (1).png`,
      ],
      tags: ['Logistics', 'Web Development', 'Business Development', 'Financial Management'],
      image: `${logoBasePath}EirpostLogoPNG.png`,
      imagePosition: 'object-left-top',
      liveUrl: 'https://eirpost.ie',
      featured: true,
      priority: 1
    },
    {
      slug: 'laserlane',
      title: 'LaserLane',
      description: 'Co-founding LaserLane, a bike safety startup developing green-laser visibility hardware for cyclists. I work across prototyping, on-road testing, and launch operations while we prepare for crowdfunding.',
      longDescription: `LaserLane is focused on one core problem: cyclists are often seen too late by drivers. The product direction is a visibility system that uses projected green laser guidance to make a rider's road position clearer before close passing becomes dangerous.

My role spans both build and business. On the product side, I work on hardware prototyping, mounting and durability iterations, and real-world road testing on bikes. On the business side, I handle early operations, launch planning, and communication work needed to move from prototype to public release.

The project is currently in launch preparation. We have validated multiple prototype iterations, built marketing and demo assets, and are preparing the crowdfunding rollout.`,
      highlights: [
        'Developing green-laser bike-lane projection technology to improve cyclist visibility',
        'Designed and tested multiple bike-mounted hardware prototypes',
        'Ran field tests on-road to iterate mounting, visibility, and rider usability',
        'Built launch assets including landing page, visuals, and product demonstrations',
        'Preparing crowdfunding campaign and early fulfilment and operations plan',
      ],
      gallery: [
        `${photoBasePath}LaserLane/LaserLaneLanding1.png`,
        `${photoBasePath}LaserLane/PicturesOfLaserLaneOnBike (1).jpg`,
        `${photoBasePath}LaserLane/PicturesOfLaserLaneOnBike (2).jpg`,
        `${photoBasePath}LaserLane/PicturesOfLaserLaneOnBike (3).jpg`,
        `${photoBasePath}LaserLane/PicturesOfLaserLaneOnBike (4).jpg`,
        `${photoBasePath}LaserLane/PicturesOfLaserLaneOnBike (5).jpg`,
        `${photoBasePath}LaserLane/PicturesOfLaserLaneOnBike (6).jpg`,
        `${photoBasePath}LaserLane/PicturesOfLaserLaneOnBike (7).jpg`,
        `${photoBasePath}LaserLane/PicturesOfLaserLaneOnBike (8).jpg`,
        `${photoBasePath}LaserLane/PicturesOfLaserLaneOnBike (9).jpg`,
      ],
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
      title: "ROF's 3D",
      description: "Built ROF's 3D from a side project into a real manufacturing e-commerce business. Scaled to 1,000+ sales and EUR50k+ revenue with an 8-printer farm, a 4.8/5 rating, and strong social-driven demand.",
      longDescription: `ROF's 3D started as a hobby and became a full production and commerce operation. I built the workflow from design to delivery: CAD modeling, print setup, batch scheduling across an 8-printer farm, quality control, packing, and fulfilment.

Beyond production, I handled the commercial side as well. I tested products with real demand, ran storefront operations, managed customer service, and used short-form content as the main acquisition channel. That created a feedback loop between what customers requested, what sold, and what got manufactured next.

The business reached 1,000+ sales, EUR50k+ revenue, and a 4.8/5 customer rating. On TikTok the brand grew to roughly 28.5k followers and 1.3M likes, making content a major driver of repeat demand.`,
      highlights: [
        'Scaled to 1,000+ fulfilled orders and EUR50k+ revenue',
        'Maintained a 4.8/5 customer rating through consistent QA and support',
        'Operated an 8-printer production setup with repeatable manufacturing workflows',
        'Designed products in CAD and iterated based on customer demand signals',
        'Grew social distribution to roughly 28.5k followers and 1.3M likes on TikTok',
      ],
      gallery: [
        `${photoBasePath}Printing/SprunkeColaMain.jpg`,
        `${photoBasePath}Printing/IMG_2856.JPG`,
        `${photoBasePath}Printing/IMG_2862.JPG`,
        `${photoBasePath}Printing/IMG_2864.JPG`,
        `${photoBasePath}Printing/IMG_3027.JPG`,
        `${photoBasePath}Printing/IMG_3175.jpg`,
        `${photoBasePath}Printing/IMG_4130.jpg`,
        `${photoBasePath}Printing/IMG_4137.jpg`,
      ],
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
      title: "Cashew - Patch '25",
      description: 'Cashew was built during the Patch accelerator at Dogpatch Labs, taking an idea from discovery to demo in one program cycle. I worked across user research, scope, sprint execution, and investor-facing storytelling.',
      longDescription: `Cashew was developed during the Patch accelerator at Dogpatch Labs, where speed and clarity mattered more than perfect polish. The team had to move from early problem framing to a demo-ready product within a fixed program timeline.

I worked across product and execution: running user interviews and testing sessions, translating feedback into backlog priorities, and helping make scope decisions that kept each sprint shippable. We focused on validating the core user flow first, then tightening UX and narrative for demo day.

This project was strong training in constrained startup delivery: build quickly, test with real users, cut non-essential scope, and communicate traction clearly to mentors and potential investors.`,
      highlights: [
        'Built and shipped during the Patch accelerator at Dogpatch Labs',
        'Moved from concept to demo-ready product inside a single program cycle',
        'Ran user research and usability testing to guide backlog priorities',
        'Managed scope and sprint planning under tight deadlines',
        'Presented the product and learning outcomes to mentors and investors',
      ],
      gallery: [
        `${logoBasePath}CashewLogo.png`,
        `${photoBasePath}Patch_baltyboys.jpeg`,
      ],
      tags: ['Product Development', 'User Testing', 'Startup', 'Product Management'],
      image: `${logoBasePath}CashewLogo.png`,
      liveUrl: 'https://cashew.ie',
      links: {
        patch: 'https://www.joinpatch.org/'
      },
      featured: true,
      priority: 4
    },
    {
      slug: 'sleeptracket100',
      title: 'SleepTracket100',
      description: 'A bedside sleep tracker built on Raspberry Pi that records overnight audio to estimate sleep/wake windows, stores nightly data to Supabase, and supports voice-based dream logging with AI summaries.',
      longDescription: `This project is a bedside sleep tracker built with a Raspberry Pi. The goal is to have a small, self-running device you can leave beside your bed, plug in at night, and let run automatically. It records audio while you sleep and uses that signal to estimate when you fell asleep, when you woke up, and your total sleep duration.

The data is processed the next morning and stored both locally on the Pi and in Supabase, so each night is tracked over time. That makes it possible to build up useful history and eventually view trends in an app or dashboard, like total sleep, weekly patterns, and how consistent your sleep schedule is.

Dream logging is a key part of the system too. If you wake up and remember a dream, you can record it by voice. The system transcribes that input and uses AI to generate a short summary and interpretation, then stores it alongside the sleep session data.

The long-term aim is to make this feel like a quiet bedside device rather than a tech demo: automatic, low-maintenance, and genuinely useful over time.`,
      highlights: [
        'Runs as a bedside Raspberry Pi device with minimal setup',
        'Tracks estimated sleep start, wake time, and duration from overnight audio',
        'Stores nightly records locally and in Supabase for long-term history',
        'Supports voice dream logging with AI-generated summaries and interpretation',
        'Designed to feed future dashboard/app visualisations',
      ],
      gallery: [
        `${photoBasePath}SleepTracker_Rasspberry_Pi/SleepTracker_Rasspberry_Pi.jpeg`,
        `${photoBasePath}SleepTracker_Rasspberry_Pi/SleepTracker_Rasspberry_Pi_1.jpeg`,
      ],
      tags: ['Raspberry Pi', 'Python', 'Supabase', 'Audio Processing', 'AI', 'Sleep Tracking', 'Hardware'],
      image: `${photoBasePath}SleepTracker_Rasspberry_Pi/SleepTracker_Rasspberry_Pi.jpeg`,
      featured: true,
      priority: 5
    },
    {
      slug: 'nukacolaradio',
      title: 'Nukacola Radio',
      description: 'Nukacola Radio is a direct-to-consumer product brand for hand-finished retro game-inspired Bluetooth radios. I handle sourcing, QA, import logistics, fulfilment, and product positioning.',
      longDescription: `Nukacola Radio started as a product and brand experiment: take a generic hardware platform and turn it into a differentiated collectible with real utility. The result is a retro game-inspired radio that looks like a prop but works as an everyday device with Bluetooth, AM/FM/SW tuning, and rechargeable battery power.

I handled the full supply chain path from overseas sourcing to customer delivery. That included supplier communication, sample review, quality-control checks, import logistics, fulfilment setup, and customer support. I also shaped the storefront and product narrative so the item was sold as both a functional speaker and a collectible piece.

The offer includes standard and bundled editions, positioned as a limited production run. Public product data currently shows a 4.8 rating across 127 reviews, reflecting the focus on product quality and post-purchase support.`,
      highlights: [
        'Built a niche DTC electronics brand around retro game-inspired radios',
        'Managed supplier sourcing, QC checks, and import logistics end to end',
        'Specified core features including Bluetooth, AM/FM/SW tuner, and rechargeable battery',
        'Set up fulfilment and customer-support operations for online orders',
        'Launched standard and bundle variants with product-led pricing',
        'Current public rating: 4.8/5 across 127 reviews',
      ],
      gallery: [
        `${photoBasePath}NukaColaRadio/1.png`,
        `${photoBasePath}NukaColaRadio/2.png`,
        `${photoBasePath}NukaColaRadio/3.png`,
        `${photoBasePath}NukaColaRadio/4.png`,
        `${photoBasePath}NukaColaRadio/5.png`,
        `${photoBasePath}NukaColaRadio/6.png`,
        `${photoBasePath}NukaColaRadio/NukaColaRadioSandRiver1080p.png`,
        `${photoBasePath}NukaColaRadio/radio-image- (1).png`,
        `${photoBasePath}NukaColaRadio/radio-image- (2).png`,
        `${photoBasePath}NukaColaRadio/radio-image- (3).png`,
        `${photoBasePath}NukaColaRadio/radio-image- (4).png`,
      ],
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
        description: 'I run ad campaigns across Meta and TikTok for my businesses. I handle the budgets, track what\'s working, and tweak things until the numbers make sense.',
        images: [
          `${skillBasePath}ADs/MetaADS_Dashboard.png`,
        ],
        tools: ['Meta Ads', 'TikTok Ads', 'Google Analytics', 'A/B Testing']
      },
      {
        title: 'Social Media & Content',
        description: 'Built 25k+ followers and 10M+ views making content for my 3D printing business. Turns out people love watching things get made.',
        images: [`${skillBasePath}ADs/TikTokDash.png`],
        tools: ['TikTok', 'Instagram', 'Content Strategy', 'Video Editing']
      },
      {
        title: 'Business & Logistics',
        description: 'Between EirPost, ROF\'s 3D, and LaserLane, I\'ve gotten pretty good at the unglamorous stuff: pricing, shipping, keeping customers happy, and making sure the numbers add up.',
        images: [],
        tools: ['Excel', 'P&L Management', 'Pricing Strategy', 'Customer Relations', 'Supply Chain']
      },
      {
        title: '3D Printing & Manufacturing',
        description: 'Ran an 8-printer farm, shipped 1,000+ products, and learned that the hard part isn\'t printing, it\'s everything after.',
        images: [
          `${skillBasePath}3D Print/3DPrintBusinessLotsOfProducts.jpg`,
          `${skillBasePath}3D Print/ParcelsOnTheFloorFor3DPrintBusiness.jpg`
        ],
        tools: ['FDM Printing', 'Resin Printing', 'CAD Design', 'Slicing', 'Post-Processing']
      },
      {
        title: '3D Modelling & Rendering',
        description: 'I use Blender for renders and visualisation — product shots, concept art, and anything that needs to look good before it\'s built.',
        images: [
          `${skillBasePath}Blender/Screenshot 2026-03-07 134047.png`,
          `${skillBasePath}Blender/Screenshot 2026-03-07 134055.png`
        ],
        tools: ['Blender', 'AutoCAD']
      },
      {
        title: 'SolidWorks & Fusion 360',
        description: 'My go-to tools for anything that needs to actually be manufactured. I model parts, run simulations, and produce drawings for real-world fabrication.',
        images: [`${skillBasePath}Fusion360/Fusion360.png`],
        tools: ['SolidWorks', 'Fusion 360', 'CAD', 'FEA Simulation', 'Technical Drawing']
      },
      {
        title: 'Electronics & Prototyping',
        description: "From overclocking e-bike motors to wiring up Arduinos, I like to mess around with hardware. I've built remote control drones, custom motor setups, and a local AI device on a Raspberry Pi.",
        images: [
          `${skillBasePath}Electronics and Soldering/EbikeMotorElectronics.jpeg`,
          `${skillBasePath}Electronics and Soldering/Ebike_Battery.jpeg`
        ],
        tools: ['Arduino', 'Raspberry Pi', 'Soldering', 'Circuit Design', 'Sensors']
      },
      {
        title: 'Site Engineering',
        description: 'Spent a summer interning with Walls Construction on the UCD O’Connor Centre for Learning site, doing surveying, safety compliance, and coordinating subcontractors. It gave me a whole new respect for project timelines and how company hierarchy shapes day-to-day decisions.',
        images: [
          `${skillBasePath}Construction Site/Construction_Site.jpeg`,
          `${skillBasePath}Construction Site/Construction_Site1.jpeg`
        ],
        tools: ['Surveying', 'Quality Assurance', 'Safety Compliance', 'AutoCAD']
      },
      {
        title: 'Software Development',
        description: 'I develop and build whatever my projects need—from websites, mobile apps, and automation scripts to the code that powers my RC cars. My favourite example is EirPost, where the software actually runs a real, revenue-generating business.',
        images: [],
        tools: ['Python', 'TypeScript', 'JavaScript', 'C', 'C++', 'Java', 'React', 'Next.js', 'Flutter', 'React Native']
      },
      {
        title: 'Cloud & Deployment',
        description: 'All my projects run on real infrastructure. I handle the databases, hosting, and deployment so things actually stay online.',
        images: [`${skillBasePath}Other/Cloud.png`],
        tools: ['Supabase', 'PostgreSQL', 'MySQL', 'Vercel', 'Railway', 'Docker', 'AWS']
      },
      {
        title: 'AI & Automation',
        description: 'AI helps me stay on top of things across all my work. With EirPost for example, I\'ve set up a passive system that analyses data, finds leads, manages emails, and turns them into actionable tasks. It\'s become a big part of how I keep everything running without burning out.',
        images: [`${skillBasePath}Other/AI_LLM.png`],
        tools: ['ChatGPT', 'Claude', 'LLM APIs', 'Prompt Engineering', 'Workflow Automation'],
        imagePosition: '[object-position:center_30%]'
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
  twitterHandle: undefined as string | undefined,
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
  return [...cvData.projects].sort((a, b) => (a.priority || 999) - (b.priority || 999))
}
