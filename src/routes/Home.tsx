import { Link } from 'react-router-dom'
import { ArrowRight, Download, MapPin } from 'lucide-react'
import { SEO } from '../components/SEO'
import { Section } from '../components/Section'
import { ProjectCard } from '../components/ProjectCard'
import { cvData, getFeaturedProjects } from '../content/cv'

export function Home() {
  const featuredProjects = getFeaturedProjects().slice(0, 3)

  return (
    <>
      <SEO 
        title="Home"
        description={`${cvData.person.name} - ${cvData.person.headline}`}
      />

      {/* Hero Section */}
      <Section className="pt-8 lg:pt-16" size="lg">
        <div className="text-center">
          <div className="animate-fade-in">
            <h1 className="heading-1 mb-6 text-gray-900 dark:text-white">
              Hi, I'm{' '}
              <span className="gradient-text">
                {cvData.person.name.split(' ')[0]}
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              {cvData.person.headline}
            </p>
            
            {cvData.person.location && !cvData.person.location.includes('[TODO') && (
              <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 mb-8">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{cvData.person.location}</span>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/projects"
                className="btn btn-primary btn-lg group"
              >
                View My Work
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <a
                href="/cv.json"
                download={`${cvData.person.name.replace(/\s+/g, '_')}_CV.json`}
                className="btn btn-secondary btn-lg"
              >
                <Download className="mr-2 h-5 w-5" />
                Download CV
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && !featuredProjects[0].title.includes('[TODO') && (
        <Section
          title="Featured Projects"
          description="A selection of recent work and side projects"
          centered
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/projects"
              className="btn btn-primary btn-md group"
            >
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Section>
      )}

      {/* Quick About */}
      <Section
        title="About"
        description="A bit about my background and what I do"
        centered
        className="bg-gray-50 dark:bg-gray-800/50"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Experience */}
            {cvData.experience.length > 0 && !cvData.experience[0].company.includes('[TODO') && (
              <div>
                <h3 className="heading-4 mb-4 text-gray-900 dark:text-white">
                  Experience
                </h3>
                <div className="space-y-4">
                  {cvData.experience.slice(0, 2).map((exp, index) => (
                    <div key={index} className="border-l-2 border-blue-500 pl-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {exp.role}
                      </h4>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">
                        {exp.company}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exp.dates}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {cvData.education.length > 0 && !cvData.education[0].institution.includes('[TODO') && (
              <div>
                <h3 className="heading-4 mb-4 text-gray-900 dark:text-white">
                  Education
                </h3>
                <div className="space-y-4">
                  {cvData.education.slice(0, 2).map((edu, index) => (
                    <div key={index} className="border-l-2 border-green-500 pl-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {edu.degree}
                      </h4>
                      <p className="text-green-600 dark:text-green-400 font-medium">
                        {edu.institution}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {edu.dates}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/about"
              className="btn btn-primary btn-md group"
            >
              Learn More About Me
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Section>

      {/* Contact CTA */}
      <Section
        title="Let's Work Together"
        description="I'm always interested in new opportunities and collaborations"
        centered
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <Link
              to="/contact"
              className="btn btn-primary btn-lg group"
            >
              Get In Touch
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}

