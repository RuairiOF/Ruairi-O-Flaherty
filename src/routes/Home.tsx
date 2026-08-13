import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { SEO } from '../components/SEO'
import SmartImage from '../components/SmartImage'
import StarBorder from '../components/reactbits/StarBorder'
import SplitText from '../components/reactbits/SplitText'
import FlowingMenu from '../components/reactbits/FlowingMenu'
import ScrollReveal from '../components/reactbits/ScrollReveal'
import ShinyText from '../components/reactbits/ShinyText'
import Magnet from '../components/reactbits/Magnet'
import SectionIntro from '../components/home/SectionIntro'
import VideoShowcase from '../components/home/VideoShowcase'
import FeaturedProjectCard from '../components/home/FeaturedProjectCard'
import { cvData, getFeaturedProjects } from '../content/cv'
import { getStaticSeoPage } from '../content/seo-pages'
import { EASE_OUT_EXPO, useRevealOnScroll } from '../lib/motion'

const basePath = import.meta.env.BASE_URL || '/'

// FlowingMenu paints its own <img>-less backgrounds, so these need the base prefix baked in.
const menuItems = [
  {
    link: '/projects',
    text: 'Projects',
    image: `${basePath}images/skills/Electronics%20and%20Soldering/EbikeMotorElectronics.webp`,
  },
  {
    link: '/experience',
    text: 'Experience',
    image: `${basePath}images/skills/Construction%20Site/Construction_Site.webp`,
  },
  {
    link: '/skills',
    text: 'Skills',
    image: `${basePath}images/skills/Blender/Screenshot-2026-03-07-134047.webp`,
  },
  {
    link: '/photos',
    text: 'Photos',
    image: `${basePath}images/photos/gallery/IMG_2600.webp`,
  },
  {
    link: '/contact',
    text: 'Contact',
    image: `${basePath}images/photos/radios.webp`,
  },
]

const ABOUT_TEXT =
  "I'm a mechanical engineering student at UCD who builds things end to end — the hardware, the software, and the business around them. A 3D-printing workshop that shipped a thousand orders, a logistics platform now used by hundreds of Irish SMEs, a laser visibility system for cyclists: I like problems that only get solved by making something real."

