import { GraduationCap, Award, MapPin, Calendar } from 'lucide-react'
import { SEO } from '../components/SEO'
import { Section } from '../components/Section'
import { cvData } from '../content/cv'

export function Experience() {
  return (
    <>
      <SEO
        title="Experience"
        description={`Learn more about ${cvData.person.name} - background, experience, and skills`}
      />

      {/* Hero */}
      <Section
        title="Experience"
        description="My professional background, work experience, and educational journey"
        centered
      >
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg mx-auto text-center text-gray-600 dark:text-gray-300">
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
        <Section
          title="Work Experience"
          className="bg-gray-50 dark:bg-gray-800/50"
        >
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {cvData.experience.map((exp, index) => (
                <div
                  key={index}
                  className="card p-6 border-l-4 border-blue-500"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="heading-4 text-gray-900 dark:text-white mb-1">
                        {exp.role}
                      </h3>
                      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {exp.company}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 md:text-right">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">{exp.dates}</span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{exp.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {exp.technologies && exp.technologies.length > 0 && !exp.technologies[0].includes('[TODO') && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {exp.links && exp.links.patch && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <a
                        href={exp.links.patch}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                      >
                        View Patch Profile
                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Education */}
      {cvData.education.length > 0 && !cvData.education[0].institution.includes('[TODO') && (
        <Section title="Education">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {cvData.education.map((edu, index) => (
                <div
                  key={index}
                  className="card p-6 border-l-4 border-green-500"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start">
                      <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="heading-4 text-gray-900 dark:text-white mb-1">
                          {edu.degree}
                        </h3>
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                          {edu.institution}
                        </p>
                        {edu.details && (
                          <p className="text-gray-700 dark:text-gray-300">
                            {edu.details}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 md:text-right">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">{edu.dates}</span>
                      </div>
                      {edu.location && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
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
      {cvData.skills.categories.length > 0 && !cvData.skills.categories[0].items[0].includes('[TODO') && (
        <Section
          title="Skills"
          className="bg-gray-50 dark:bg-gray-800/50"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cvData.skills.categories.map((category, index) => (
                <div key={index} className="card p-6">
                  <h3 className="heading-4 text-gray-900 dark:text-white mb-4">
                    {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
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
                  <h3 className="heading-4 text-gray-900 dark:text-white mb-6">
                    Awards
                  </h3>
                  <div className="space-y-4">
                    {cvData.awards.map((award, index) => (
                      <div key={index} className="card p-4">
                        <div className="flex items-start">
                          <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-1 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {award.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {award.issuer} • {award.date}
                            </p>
                            {award.description && (
                              <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
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
                  <h3 className="heading-4 text-gray-900 dark:text-white mb-6">
                    Certificates
                  </h3>
                  <div className="space-y-4">
                    {cvData.certificates.map((cert, index) => (
                      <div key={index} className="card p-4">
                        <div className="flex items-start">
                          <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 mr-3 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {cert.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {cert.issuer} • {cert.date}
                            </p>
                            {cert.credentialUrl && (
                              <a
                                href={cert.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
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
