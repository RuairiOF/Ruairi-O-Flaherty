import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SEO } from '../components/SEO'
import { ProjectCard } from '../components/ProjectCard'
import StarBorder from '../components/StarBorder'
import SplitText from '../components/SplitText'
import FlowingMenu from '../components/FlowingMenu'
import { cvData, getFeaturedProjects } from '../content/cv'

const basePath = import.meta.env.BASE_URL || '/'

const menuItems = [
  { link: '/projects', text: 'Projects', image: `${basePath}images/skills/Electronics%20and%20Soldering/EbikeMotorElectronics.jpeg` },
  { link: '/experience', text: 'Experience', image: `${basePath}images/skills/Construction%20Site/Construction_Site.jpeg` },
  { link: '/skills', text: 'Skills', image: `${basePath}images/skills/Blender/Screenshot%202026-03-07%20134047.png` },
  { link: '/contact', text: 'Contact', image: `${basePath}images/photos/radios.jpeg` },
]

export function Home() {
  const featuredProjects = getFeaturedProjects().slice(0, 3)

  return (
    <>
      <SEO
        title="Home"
        description={`${cvData.person.name} - ${cvData.person.headline}`}
      />

      {/* Hero Section — full viewport, extends behind navbar */}
      <section className="relative -mt-20 flex min-h-[100svh] items-center overflow-hidden pb-10 pt-24">
        {/* Background image */}
        <img
          src={`${basePath}images/photos/split_landscape.jpeg`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover animate-[heroFadeIn_1.2s_ease-out_both]"
          style={{ objectPosition: 'center 25%' }}
        />

        {/* Gradient overlay — strong dark on left ~40%, fading to clear on right */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 100%)',
          }}
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.5) 45%, transparent 65%)',
          }}
        />

        {/* Text content — pinned to left ~2/5 of screen on desktop, wider on mobile */}
        <div className="relative z-10 w-full h-full flex items-center">
          <div className="w-full max-w-full md:max-w-[40%] px-4 sm:px-6 md:pl-[5vw] lg:pl-[7vw] space-y-4 sm:space-y-5">
            {/* Profile Picture */}
            <div className="h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 rounded-full overflow-hidden ring-2 ring-white/20 shadow-2xl">
              <img
                src={`${basePath}images/branding/ruairipfp.jpeg`}
                alt={cvData.person.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name */}
            <SplitText
              text={`Hey, I'm ${cvData.person.name.split(' ')[0]}.`}
              tag="h1"
              className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-none"
              delay={40}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 50 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="0px"
              textAlign="left"
            />

            {/* Headline */}
            <SplitText
              text={cvData.person.headline}
              tag="p"
              className="text-base sm:text-lg lg:text-xl text-white/60 font-light leading-relaxed"
              delay={30}
              duration={0.9}
              ease="power2.out"
              splitType="words"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="0px"
              textAlign="left"
            />

            {/* Location */}
            <p className="text-xs uppercase tracking-widest text-white/40">
              {cvData.person.location}
            </p>

            {/* CTA Buttons */}
            <div className="flex w-full flex-col sm:w-auto sm:flex-row items-stretch sm:items-start gap-3 pt-3">
              <StarBorder
                as={Link}
                to="/projects"
                color="#14b8a6"
                speed="5s"
                size="lg"
                className="group w-full sm:w-auto shadow-lg shadow-teal-900/25
                  [&_.inner-content]:w-full
                  [&_.inner-content]:min-h-[3.25rem]
                  [&_.inner-content]:justify-between
                  [&_.inner-content]:px-5
                  [&_.inner-content]:text-base
                  [&_.inner-content]:font-semibold
                  sm:[&_.inner-content]:text-lg"
              >
                View My Work
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </StarBorder>

              <Link
                to="/contact"
                className="btn btn-lg !rounded-full group backdrop-blur-sm
                  w-full sm:w-auto
                  min-h-[3.25rem]
                  justify-between
                  px-5
                  text-base sm:text-lg
                  font-semibold
                  border border-white/25
                  !bg-white/15
                  !text-white
                  hover:!bg-white/25
                  active:scale-[0.99]
                  shadow-lg shadow-black/20"
              >
                Get In Touch
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Flowing Menu Navigation — desktop only */}
      <section className="hidden md:block relative bg-stone-900">
        <div style={{ height: '500px', position: 'relative' }}>
          <FlowingMenu
            items={menuItems}
            speed={15}
            textColor="#e7e5e4"
            bgColor="transparent"
            marqueeBgColor="#14b8a6"
            marqueeTextColor="#ffffff"
            borderColor="rgba(255,255,255,0.1)"
          />
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-20 lg:py-28 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <SplitText
                text="Featured Projects"
                tag="h2"
                className="text-3xl lg:text-5xl font-bold text-stone-900 dark:text-white"
                delay={40}
                duration={0.8}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.2}
                rootMargin="-50px"
                textAlign="center"
              />
              <p className="mt-4 text-lg text-stone-500 dark:text-stone-400">
                A selection of recent work and side projects
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>

            <div className="text-center mt-12">
              <StarBorder
                as={Link}
                to="/projects"
                color="#14b8a6"
                speed="5s"
                size="lg"
                className="group"
              >
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </StarBorder>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-20 lg:py-28 px-4">
        <div className="max-w-[98%] mx-auto rounded-3xl bg-stone-100/60 dark:bg-white/[0.04] border border-stone-200/50 dark:border-white/[0.06] px-8 py-16 lg:px-16 lg:py-20 shadow-sm">
          <div className="text-center mb-16">
            <SplitText
              text="About Me"
              tag="h2"
              className="text-3xl lg:text-5xl font-bold text-stone-900 dark:text-white"
              delay={40}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="-50px"
              textAlign="center"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Experience */}
            <div>
              <h3 className="text-xl font-semibold text-stone-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-teal-500" />
                Experience
              </h3>
              <div className="space-y-5">
                {cvData.experience.slice(0, 3).map((exp, index) => (
                  <div key={index} className="group pl-4 border-l-2 border-stone-200 dark:border-white/10 hover:border-teal-500 dark:hover:border-teal-400 transition-colors">
                    <h4 className="font-semibold text-stone-900 dark:text-white">
                      {exp.role}
                    </h4>
                    <p className="text-teal-600 dark:text-teal-400 text-sm font-medium">
                      {exp.company}
                    </p>
                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                      {exp.dates}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-xl font-semibold text-stone-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-emerald-500" />
                Education
              </h3>
              <div className="space-y-5">
                {cvData.education.map((edu, index) => (
                  <div key={index} className="group pl-4 border-l-2 border-stone-200 dark:border-white/10 hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors">
                    <h4 className="font-semibold text-stone-900 dark:text-white">
                      {edu.degree}
                    </h4>
                    <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                      {edu.institution}
                    </p>
                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                      {edu.dates}
                    </p>
                    {edu.details && (
                      <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                        {edu.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <StarBorder
              as={Link}
              to="/experience"
              color="#14b8a6"
              speed="5s"
              size="lg"
              className="group"
            >
              Full Experience
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </StarBorder>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 lg:py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <SplitText
            text="Let's Work Together"
            tag="h2"
            className="text-3xl lg:text-5xl font-bold text-stone-900 dark:text-white"
            delay={40}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
            rootMargin="-50px"
            textAlign="center"
          />
          <p className="mt-4 mb-8 text-lg text-stone-500 dark:text-stone-400">
            I'm always interested in new opportunities and collaborations
          </p>
          <StarBorder
            as={Link}
            to="/contact"
            color="#14b8a6"
            speed="5s"
            size="lg"
            className="group"
          >
            Get In Touch
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </StarBorder>
        </div>
      </section>
    </>
  )
}
