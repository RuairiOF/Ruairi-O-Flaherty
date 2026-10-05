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
  cyan: string
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
    desc: 'A shipping platform built on An Post that prints labels, fulfils orders and cuts postage for Irish businesses, from one-person Etsy shops to high-volume stores. It began as a bot that printed the labels for my own 3D-printing orders.',
    stats: [
      { value: 'Hundreds', label: 'Irish businesses use it' },
      { value: 'Up to 40%', count: 40, prefix: 'Up to ', suffix: '%', label: 'Lower shipping costs' },
    ],
    main: {
      cyan: home('eirpost-main-cyan.webp'),
      colour: home('eirpost-main.webp'),
      alt: 'A shop’s unfulfilled orders, ready for EirPost to fulfil',
      caption: 'A shop’s unfulfilled orders, and a label EirPost printed',
    },
    inset: {
      kind: 'label',
      cyan: home('eirpost-label-cyan.webp'),
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
    slug: 'laserlane',
    index: '02',
    title: 'LaserLane',
    role: 'Co-founder, now',
    desc: 'A green-laser visibility system for cyclists. It projects a lane onto the road beside the bike so drivers can see where the rider is before they pass. I work on the prototypes, the road testing and the launch.',
    facts: [
      ['Stage', 'Preparing the crowdfunding launch'],
      ['My part', 'Prototyping, road tests and launch operations'],
    ],
    main: {
      cyan: home('laserlane-main-cyan.webp'),
      colour: home('laserlane-main.webp'),
      alt: 'A LaserLane prototype projecting a green lane onto a road at night',
      caption: 'Prototype on the road at night, and its housing in CAD',
    },
    inset: {
      kind: 'wide',
      cyan: home('laserlane-cad-cyan.webp'),
      colour: home('laserlane-cad.webp'),
      alt: 'An exploded CAD model of the LaserLane housing',
      caption: 'Housing, exploded',
    },
    links: [
      { label: 'Read more', href: '/projects/laserlane' },
      { label: 'laserlane.ie', href: 'https://laserlane.ie', external: true },
    ],
    flipped: true,
  },
  {
    slug: 'rofs-3d',
    index: '03',
    title: 'ROF’s 3D',
    role: 'Founder',
    desc: 'A 3D-printing shop that grew from a hobby into a business: products designed in CAD, made on an eight-printer farm, then packed and shipped. Short videos were the main way customers found it.',
    stats: [
      { value: '1,000+', count: 1000, suffix: '+', label: 'Orders shipped' },
      { value: '€50k+', count: 50, prefix: '€', suffix: 'k+', label: 'Revenue' },
      { value: '4.8', count: 4.8, decimals: 1, label: 'Average rating out of 5' },
      { value: '28.5k', count: 28.5, decimals: 1, suffix: 'k', label: 'TikTok followers' },
    ],
    main: {
      cyan: home('rofs3d-main-cyan.webp'),
      colour: home('rofs3d-main.webp'),
      alt: 'A batch of printed domes on a 3D printer bed',
      caption: 'A batch off the printers, and a day’s orders packed',
    },
    inset: {
      kind: 'tall',
      cyan: home('rofs3d-parcels-cyan.webp'),
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
    index: '04',
    title: 'Cashew',
    desc: 'Built during the Patch accelerator at Dogpatch Labs, from the first user interviews to a demo-day product in one programme.',
    meta: 'Patch ’25',
    image: photo('Patch_baltyboys-w640.webp'),
  },
  {
    slug: 'sleeptracket100',
    index: '05',
    title: 'SleepTracker100',
    desc: 'A bedside Raspberry Pi that listens overnight to work out when you slept, and logs dreams by voice.',
    meta: 'Raspberry Pi, Python',
    image: photo('SleepTracker_Rasspberry_Pi/SleepTracker_Rasspberry_Pi_1-w640.webp'),
  },
  {
    slug: 'nukacolaradio',
    index: '06',
    title: 'Nukacola Radio',
    desc: 'A retro radio brand: sourcing, quality checks, importing and fulfilment. Rated 4.8 across 127 reviews.',
    meta: 'Consumer electronics',
    image: photo('NukaColaRadio/1-w640.webp'),
  },
  {
    slug: 'electric-dirt-bike-importing',
    index: '07',
    title: 'Electric dirt bike importing',
    desc: 'Traced why Chinese-built electric dirt bikes cost so much here, then bought direct for close to half the local price.',
    meta: 'Direct importing',
  },
  {
    slug: 'printbot',
    index: '08',
    title: 'Printbot',
    desc: 'Print-farm software that takes a plain-English request or a shop order through to a running printer.',
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
    what: 'Pricing, onboarding and day-to-day operations for hundreds of small businesses, and the reconciliation and cost work behind shipping savings of up to 40%.',
    place: 'Ireland',
  },
  {
    when: 'Summer 2025',
    where: 'Patch at Dogpatch Labs',
    role: 'Software and startup fellow',
    what: 'Selected for the accelerator. Built Cashew with a small team, ran the user testing and the backlog, and pitched it to mentors and investors.',
    place: 'Dublin',
  },
  {
    when: 'Summer 2024',
    where: 'Walls Construction',
    role: 'Site engineer',
    what: 'Surveying, quality checks and safety compliance on the UCD O’Connor Centre for Learning site, with weekly progress and safety reports.',
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
    what: 'Parts that have to be manufactured, drawings to make them from, and renders when something needs to look right before it exists.',
    tools: ['SolidWorks', 'Fusion 360', 'Blender', 'AutoCAD', 'FEA', 'Technical drawing'],
  },
  {
    index: '02',
    name: 'Make',
    what: 'Printing, wiring, soldering and assembling, then testing it and changing it again.',
    tools: ['FDM printing', 'Resin printing', 'Soldering', 'Arduino', 'Raspberry Pi', 'Sensors'],
  },
  {
    index: '03',
    name: 'Software',
    what: 'Whatever a project needs, from the website to the scripts and services that run the business behind it.',
    tools: ['Python', 'TypeScript', 'React', 'Next.js', 'Flutter', 'Supabase', 'Docker'],
  },
  {
    index: '04',
    name: 'Business',
    what: 'Pricing, shipping, paid ads, content and keeping the numbers right.',
    tools: ['Pricing', 'Logistics', 'Meta Ads', 'TikTok Ads', 'Content', 'P&L'],
  },
]

export const EDUCATION =
  'Mechanical engineering (BEng) at UCD, 2023 to now. UCD Entrance Scholar with 589 points in the Leaving Certificate, including H1s in Physics, DCG and Computer Science.'

export const CONTACT = {
  email: 'ruairioflaherty1@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ruairioflaherty/',
  github: 'https://github.com/RuairiOF',
}
