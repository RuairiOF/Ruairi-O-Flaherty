import type { CVData } from '../types'

const basePath = import.meta.env.BASE_URL || '/'
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
      description: 'A logistics automation platform serving hundreds of Irish businesses. Handles automated label generation, order fulfillment, and shipping optimization, cutting costs by up to 40% while giving business owners their time back.',
      about: 'EirPost is a logistics automation platform that integrates with An Post to handle the entire shipping workflow for Irish businesses. From automatic label generation to order fulfillment and cost optimization, the platform eliminates manual shipping tasks so businesses can focus on growth. Designed with a user-friendly interface for non-technical users, from solo Etsy sellers to high-volume e-commerce operations.',
      longDescription: `When I was running ROF's 3D, shipping 3D printed products, I was spending way too much time manually creating shipping labels. Hours clicking back and forth, copying addresses and parcel info and printing labels. I found it tedious, repetitive, and in hindsight, it took energy and motivation from me, which could have been redirected into scaling.

First, I built myself a bot to automate it with playwright. With a bit of tweaking, what took me hours took a couple of minutes. An order comes in, the label would get created automatically and just print on my label printer for me to just peel off and stick to a parcel.

I know this isn't just my problem. I'd say most, if not all, small businesses in Ireland deal with the same tedious shipping workflow, so I decided to share it on. What started as a personal time saver turned into an automation platform for order fulfillment and shipping logistics, after turning systems specific to my needs into a website that I have tried to optimise the UI for so that not so technical individuals, who may be just beginning to experiment with an Etsy, for example, can use it with ease.

Now EirPost serves hundreds of Irish businesses. We've built integrations that aim to handle everything from automated label generation to cost optimisation, saving businesses up to 40% on their shipping costs. It's not just about cheaper shipping, it's also about giving small business owners their time back so they can focus on what actually matters, whether that be building and growing their companies or even spending less time on the business itself to focus on themselves and their families.

The next phase for us is to look at full autonomy. AI driven analytics that predict shipping volumes, optimise packaging and routes, letting higher volume shippers scale without adding operational overhead. The goal is to make logistics essentially invisible, so businesses can focus entirely on their products and customers and ultimately creativity instead of this time consuming repetition.`,
      highlights: [
        'Hundreds of active SME customers across Ireland',
        '40% average reduction in shipping costs',
        'Automated end-to-end order fulfillment',
        'Born from real shipping pain at ROF\'s 3D',
      ],
      gallery: [],
      tags: ['Automation', 'Web Development', 'Business Development', 'API Integration', 'Logistics'],
      image: `${logoBasePath}EirpostLogoPNG.png`,
      liveUrl: 'https://eirpost.ie',
      featured: true,
      priority: 1
    },
    {
      slug: 'laserlane',
      title: 'LaserLane',
      description: 'Co-running LaserLane, a bike safety tech startup. Building hardware and software solutions for cyclists while handling operations, product development, and growth. Getting ready for our crowdfunding launch.',
      longDescription: 'LaserLane is a bike safety startup I co-run. We are developing hardware and software that make cyclists more visible and safer on the road, while also building the business side of it at the same time. Day to day that means prototyping, testing, operations, and preparing for launch.',
      highlights: [
        'Designed and tested bike-mounted safety prototypes',
        'Combining hardware, software, and operations in one product',
        'Preparing for crowdfunding launch',
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
      title: "ROF's 3D - 3D Printing Business",
      description: 'Established and scaled a 3D printing venture to 1,000+ sales, €50k+ revenue, and 4.8/5 rating. Operated an 8-printer farm using CAD to design and produce sustainable, market-driven products. Built an online following of 25k+ followers and 10M+ views.',
      longDescription: 'ROF\'s 3D started as a side project and turned into a full e-commerce operation. I ran production, designed products, fulfilled orders, and handled content and marketing. Running the business taught me how to combine product design, manufacturing, customer service, and growth into one repeatable system.',
      highlights: [
        '1,000+ total sales',
        '€50k+ in revenue',
        '4.8/5 customer rating',
        '25k+ followers and 10M+ social views',
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
      title: 'Cashew - Startup Product',
      description: 'Demo-ready startup product developed during the Patch accelerator program at DogPatch Labs. Collaborated with peers and mentors, conducted user testing, managed product backlog, and pitched to investors.',
      longDescription: 'Cashew was built during the Patch accelerator at DogPatch Labs. I worked with teammates and mentors to move quickly from idea to demo-ready product. We ran user testing, managed product decisions, and presented outcomes to mentors and investors.',
      highlights: [
        'Built during Patch accelerator at DogPatch Labs',
        'Shipped a demo-ready product under tight timelines',
        'Ran user testing and pitched to mentors and investors',
      ],
      gallery: [
        `${logoBasePath}CashewLogo.png`,
        `${photoBasePath}Patch_baltyboys.jpeg`,
      ],
      tags: ['Product Development', 'User Testing', 'Startup', 'Product Management'],
      image: `${logoBasePath}CashewLogo.png`,
      liveUrl: 'https://cashew.ie',
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
      description: 'E-commerce business sourcing retro and vintage-style radios from Chinese manufacturers and reselling them. Handles product sourcing, quality control, import logistics, and customer fulfilment.',
      longDescription: 'Nukacola Radio is an e-commerce project focused on retro-style radios. I handled supplier communication, sourcing decisions, quality checks, import logistics, and fulfilment. It has been a practical way to learn operations from first contact with a manufacturer all the way to customer delivery.',
      highlights: [
        'Sourced products directly from overseas manufacturers',
        'Managed quality control and import logistics',
        'Handled fulfilment and customer-facing operations',
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