export function Home() {
  const featuredProjects = getFeaturedProjects().slice(0, 3)
  const seo = getStaticSeoPage('/')
  const firstName = cvData.person.name.split(' ')[0]
  const gridRef = useRevealOnScroll<HTMLDivElement>({
    targets: '[data-reveal-card]',
    y: 32,
  })
  const timelineRef = useRevealOnScroll<HTMLDivElement>({
    targets: '[data-reveal-item]',
    y: 20,
  })

  return (
    <>
      <SEO
        title={seo?.title}
        description={seo?.description}
        keywords={seo?.keywords}
        image={seo?.image}
        imageAlt={seo?.imageAlt}
        url={seo?.path}
        type={seo?.type}
        structuredData={seo?.structuredData}
      />

      {/* Hero — full viewport, extends behind the navbar (cancels its spacer) */}
      <section className="relative -mt-14 flex min-h-[100svh] items-center overflow-hidden pb-16 pt-24 sm:-mt-20 sm:pt-28">
        <SmartImage
          src="/images/photos/split_landscape.webp"
          alt={`${cvData.person.name} overlooking a construction site in Dublin`}
          sizes="100vw"
          priority
          className="absolute inset-0 h-full w-full object-cover motion-safe:animate-[heroFadeIn_1.2s_ease-out_both]"
          style={{ objectPosition: 'center 25%' }}
        />

        {/* Token-based scrims: readable text column on the left, image breathing on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/40 md:via-bg/70 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent" />

        <div className="relative z-10 w-full">
          <div className="shell-wide">
            <div className="glass-panel max-w-xl rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <SmartImage
                  src="/images/branding/ruairipfp.webp"
                  alt={cvData.person.name}
                  sizes="80px"
                  priority
                  className="h-14 w-14 rounded-full object-cover ring-1 ring-line/15 sm:h-16 sm:w-16"
                />
                <p className="eyebrow">
                  <ShinyText>{cvData.person.location}</ShinyText>
                </p>
              </div>

              <h1 className="heading-1 mt-6 text-ink">
                <SplitText
                  text="Hey, I'm"
                  tag="span"
                  className="block"
                  delay={35}
                  duration={0.9}
                  ease={EASE_OUT_EXPO}
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="0px"
                  textAlign="left"
                />
                <span
                  className="gradient-text block motion-safe:animate-fade-in"
                  style={{ animationDelay: '0.35s', animationFillMode: 'both' }}
                >
                  {firstName}.
                </span>
              </h1>

              <SplitText
                text={cvData.person.headline}
                tag="p"
                className="prose mt-4 text-base sm:text-lg"
                delay={25}
                duration={0.8}
                ease={EASE_OUT_EXPO}
                splitType="words"
                from={{ opacity: 0, y: 24 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="0px"
                textAlign="left"
              />

              <div className="flex w-full flex-col items-stretch gap-3 pt-7 sm:w-auto sm:flex-row sm:items-start">
                <StarBorder
                  as={Link}
                  to="/projects"
                  color="rgb(var(--accent))"
                  speed="5s"
                  size="lg"
                  className="group w-full sm:w-auto
                    [&_.inner-content]:min-h-[3.25rem]
                    [&_.inner-content]:w-full
                    [&_.inner-content]:justify-between
                    [&_.inner-content]:px-5
                    [&_.inner-content]:text-base
                    [&_.inner-content]:font-semibold"
                >
                  View my work
                  <ArrowUpRight
                    className="ml-2 h-5 w-5 transition-transform duration-base ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </StarBorder>

                <Link
                  to="/contact"
                  className="btn btn-secondary btn-lg group min-h-[3.25rem] w-full justify-between !rounded-full font-semibold sm:w-auto"
                >
                  Get in touch
                  <ArrowUpRight
                    className="ml-2 h-5 w-5 transition-transform duration-base ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden justify-center sm:flex">
          <span className="eyebrow flex items-center gap-3">
            <span className="h-8 w-px bg-gradient-to-b from-transparent to-accent motion-safe:animate-pulse" />
            Scroll
          </span>
        </div>
      </section>

      {/* Marquee navigation — desktop only */}
      <section
        aria-label="Section shortcuts"
        className="hidden bg-surface-2/60 md:block"
      >
        <div className="relative h-[26rem] lg:h-[32rem]">
          <FlowingMenu
            items={menuItems}
            speed={15}
            textColor="rgb(var(--ink))"
            bgColor="transparent"
            marqueeBgColor="rgb(var(--accent))"
            marqueeTextColor="rgb(var(--bg))"
            borderColor="rgb(var(--line) / 0.1)"
          />
        </div>
      </section>

      {/* Featured work */}
      {featuredProjects.length > 0 && (
        <section className="section">
          <div className="shell">
            <SectionIntro
              eyebrow="01 / Featured work"
              title="Selected projects"
              lead="Hardware, software, and the businesses built around them."
            />

            <div className="mt-10">
              <VideoShowcase />
            </div>

            <div
              ref={gridRef}
              className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {featuredProjects.map((project, index) => (
                <div key={project.slug} data-reveal-card className="h-full">
                  <FeaturedProjectCard project={project} index={index} />
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Magnet padding={20} magnetStrength={0.25}>
                <StarBorder
                  as={Link}
                  to="/projects"
                  color="rgb(var(--accent))"
                  speed="5s"
                  size="lg"
                  className="group"
                >
                  View all projects
                  <ArrowUpRight
                    className="ml-2 h-5 w-5 transition-transform duration-base ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </StarBorder>
              </Magnet>
            </div>
          </div>
        </section>
      )}

      {/* About */}
      <section className="section">
        <div className="shell">
          <div className="glass-panel rounded-3xl p-6 sm:p-10 lg:p-14">
            <SectionIntro
              eyebrow="02 / About"
              title="Engineer, maker, operator"
            />

            <ScrollReveal className="prose mt-6 max-w-3xl text-lg">
              {ABOUT_TEXT}
            </ScrollReveal>

            <div
              ref={timelineRef}
              className="mt-12 grid gap-10 md:grid-cols-2 lg:gap-16"
            >
              <div data-reveal-item>
                <h3 className="heading-4 mb-6 flex items-center gap-3 text-ink">
                  <span className="h-px w-8 bg-accent" aria-hidden="true" />
                  Experience
                </h3>
                <div className="space-y-5">
                  {cvData.experience.slice(0, 3).map(exp => (
                    <div
                      key={`${exp.company}-${exp.dates}`}
                      className="border-l border-line/10 pl-4 transition-colors duration-base hover:border-accent"
                    >
                      <h4 className="font-medium text-ink">{exp.role}</h4>
                      <p className="text-sm text-accent">{exp.company}</p>
                      <p className="mt-0.5 font-mono text-xs text-ink-muted">
                        {exp.dates}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div data-reveal-item>
                <h3 className="heading-4 mb-6 flex items-center gap-3 text-ink">
                  <span className="h-px w-8 bg-accent-2" aria-hidden="true" />
                  Education
                </h3>
                <div className="space-y-5">
                  {cvData.education.map(edu => (
                    <div
                      key={`${edu.institution}-${edu.dates}`}
                      className="border-l border-line/10 pl-4 transition-colors duration-base hover:border-accent-2"
                    >
                      <h4 className="font-medium text-ink">{edu.degree}</h4>
                      <p className="text-sm text-accent-2">{edu.institution}</p>
                      <p className="mt-0.5 font-mono text-xs text-ink-muted">
                        {edu.dates}
                      </p>
                      {edu.details && (
                        <p className="prose mt-1 text-sm">{edu.details}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <Link
                to="/experience"
                className="btn btn-secondary btn-md group !rounded-full"
              >
                Full experience
                <ArrowUpRight
                  className="ml-2 h-4 w-4 transition-transform duration-base ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section">
        <div className="shell">
          <div className="mx-auto max-w-2xl text-center">
            <SectionIntro
              eyebrow="03 / Contact"
              title="Let's build something"
              lead="I'm always interested in new opportunities and collaborations."
              align="center"
            />
            <div className="mt-8 flex justify-center">
              <Magnet padding={20} magnetStrength={0.25}>
                <StarBorder
                  as={Link}
                  to="/contact"
                  color="rgb(var(--accent))"
                  speed="5s"
                  size="lg"
                  className="group"
                >
                  Get in touch
                  <ArrowUpRight
                    className="ml-2 h-5 w-5 transition-transform duration-base ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </StarBorder>
              </Magnet>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
