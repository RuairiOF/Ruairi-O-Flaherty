/** Homepage copy for the work, experience and tools sections. Longer write-ups live in content/cv.ts. */

const BASE = import.meta.env.BASE_URL || '/'
const home = (f: string) => `${BASE}images/home/${f}`
const photo = (f: string) => `${BASE}images/photos/${f}`

export interface Stat {
  label: string
  /** Shown as written unless count is set, in which case it counts up to it. */
  value: string
  count?: number
  decimals?: number
  prefix?: string
  suffix?: string
}

export interface Plate {
  colour: string
  alt: string
  caption: string
}

export interface CaseStudy {
  slug: string
  index: string
  title: string
  role: string
  desc: string
  stats?: Stat[]
  facts?: [string, string][]
  main: Plate
  inset: Plate & { kind: 'label' | 'tall' | 'wide' }
  links: { label: string; href: string; external?: boolean }[]
  flipped?: boolean
}

export const CASES: CaseStudy[] = [
  {
    slug: 'eirpost',
    index: '01',
    title: 'EirPost',
    role: 'Founder, 2025 to now',
    desc: 'An Post shipping labels and order fulfilment for Irish online shops. It started with a script to print labels for my own orders, then grew into a service other shops could use.',
    stats: [
      { value: 'Up to 40%', count: 40, prefix: 'Up to ', suffix: '%', label: 'Lower shipping costs' },
    ],
    main: {
      colour: home('eirpost-main.webp'),
      alt: 'A shop’s unfulfilled orders, ready for EirPost to fulfil',
      caption: 'Orders in EirPost, with a printed postage label',
    },
    inset: {
      kind: 'label',
      colour: home('eirpost-label.webp'),
      alt: 'An Express Post label printed by EirPost',
      caption: 'Express Post label',
    },
    links: [
      { label: 'Read more', href: '/projects/eirpost' },
      { label: 'eirpost.ie', href: 'https://eirpost.ie', external: true },
    ],
  },
  {
    slug: 'rofs-3d',
    index: '02',
    title: 'ROF’s 3D',
    role: 'Founder',
    desc: 'An online shop for 3D-printed products. I designed the parts, ran eight printers and packed the orders. Most customers found the shop through videos of the printing process.',
    stats: [
      { value: '1,000+', count: 1000, suffix: '+', label: 'Orders shipped' },
      { value: '€50k+', count: 50, prefix: '€', suffix: 'k+', label: 'Revenue' },
      { value: '4.8', count: 4.8, decimals: 1, label: 'Average rating out of 5' },
    ],
    main: {
      colour: home('rofs3d-main.webp'),
      alt: 'A batch of printed domes on a 3D printer bed',
      caption: 'Printed parts and packed orders',
    },
    inset: {
      kind: 'tall',
      colour: home('rofs3d-parcels.webp'),
      alt: 'A floor covered in packed orders ready to post',
      caption: 'A day’s orders, packed',
    },
    links: [
      { label: 'Read more', href: '/projects/rofs-3d' },
      { label: 'TikTok', href: 'https://www.tiktok.com/@rofs3d.com', external: true },
    ],
  },
]

export interface IndexRow {
  slug: string
  index: string
  title: string
  desc: string
  meta: string
  /** Preview that follows the cursor; rows without photos yet go without. */
  image?: string
}

export const MORE: IndexRow[] = [
  {
    slug: 'cashew',
    index: '03',
    title: 'Cashew',
    desc: 'A team project built during Patch at Dogpatch Labs.',
    meta: 'Patch ’25',
    image: photo('Patch_baltyboys-w640.webp'),
  },
  {
    slug: 'sleeptracket100',
    index: '04',
    title: 'SleepTracker100',
    desc: 'A Raspberry Pi experiment in sleep tracking and voice notes.',
    meta: 'Raspberry Pi, Python',
    image: photo('SleepTracker_Rasspberry_Pi/SleepTracker_Rasspberry_Pi_1-w640.webp'),
  },
  {
    slug: 'nukacolaradio',
    index: '05',
    title: 'Nukacola Radio',
    desc: 'A past project sourcing and selling retro Bluetooth radios.',
    meta: 'Consumer electronics',
    image: photo('NukaColaRadio/1-w640.webp'),
  },
  {
    slug: 'electric-dirt-bike-importing',
    index: '06',
    title: 'Electric dirt bike importing',
    desc: 'Buying Sur-Ron and Talaria bikes direct, riding them and selling them on.',
    meta: 'Direct importing',
  },
  {
    slug: 'printbot',
    index: '07',
    title: 'Printbot',
    desc: 'Software for finding models, preparing print files and managing a printer queue.',
    meta: 'Python, Bambu Lab',
  },
]

export interface Role {
  when: string
  where: string
  role: string
  what: string
  place: string
}

export const ROLES: Role[] = [
  {
    when: '2025 to now',
    where: 'EirPost',
    role: 'Founder and operations lead',
    what: 'Building the service, setting postage prices, helping customers and checking shipping accounts.',
    place: 'Ireland',
  },
  {
    when: 'Summer 2025',
    where: 'Patch at Dogpatch Labs',
    role: 'Software and startup fellow',
    what: 'Worked on Cashew with a small team, interviewed users and presented the project at demo day.',
    place: 'Dublin',
  },
  {
    when: 'Summer 2024',
    where: 'Walls Construction',
    role: 'Site engineer',
    what: 'Surveying, site checks and weekly reports on the UCD O’Connor Centre for Learning construction site.',
    place: 'Dublin',
  },
]

export interface Discipline {
  index: string
  name: string
  what: string
  tools: string[]
}

export const DISCIPLINES: Discipline[] = [
  {
    index: '01',
    name: 'Design',
    what: 'Part models, assemblies, technical drawings and product renders.',
    tools: ['SolidWorks', 'Fusion 360', 'Blender', 'AutoCAD', 'FEA', 'Technical drawing'],
  },
  {
    index: '02',
    name: 'Make',
    what: 'Printed parts, small circuits and prototype assembly.',
    tools: ['FDM printing', 'Resin printing', 'Soldering', 'Arduino', 'Raspberry Pi', 'Sensors'],
  },
  {
    index: '03',
    name: 'Software',
    what: 'Websites, small applications and scripts for repetitive jobs.',
    tools: ['Python', 'TypeScript', 'React', 'Next.js', 'Flutter', 'Supabase', 'Docker'],
  },
  {
    index: '03',
    name: 'Business',
    what: 'Postage, stock, pricing, customer support and accounts.',
    tools: ['Pricing', 'Logistics', 'Meta Ads', 'TikTok Ads', 'Content', 'P&L'],
  },
]

export const EDUCATION =
  'Mechanical engineering (BEng), University College Dublin, 2023 to present.'

export const CONTACT = {
  email: 'ruairioflaherty1@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ruairioflaherty/',
  github: 'https://github.com/RuairiOF',
}
