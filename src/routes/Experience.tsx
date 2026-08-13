import { useMemo } from 'react'
import { Briefcase, CalendarClock, GraduationCap, Layers, Rocket } from 'lucide-react'
import { SEO } from '../components/SEO'
import BlurText from '../components/reactbits/BlurText'
import { StatStrip, type Stat } from '../components/experience/StatStrip'
import {
  Timeline,
  TimelineBullets,
  TimelineItem,
  TimelineLink,
  TimelineMeta,
  TimelineOrg,
  TimelineTags,
} from '../components/experience/Timeline'
import { Recognition } from '../components/experience/Recognition'
import { cvData } from '../content/cv'
import { getStaticSeoPage } from '../content/seo-pages'

const isReal = (value: string) => !value.includes('[TODO')

/** Earliest 4-digit year mentioned across the roles, e.g. "Summer 2022" -> 2022. */
function earliestYear(dates: string[]): number {
  const years = dates.flatMap((d) => (d.match(/\d{4}/g) ?? []).map(Number))
  return years.length > 0 ? Math.min(...years) : new Date().getFullYear()
}

export function Experience() {
  const seo = getStaticSeoPage('/experience')

  const experience = useMemo(
    () => cvData.experience.filter((entry) => isReal(entry.company)),
    [],
  )
  const education = useMemo(
    () => cvData.education.filter((entry) => isReal(entry.institution)),
    [],
  )
  const awards = useMemo(
    () => (cvData.awards ?? []).filter((award) => isReal(award.title)),
    [],
  )
  const certificates = useMemo(
    () => (cvData.certificates ?? []).filter((cert) => isReal(cert.title)),
    [],
  )

  const stats = useMemo<Stat[]>(() => {
    const since = earliestYear(experience.map((entry) => entry.dates))
    const yearsActive = Math.max(1, new Date().getFullYear() - since)
    return [
      { label: 'Years working', value: yearsActive, suffix: '+', icon: CalendarClock },
      { label: 'Roles held', value: experience.length, icon: Briefcase },
      { label: 'Ventures shipped', value: cvData.projects.length, icon: Rocket },
      { label: 'Skill areas', value: cvData.skills.showcases.length, icon: Layers },
    ]
  }, [experience])

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

      {/* Header + stats */}
      <header className="section-sm">
        <div className="shell">
          <p className="eyebrow">Career</p>
          <BlurText
            as="h1"
            text="Experience"
            className="heading-1 mt-3 block text-ink"
            animateBy="chars"
            stagger={0.03}
          />
          <p className="prose mt-5 max-w-2xl text-lg">
            Building companies while studying engineering — from construction sites and
            accelerators to logistics platforms I run myself. Here is the whole path, in order.
          </p>

          <div className="mt-10 sm:mt-12">
            <StatStrip stats={stats} />
          </div>
        </div>
      </header>

      {/* Work timeline */}
      {experience.length > 0 && (
        <section className="section-sm" aria-labelledby="work-heading">
          <div className="shell">
            <h2 id="work-heading" className="heading-2 text-ink">
              Work
            </h2>
            <p className="prose mt-3 max-w-xl">
              Five roles, each one closer to running things end to end.
            </p>

            <div className="mt-10">
              <Timeline>
                {experience.map((entry, index) => (
                  <TimelineItem key={`${entry.company}-${entry.dates}`}>
                    <TimelineMeta dates={entry.dates} index={index} />
                    <h3 className="heading-4 mt-3 text-ink">{entry.role}</h3>
                    <TimelineOrg name={entry.company} location={entry.location} />
                    <TimelineBullets bullets={entry.bullets} />
                    {entry.technologies && entry.technologies.length > 0 && isReal(entry.technologies[0]) && (
                      <TimelineTags tags={entry.technologies} />
                    )}
                    {(entry.links?.website || entry.links?.patch) && (
                      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line/10 pt-4">
                        {entry.links.website && (
                          <TimelineLink href={entry.links.website} label="Visit website" />
                        )}
                        {entry.links.patch && (
                          <TimelineLink href={entry.links.patch} label="Patch profile" />
                        )}
                      </div>
                    )}
                  </TimelineItem>
                ))}
              </Timeline>
            </div>
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="section-sm" aria-labelledby="education-heading">
          <div className="shell">
            <h2 id="education-heading" className="heading-2 text-ink">
              Education
            </h2>

            <div className="mt-10">
              <Timeline>
                {education.map((entry, index) => (
                  <TimelineItem key={entry.institution}>
                    <TimelineMeta dates={entry.dates} index={index} />
                    <h3 className="heading-4 mt-3 flex items-start gap-2.5 text-ink">
                      <GraduationCap className="mt-1 h-5 w-5 shrink-0 text-accent-2" aria-hidden="true" />
                      {entry.degree}
                    </h3>
                    <TimelineOrg name={entry.institution} location={entry.location} />
                    {entry.details && <p className="prose mt-4 text-sm sm:text-base">{entry.details}</p>}
                  </TimelineItem>
                ))}
              </Timeline>
            </div>
          </div>
        </section>
      )}

      {/* Recognition */}
      {(awards.length > 0 || certificates.length > 0) && (
        <section className="section-sm" aria-labelledby="recognition-heading">
          <div className="shell">
            <h2 id="recognition-heading" className="heading-2 text-ink">
              Recognition
            </h2>
            <div className="mt-10">
              <Recognition awards={awards} certificates={certificates} />
            </div>
          </div>
        </section>
      )}
    </>
  )
}
