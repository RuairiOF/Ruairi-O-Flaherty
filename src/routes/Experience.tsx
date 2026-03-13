import { GraduationCap, Award, MapPin, Calendar } from 'lucide-react'
import { SEO } from '../components/SEO'
import { Section } from '../components/Section'
import { cvData } from '../content/cv'
import { getStaticSeoPage } from '../content/seo-pages'

export function Experience() {
  const seo = getStaticSeoPage('/experience')

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

      {/* Hero */}
      <Section
        title="Experience"
        description="My professional background, work experience, and educational journey"
        centered
        titleAs="h1"
      >
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg mx-auto text-center text-stone-600 dark:text-stone-300">
            <p>
              {cvData.person.headline.includes('[TODO')
                ? 'Professional summary will be populated from CV content.'
                : cvData.person.headline
              }
            </p>
          </div>
        </div>
      </Section>

      {/* Experience */}
      {cvData.experience.length > 0 && !cvData.experience[0].company.includes('[TODO') && (
        <section className="py-16 lg:py-24 px-4">
          <div className="max-w-[98%] mx-auto rounded-3xl bg-stone-100/60 dark:bg-white/[0.04] border border-stone-200/50 dark:border-white/[0.06] px-8 py-16 lg:px-16 lg:py-20 shadow-sm">
            <h2 className="heading-2 mb-12 text-stone-900 dark:text-white">Work Experience</h2>
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line - starts after first dot */}
                <div className="absolute left-8 top-8 bottom-0 w-0.5 bg-teal-500 dark:bg-teal-400"></div>

                <div className="space-y-8">
                  {cvData.experience.map((exp, index) => (
                    <div key={index} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute left-6 top-6 w-4 h-4 bg-teal-500 dark:bg-teal-400 rounded-full border-4 border-white dark:border-stone-900 shadow-lg"></div>

                      <div className="ml-16 card p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="heading-4 text-stone-900 dark:text-white mb-1">
                        {exp.role}
                      </h3>
                      <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                        {exp.company}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 md:text-right">
                      <div className="flex items-center text-stone-500 dark:text-stone-400 mb-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">{exp.dates}</span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center text-stone-500 dark:text-stone-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{exp.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-2 text-stone-700 dark:text-stone-300">
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="flex items-start">
                        <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {exp.technologies && exp.technologies.length > 0 && !exp.technologies[0].includes('[TODO') && (
                    <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-800 dark:bg-white/10 dark:text-stone-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {exp.links && (exp.links.patch || exp.links.website) && (
                    <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
                      {exp.links.website && (
                        <a
                          href={exp.links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-medium"
                        >
                          Visit Website
                          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      {exp.links.patch && (
                        <a
                          href={exp.links.patch}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-medium ${exp.links.website ? 'ml-6' : ''}`}
                        >
                          View Patch Profile
                          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </section>
      )}

      {/* Education */}
      {cvData.education.length > 0 && !cvData.education[0].institution.includes('[TODO') && (
        <Section title="Education">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {cvData.education.map((edu, index) => (
                <div
                  key={index}
                  className="card p-6 border-l-4 border-emerald-500"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start">
                      <GraduationCap className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="heading-4 text-stone-900 dark:text-white mb-1">
                          {edu.degree}
                        </h3>
                        <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                          {edu.institution}
                        </p>
                        {edu.details && (
                          <p className="text-stone-700 dark:text-stone-300">
                            {edu.details}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 md:text-right">
                      <div className="flex items-center text-stone-500 dark:text-stone-400 mb-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">{edu.dates}</span>
                      </div>
                      {edu.location && (
                        <div className="flex items-center text-stone-500 dark:text-stone-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{edu.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Skills */}
      {cvData.skills.showcases.length > 0 && (
        <section className="py-16 lg:py-24 px-4">
          <div className="max-w-[98%] mx-auto rounded-3xl bg-stone-100/60 dark:bg-white/[0.04] border border-stone-200/50 dark:border-white/[0.06] px-8 py-16 lg:px-16 lg:py-20 shadow-sm">
            <h2 className="heading-2 mb-12 text-stone-900 dark:text-white">Skills</h2>
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-3">
                {cvData.skills.showcases.map((showcase) =>
                  showcase.tools.map((tool) => (
                    <span
                      key={tool}
                      className="inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-white/10 border border-stone-200 dark:border-white/10 shadow-sm text-sm font-medium text-stone-800 dark:text-stone-200"
                    >
                      {tool}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Awards & Certificates */}
      {((cvData.awards && cvData.awards.length > 0 && !cvData.awards[0].title.includes('[TODO')) ||
        (cvData.certificates && cvData.certificates.length > 0 && !cvData.certificates[0].title.includes('[TODO'))) && (
        <Section title="Recognition">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Awards */}
              {cvData.awards && cvData.awards.length > 0 && !cvData.awards[0].title.includes('[TODO') && (
                <div>
                  <h3 className="heading-4 text-stone-900 dark:text-white mb-6">
                    Awards
                  </h3>
                  <div className="space-y-4">
                    {cvData.awards.map((award, index) => (
                      <div key={index} className="card p-4">
                        <div className="flex items-start">
                          <Award className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-1 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-stone-900 dark:text-white">
                              {award.title}
                            </h4>
                            <p className="text-stone-500 dark:text-stone-400 text-sm">
                              {award.issuer} &bull; {award.date}
                            </p>
                            {award.description && (
                              <p className="text-stone-700 dark:text-stone-300 text-sm mt-1">
                                {award.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificates */}
              {cvData.certificates && cvData.certificates.length > 0 && !cvData.certificates[0].title.includes('[TODO') && (
                <div>
                  <h3 className="heading-4 text-stone-900 dark:text-white mb-6">
                    Certificates
                  </h3>
                  <div className="space-y-4">
                    {cvData.certificates.map((cert, index) => (
                      <div key={index} className="card p-4">
                        <div className="flex items-start">
                          <GraduationCap className="h-5 w-5 text-teal-600 dark:text-teal-400 mt-1 mr-3 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-stone-900 dark:text-white">
                              {cert.title}
                            </h4>
                            <p className="text-stone-500 dark:text-stone-400 text-sm">
                              {cert.issuer} &bull; {cert.date}
                            </p>
                            {cert.credentialUrl && (
                              <a
                                href={cert.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 dark:text-teal-400 text-sm hover:underline"
                              >
                                View Credential
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Section>
      )}
    </>
  )
}
