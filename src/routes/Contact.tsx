import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, Github, Globe, Linkedin, Mail, Phone } from 'lucide-react'
import { SEO } from '../components/SEO'
import Magnet from '../components/reactbits/Magnet'
import SplitText from '../components/reactbits/SplitText'
import { cvData } from '../content/cv'
import { getStaticSeoPage } from '../content/seo-pages'
import { gsap, prefersReducedMotion } from '../lib/motion'

const TIME_FORMAT: Intl.DateTimeFormatOptions = {
  timeZone: 'Europe/Dublin',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZoneName: 'short',
}

/** "14:32 IST" in Dublin, whatever the visitor's own clock says. */
function useDublinTime() {
  const [time, setTime] = useState(() => new Intl.DateTimeFormat('en-IE', TIME_FORMAT).format())

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-IE', TIME_FORMAT)
    const tick = () => setTime(formatter.format())
    const id = window.setInterval(tick, 30_000)
    tick()
    return () => window.clearInterval(id)
  }, [])

  return time
}

export function Contact() {
  const seo = getStaticSeoPage('/contact')
  const { person } = cvData
  const dublinTime = useDublinTime()

  const [copied, setCopied] = useState(false)
  const labelRef = useRef<HTMLSpanElement>(null)
  const resetTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  useEffect(() => {
    if (!labelRef.current || prefersReducedMotion()) return
    gsap.fromTo(
      labelRef.current,
      { opacity: 0, y: copied ? 10 : -10, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.35, ease: 'expo.out' },
    )
  }, [copied])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(person.email)
    } catch {
      window.location.href = `mailto:${person.email}`
      return
    }
    setCopied(true)
    window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => setCopied(false), 2000)
  }

  const socials = [
    { name: 'GitHub', handle: 'RuairiOF', url: person.links.github ?? '', icon: Github },
    {
      name: 'LinkedIn',
      handle: 'in/ruairioflaherty',
      url: person.links.linkedin ?? '',
      icon: Linkedin,
    },
    { name: 'Website', handle: 'eirpost.ie', url: person.links.website ?? '', icon: Globe },
  ].filter((social) => social.url.length > 0 && !social.url.includes('[TODO'))

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

      <section className="section">
        <div className="shell">
          <header className="max-w-3xl">
            <p className="eyebrow mb-4">Contact</p>
            <h1 className="heading-1 text-ink">
              <SplitText
                text="Let's make"
                tag="span"
                splitType="chars"
                textAlign="left"
                delay={28}
                className="w-full"
              />
              <span className="block gradient-text animate-fade-in">something.</span>
            </h1>
            <p className="prose mt-6 text-lg">
              Open to internships, collaborations, and interesting problems &mdash; mechanical
              engineering, web builds, or anything that needs prototyping. The fastest way to reach
              me is email.
            </p>
          </header>

          {/* Email — click to copy */}
          <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Magnet padding={20} magnetStrength={0.25}>
              <button
                type="button"
                onClick={copyEmail}
                aria-label={`Copy email address ${person.email} to clipboard`}
                className="group flex items-center gap-4 rounded-2xl glass-panel px-5 py-4 text-left transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:shadow-[0_18px_48px_-14px_rgb(var(--glow)_/_0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:px-7 sm:py-5"
              >
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-base group-hover:bg-accent/20">
                  {copied ? (
                    <Check className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
                <span
                  ref={labelRef}
                  className="font-mono text-base text-ink sm:text-xl"
                  aria-hidden="true"
                >
                  {copied ? 'Copied ✓' : person.email}
                </span>
                <Copy
                  className="h-4 w-4 flex-none text-ink-muted opacity-0 transition-opacity duration-base group-hover:opacity-100"
                  aria-hidden="true"
                />
              </button>
            </Magnet>

            <div className="flex flex-col gap-1">
              <a href={`mailto:${person.email}`} className="btn btn-ghost btn-sm w-fit">
                <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                Open in mail app
              </a>
              {person.phone && !person.phone.includes('[TODO') && (
                <a href={`tel:${person.phone.replace(/\s+/g, '')}`} className="btn btn-ghost btn-sm w-fit">
                  <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                  {person.phone}
                </a>
              )}
            </div>
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {copied ? 'Email address copied to clipboard' : ''}
          </p>

          {/* Social tiles */}
          {socials.length > 0 && (
            <div className="mt-14">
              <p className="eyebrow mb-4">Elsewhere</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {socials.map((social) => {
                  const Icon = social.icon
                  return (
                    <Magnet key={social.name} className="w-full" padding={12} magnetStrength={0.2}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card card-hover group flex w-full items-center gap-4 p-5"
                      >
                        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-base group-hover:bg-accent/20">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-ink">{social.name}</span>
                          <span className="block truncate font-mono text-xs text-ink-muted">
                            {social.handle}
                          </span>
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 flex-none text-ink-muted transition-transform duration-base ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                          aria-hidden="true"
                        />
                      </a>
                    </Magnet>
                  )
                })}
              </div>
            </div>
          )}

          {/* Where + when */}
          <div className="mt-14 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line/10 pt-6 font-mono text-sm text-ink-muted">
            <span className="inline-flex h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            <span>
              {person.location} &mdash; {dublinTime}
            </span>
            <span aria-hidden="true">/</span>
            <span>Usually replies within a day</span>
          </div>
        </div>
      </section>
    </>
  )
}
