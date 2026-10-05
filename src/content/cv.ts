import type { CVData } from '../types'

const basePath = import.meta.env?.BASE_URL || '/'

export const cvData: CVData = {
  person: {
    name: "Ruairí O'Flaherty",
    headline: 'Mechanical engineering student at UCD',
    location: 'Dublin, Ireland',
    email: 'ruairioflaherty1@gmail.com',
    links: {
      github: 'https://github.com/RuairiOF',
      linkedin: 'https://www.linkedin.com/in/ruairioflaherty/',
      website: 'https://eirpost.ie',
    },
  },
  education: [
    {
      institution: 'University College Dublin',
      degree: 'Mechanical Engineering (BEng)',
      dates: '2023 - Present',
      location: 'Dublin, Ireland',
      details: 'UCD Entrance Scholar',
    },
    {
      institution: 'Leaving Certificate',
      degree: 'State Examinations',
      dates: '2023',
      location: 'Ireland',
      details:
        '589 Points: H1 Physics, H1 DCG, H1 Computer Science, H2 Maths, H2 Applied Maths, H2 English',
    },
  ],
  experience: [
    {
      company: 'EirPost',
      role: 'Founder & Operations Lead',
      dates: '2025 - Present',
      location: 'Ireland',
      bullets: [
        'Building and running an An Post shipping service for Irish online shops.',
        'Managing postage prices, account setup and customer support.',
        'Checking shipping invoices and reconciling customer accounts.',
      ],
      technologies: [
        'Logistics',
        'Web Development',
        'Business Operations',
        'Customer Relations',
        'Financial Management',
      ],
      links: {
        website: 'https://eirpost.ie',
      },
    },
    {
      company: 'Patch at DogPatch Labs',
      role: 'Software/Startup Fellow',
      dates: 'Summer 2025',
      location: 'Dublin, Ireland',
      bullets: [
        'Built Cashew with a team during the Patch summer programme.',
        'Interviewed users, planned development tasks and presented the product at demo day.',
      ],
      technologies: [
        'Product Management',
        'User Testing',
        'Startup Development',
      ],
      links: {
        patch: 'https://www.joinpatch.org/ruair-oflaherty',
      },
    },
    {
      company: 'Walls Construction Ltd.',
      role: 'Site Engineer',
      dates: 'Summer 2024',
      location: 'Dublin, Ireland',
      bullets: [
        'Assisted with surveying and site checks on the UCD O’Connor Centre for Learning project.',
        'Prepared weekly reports and followed up on defects with subcontractors.',
      ],
      technologies: ['Surveying', 'Quality Assurance', 'Safety Compliance'],
    },
    {
      company: 'CareChoice',
      role: 'Catering Assistant',
      dates: 'Summer 2023',
      location: 'Dublin, Ireland',
      bullets: [
        'Worked in catering at a residential care home.',
        'Completed food hygiene, safeguarding and manual handling training.',
      ],
      technologies: ['Food Safety', 'Care Services'],
    },
    {
      company: 'Institute of Education',
      role: 'Exam Invigilator',
      dates: 'Summer 2022',
      location: 'Dublin, Ireland',
      bullets: [
        'Supervised exams and followed the centre’s examination procedures.',
      ],
      technologies: ['Administration', 'Supervision'],
    },
  ],
  projects: [
    {
      slug: 'eirpost',
      title: 'EirPost',
      description:
        'An Post shipping labels and order fulfilment for Irish online shops. Started as a label-printing script for my own 3D-printing orders.',
      about:
        'EirPost connects shop orders to An Post shipping. It prepares postage labels and updates orders when they have been fulfilled.',
      longDescription:
        'I started EirPost because creating labels for ROF’s 3D orders took too long. I was copying addresses and parcel details between the shop and the postage website, then printing each label separately.\n\nThe first version was a browser script that did those steps for me. Once it worked for my own orders, I began turning it into a service other shops could use.\n\nI work on the software as well as the postage prices, account setup, customer support and invoice reconciliation. The service now handles labels and fulfilment for Irish online shops.',
      highlights: [
        'Automatic label creation from shop orders',
        'Order fulfilment updates',
        'An Post shipping services',
        'Postage pricing and invoice reconciliation',
      ],
      gallery: [
        `${basePath}images/projects/eirpost/EirLink_Example_Label.webp`,
        `${basePath}images/projects/eirpost/eirlink-demo-poster.webp`,
        `${basePath}images/photos/EirPost/small_business-1.webp`,
        `${basePath}images/photos/EirPost/Worldwide.webp`,
        `${basePath}images/photos/EirPost/3D_Printed_Lamps.webp`,
        `${basePath}images/photos/EirPost/3D_Printed_Vases.webp`,
        `${basePath}images/photos/EirPost/Cutting_Boards.webp`,
        `${basePath}images/photos/EirPost/Jewellery.webp`,
        `${basePath}images/photos/EirPost/Model_Train.webp`,
        `${basePath}images/photos/EirPost/Crochets.webp`,
      ],
      tags: [
        'Automation',
        'Web Development',
        'Business Development',
        'API Integration',
        'Logistics',
      ],
      image: `${basePath}images/logos/EirpostLogoPNG.webp`,
      liveUrl: 'https://eirpost.ie',
      featured: true,
      priority: 1,
    },
    {
      slug: 'rofs-3d',
      title: "ROF's 3D",
      description:
        'An online shop selling 3D-printed products, made on an eight-printer setup. More than 1,000 orders shipped.',
      longDescription:
        'ROF’s 3D started with a printer and a few product ideas. I modelled the parts, tested prints and listed the finished products online. As orders increased, the setup grew to eight printers.\n\nMy work covered CAD, slicing, scheduling print batches, checking finished parts, packing and customer support. Videos of the printing process brought most customers to the shop.\n\nThe shop passed 1,000 sales and €50,000 in revenue, with an average customer rating of 4.8 out of 5. It was also where I started writing the shipping tools that became EirPost.',
      highlights: [
        '1,000+ orders shipped',
        '€50k+ revenue',
        '4.8/5 average customer rating',
        'Eight printers used for batch production',
        'Product design, printing, packing and customer support',
      ],
      gallery: [
        `${basePath}images/photos/gallery/SprunkeColaMain.webp`,
        `${basePath}images/photos/gallery/IMG_2856.webp`,
        `${basePath}images/photos/gallery/IMG_2862.webp`,
        `${basePath}images/photos/gallery/IMG_2864.webp`,
        `${basePath}images/photos/gallery/IMG_3027.webp`,
        `${basePath}images/photos/gallery/IMG_3175.webp`,
        `${basePath}images/photos/gallery/IMG_4130.webp`,
        `${basePath}images/photos/gallery/IMG_4137.webp`,
      ],
      tags: [
        '3D Printing',
        'CAD',
        'E-commerce',
        'Social Media Marketing',
        'Manufacturing',
      ],
      image: `${basePath}images/logos/Rofs3D_Logo.webp`,
      liveUrl: 'https://www.tiktok.com/@rofs3d.com',
      links: {
        website: 'https://rofs3d.com',
        tiktok: 'https://www.tiktok.com/@rofs3d.com',
      },
      featured: true,
      priority: 3,
    },
    {
      slug: 'cashew',
      title: "Cashew - Patch '25",
      description:
        'A team project developed during Patch at Dogpatch Labs in summer 2025, from early user interviews to a demo-day product.',
      longDescription:
        'Cashew was our team project during the Patch summer programme at Dogpatch Labs. We had the programme’s fixed deadline to research the idea, build a version people could try and prepare a demonstration.\n\nI helped with user interviews and testing, deciding which features to work on next and preparing the demo-day presentation. Feedback from users and mentors changed the plan as we went.',
      highlights: [
        'Built during Patch 2025 at Dogpatch Labs',
        'User interviews and product testing',
        'Development planning with a small team',
        'Demo-day presentation',
      ],
      gallery: [
        `${basePath}images/logos/CashewLogo.webp`,
        `${basePath}images/photos/Patch_baltyboys.webp`,
      ],
      tags: [
        'Product Development',
        'User Testing',
        'Startup',
        'Product Management',
      ],
      image: `${basePath}images/logos/CashewLogo.webp`,
      liveUrl: 'https://cashew.ie',
      links: {
        patch: 'https://www.joinpatch.org/',
      },
      featured: true,
      priority: 4,
    },
    {
      slug: 'sleeptracket100',
      title: 'SleepTracket100',
      description:
        'A Raspberry Pi beside the bed, using overnight audio to estimate sleep times and save voice notes about dreams.',
      longDescription:
        'This is a Raspberry Pi experiment in sleep tracking. It records overnight audio and processes it the following morning to estimate sleep and wake times.\n\nNightly records are stored on the Pi and in Supabase. There is also a voice-note feature for recording dreams, with transcription and a short generated summary.\n\nThe next part is a dashboard for viewing the stored nights and checking whether the estimates are useful.',
      highlights: [
        'Raspberry Pi hardware',
        'Sleep-time estimates from overnight audio',
        'Local storage and Supabase records',
        'Voice notes with transcription',
        'Dashboard planned',
      ],
      gallery: [
        `${basePath}images/photos/SleepTracker_Rasspberry_Pi/SleepTracker_Rasspberry_Pi.webp`,
        `${basePath}images/photos/SleepTracker_Rasspberry_Pi/SleepTracker_Rasspberry_Pi_1.webp`,
      ],
      tags: [
        'Raspberry Pi',
        'Python',
        'Supabase',
        'Audio Processing',
        'AI',
        'Sleep Tracking',
        'Hardware',
      ],
      image: `${basePath}images/photos/SleepTracker_Rasspberry_Pi/SleepTracker_Rasspberry_Pi.webp`,
      featured: true,
      priority: 5,
    },
    {
      slug: 'nukacolaradio',
      title: 'Nukacola Radio',
      description:
        'A past project sourcing and selling retro Bluetooth radios, including supplier checks, freight and order fulfilment.',
      longDescription:
        'Nukacola Radio was a small online shop for retro game-inspired radios with Bluetooth, radio tuning and rechargeable batteries. The project is currently paused.\n\nI worked on sourcing, sample checks, supplier communication, freight and fulfilment. I also set up the storefront and handled customer support.\n\nIt gave me experience with importing finished electronics, where the work was in checking the product and arranging delivery rather than manufacturing it myself.',
      highlights: [
        'Supplier sourcing and sample checks',
        'Import logistics and order fulfilment',
        'Storefront setup and customer support',
        'Currently paused',
      ],
      gallery: [
        `${basePath}images/photos/NukaColaRadio/1.webp`,
        `${basePath}images/photos/NukaColaRadio/2.webp`,
        `${basePath}images/photos/NukaColaRadio/3.webp`,
        `${basePath}images/photos/NukaColaRadio/4.webp`,
        `${basePath}images/photos/NukaColaRadio/5.webp`,
        `${basePath}images/photos/NukaColaRadio/6.webp`,
        `${basePath}images/photos/NukaColaRadio/NukaColaRadioSandRiver1080p.webp`,
        `${basePath}images/photos/NukaColaRadio/radio-image-1.webp`,
        `${basePath}images/photos/NukaColaRadio/radio-image-2.webp`,
        `${basePath}images/photos/NukaColaRadio/radio-image-3.webp`,
        `${basePath}images/photos/NukaColaRadio/radio-image-4.webp`,
        `${basePath}images/photos/NukaColaRadio/video_of_radio_production.mp4`,
      ],
      tags: [
        'E-commerce',
        'Sourcing',
        'Import/Export',
        'Retail',
        'Consumer Electronics',
      ],
      image: `${basePath}images/logos/NukaColaRadioLOGO.webp`,
      liveUrl: 'https://nukacolaradio.com',
      links: {
        website: 'https://nukacolaradio.com',
      },
      featured: true,
      priority: 6,
    },
    {
      slug: 'electric-dirt-bike-importing',
      title: 'Electric dirt bike importing',
      description:
        'Sourcing Sur-Ron and Talaria electric dirt bikes directly, importing them to Ireland and selling them after using them.',
      about:
        'A personal importing project involving a Sur-Ron Light Bee X and a Talaria Sting MX4.',
      longDescription:
        'I wanted to try the Sur-Ron Light Bee X and Talaria Sting MX4, but the local prices seemed high compared with the factory route. I contacted suppliers and compared the total cost of importing them myself.\n\nThe bikes I bought were Chinese-market versions, including a Chinese-language interface. After freight and importing costs, they came to close to half the local asking price for comparable bikes.\n\nI checked them over, rode them for a while and later sold them on. The project involved supplier communication, freight arrangements, landed-cost calculations and learning what differed between market versions.',
      highlights: [
        'Close to 50% below comparable local asking prices',
        'Sur-Ron Light Bee X and Talaria Sting MX4',
        'Supplier communication, freight and inspection',
        'Chinese-market versions with Chinese-language interfaces',
      ],
      tags: [
        'Direct Importing',
        'Electric Motorcycles',
        'China Sourcing',
        'Resale',
        'Supply Chain',
      ],
      priority: 7,
      caseStudy: {
        variant: 'supply-chain',
        eyebrow: 'Importing',
        title: 'Comparing the buying routes',
        introduction:
          'I compared the quoted factory route with the distribution route I had found for bikes sold locally.',
        steps: [
          {
            label: '01 / Built',
            title: 'Factory in China',
            description: 'Where the bikes were manufactured.',
          },
          {
            label: '02 / Distributed',
            title: 'European company',
            description: 'The first distributor in the route I found.',
          },
          {
            label: '03 / Rerouted',
            title: 'United States',
            description: 'A further distribution stop.',
          },
          {
            label: '04 / Returned',
            title: 'Europe again',
            description: 'Stock returned to Europe.',
          },
          {
            label: '05 / Sold',
            title: 'Irish retail',
            description: 'The final local sale.',
          },
        ],
        sections: [
          {
            eyebrow: 'Cost',
            title: 'Price after freight',
            body: 'I compared local asking prices with the cost of the bike, freight and importing. The direct route came to close to half the price for comparable bikes.',
            points: [
              'Factory price and freight quotes',
              'Landed-cost comparison',
              'Checks on the exact model and specification',
            ],
          },
          {
            eyebrow: 'Specification',
            title: 'Chinese-market versions',
            body: 'These versions had Chinese-language interfaces. I checked that difference before ordering and handled the setup and inspection myself.',
            points: [
              'Chinese-language interface',
              'Version checks before ordering',
              'Inspection on arrival',
            ],
          },
          {
            eyebrow: 'Use',
            title: 'Riding and resale',
            body: 'I bought the bikes for myself, used them for a while and then sold them. Riding them gave me time to learn the differences before resale.',
            points: [
              'Sur-Ron Light Bee X',
              'Talaria Sting MX4',
              'Used before selling',
            ],
          },
        ],
        closing: {
          label: 'What I learned',
          text: 'The landed cost and the market version both mattered. A lower purchase price only made sense once freight and setup were included.',
        },
      },
    },
    {
      slug: 'printbot',
      title: 'Printbot',
      description:
        'Software for finding 3D models, slicing print files and sending jobs to Bambu printers. Also includes a prototype queue for shop orders.',
      about:
        'A set of printing tools built around the repeated tasks of running several printers.',
      longDescription:
        'Printbot brings several printing tasks into one workflow. A request can be used to search Printables and Thingiverse, download a model, slice it with a saved profile and send it to a Bambu printer.\n\nThe printer connection uses FTPS for file uploads and MQTT for status and job control. There is a separate path for simple custom CAD parts, where dimensions, clearances and print orientation need to be specified.\n\nA string-art tool takes an image and produces a thread path, printable frame and job files. The shop-order prototype maps Shopify products to approved print files, then queues production and tracks stock.\n\nModel search, slicing and printer control are working. Custom CAD and shop-order production are still being developed.',
      highlights: [
        'Model search on Printables and Thingiverse',
        'Bambu Studio and OrcaSlicer profiles',
        'FTPS uploads and MQTT printer control',
        'Image-to-string-art files',
        'Shopify production queue prototype',
      ],
      tags: [
        '3D Printing',
        'Python',
        'Bambu Lab',
        'MQTT',
        'Shopify',
        'CAD Automation',
      ],
      priority: 8,
      caseStudy: {
        variant: 'system',
        eyebrow: 'Printing software',
        title: 'From model search to a print job',
        introduction:
          'The workflow connects model libraries, a slicer and the printer. Each stage keeps the job settings for the next one.',
        steps: [
          {
            label: '01 / Ask',
            title: 'Describe the part',
            description: 'Specify the part and any dimensions.',
            status: 'Working',
          },
          {
            label: '02 / Find or make',
            title: 'Retrieve or model',
            description:
              'Search model libraries, or use the developing CAD path.',
            status: 'Evolving',
          },
          {
            label: '03 / Prepare',
            title: 'Slice for the machine',
            description: 'Use a saved machine and material profile.',
            status: 'Working',
          },
          {
            label: '04 / Send',
            title: 'FTPS and MQTT',
            description:
              'Upload the file and check the printer before starting.',
            status: 'Working',
          },
          {
            label: '05 / Stay ahead',
            title: 'Forecast demand',
            description: 'Plan stock from shop orders and recent demand.',
            status: 'Prototype',
          },
        ],
        sections: [
          {
            eyebrow: 'Models',
            title: 'Search existing files',
            body: 'Printables and Thingiverse are searched together. Results can be chosen manually, or the highest-ranked model can be downloaded automatically.',
            points: [
              'Catalogue search',
              'Model ranking and download',
              'Manual or automatic selection',
            ],
          },
          {
            eyebrow: 'Custom parts',
            title: 'CAD development',
            body: 'The CAD path is for simple parts with specified dimensions. It also needs to account for clearances, wall thickness, orientation and supports. This part is still in development.',
            points: [
              'Fit and dimensions',
              'Orientation and supports',
              'Printer and material settings',
            ],
          },
          {
            eyebrow: 'String art',
            title: 'Image to thread path',
            body: 'An image and optional mask are used to calculate a thread path. The output includes a preview, frame STL and string G-code, which can be packaged for a Bambu printer.',
            points: [
              'Image and mask input',
              'Thread path and preview',
              'Frame STL and print files',
            ],
          },
          {
            eyebrow: 'Orders',
            title: 'Shop production prototype',
            body: 'Shopify products map to approved print files. Orders can create jobs in the queue, while recent demand is used to estimate how much stock to print. The controls include bed-clear checks, retries and printer status.',
            points: [
              'Product-to-file mapping',
              'Stock estimates',
              'Printer checks and retry handling',
            ],
          },
        ],
        closing: {
          label: 'Current status',
          text: 'The search, slicing and printer connection are working. Custom CAD and order-driven production are the parts I am developing next.',
        },
      },
    },
  ],
  skills: {
    showcases: [
      {
        title: 'Advertising & Paid Media',
        description:
          'Campaign setup, budgets and results tracking on Meta and TikTok for my shops.',
        images: [`${basePath}images/skills/ADs/MetaADS_Dashboard.webp`],
        tools: ['Meta Ads', 'TikTok Ads', 'Google Analytics', 'A/B Testing'],
      },
      {
        title: 'Social Media & Content',
        description:
          'Filming and editing product videos, mainly showing the printing process and finished parts.',
        images: [`${basePath}images/skills/ADs/TikTokDash.webp`],
        tools: ['TikTok', 'Instagram', 'Content Strategy', 'Video Editing'],
      },
      {
        title: 'Business & Logistics',
        description:
          'Pricing, postage, stock and customer support from running EirPost and ROF’s 3D.',
        images: [],
        tools: [
          'Excel',
          'P&L Management',
          'Pricing Strategy',
          'Customer Relations',
          'Supply Chain',
        ],
      },
      {
        title: '3D Printing & Manufacturing',
        description:
          'FDM and resin printing, from slicing and batch scheduling to finishing and packing.',
        images: [
          `${basePath}images/skills/3D Print/3DPrintBusinessLotsOfProducts.webp`,
          `${basePath}images/skills/3D Print/ParcelsOnTheFloorFor3DPrintBusiness.webp`,
        ],
        tools: [
          'FDM Printing',
          'Resin Printing',
          'CAD Design',
          'Slicing',
          'Post-Processing',
        ],
      },
      {
        title: '3D Modelling & Rendering',
        description:
          'Blender models and renders for product images and concept studies.',
        images: [
          `${basePath}images/skills/Blender/Screenshot-2026-03-07-134047.webp`,
          `${basePath}images/skills/Blender/Screenshot-2026-03-07-134055.webp`,
        ],
        tools: ['Blender', 'AutoCAD'],
      },
      {
        title: 'SolidWorks & Fusion 360',
        description:
          'Part modelling, assemblies, simulations and technical drawings in SolidWorks and Fusion 360.',
        images: [],
        tools: [
          'SolidWorks',
          'Fusion 360',
          'CAD',
          'FEA Simulation',
          'Technical Drawing',
        ],
      },
      {
        title: 'Electronics & Prototyping',
        description:
          'Wiring, soldering and small hardware projects using Arduino, Raspberry Pi and motor controllers.',
        images: [
          `${basePath}images/skills/Electronics and Soldering/EbikeMotorElectronics.webp`,
          `${basePath}images/skills/Electronics and Soldering/Ebike_Battery.webp`,
        ],
        tools: [
          'Arduino',
          'Raspberry Pi',
          'Soldering',
          'Circuit Design',
          'Sensors',
        ],
      },
      {
        title: 'Site Engineering',
        description:
          'Surveying, site checks and subcontractor follow-up during a summer placement with Walls Construction.',
        images: [
          `${basePath}images/skills/Construction Site/Construction_Site.webp`,
          `${basePath}images/skills/Construction Site/Construction_Site1.webp`,
        ],
        tools: [
          'Surveying',
          'Quality Assurance',
          'Safety Compliance',
          'AutoCAD',
        ],
      },
      {
        title: 'Software Development',
        description:
          'Websites, applications and automation scripts, mainly in Python and TypeScript.',
        images: [],
        tools: [
          'Python',
          'TypeScript',
          'JavaScript',
          'C',
          'C++',
          'Java',
          'React',
          'Next.js',
          'Flutter',
          'React Native',
        ],
      },
      {
        title: 'Cloud & Deployment',
        description:
          'Databases, hosting and deployment for my websites and applications.',
        images: [`${basePath}images/skills/Other/CloudDeploymentNew.webp`],
        tools: [
          'Supabase',
          'PostgreSQL',
          'MySQL',
          'Vercel',
          'Railway',
          'Docker',
          'AWS',
        ],
      },
      {
        title: 'AI & Automation',
        description:
          'Scripts and language-model APIs for data processing, research and routine administration.',
        images: [`${basePath}images/skills/Other/AiandAutomationNew.webp`],
        tools: [
          'ChatGPT',
          'Claude',
          'LLM APIs',
          'Prompt Engineering',
          'Workflow Automation',
        ],
      },
    ],
  },
  awards: [
    {
      title: 'UCD Entrance Scholar',
      issuer: 'University College Dublin',
      date: '2023',
      description:
        'Entrance scholarship following the 2023 Leaving Certificate.',
    },
  ],
}

// Site configuration
export const siteConfig = {
  title: `${cvData.person.name} - Portfolio`,
  description: `Mechanical engineering, projects and work by ${cvData.person.name}`,
  url: 'https://www.ruairioflaherty.ie',
  author: cvData.person.name,
  twitterHandle: undefined as string | undefined,
  keywords: [
    'portfolio',
    'mechanical engineering',
    'logistics',
    '3d printing',
    'web development',
    'business development',
    'dublin',
    'ireland',
    'ucd',
  ],
}

// Helper function to get featured projects
export const getFeaturedProjects = () => {
  return cvData.projects
    .filter(project => project.featured)
    .sort((a, b) => (a.priority || 999) - (b.priority || 999))
}

// Helper function to get all projects sorted by priority
export const getAllProjects = () => {
  return [...cvData.projects].sort(
    (a, b) => (a.priority || 999) - (b.priority || 999)
  )
}
