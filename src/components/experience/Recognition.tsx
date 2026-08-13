import { Award as AwardIcon, BadgeCheck, ExternalLink } from 'lucide-react'
import type { Award, Certificate } from '@/types'
import { useRevealOnScroll } from '@/lib/motion'

interface RecognitionProps {
  awards: Award[]
  certificates: Certificate[]
}

/** The one place amber (`highlight`) is allowed: award + certificate badges. */
export function Recognition({ awards, certificates }: RecognitionProps) {
  const ref = useRevealOnScroll({ y: 24, stagger: 0.08, targets: '[data-badge]' })

  return (
    <div ref={ref} className="grid gap-4 md:grid-cols-2">
      {awards.map((award) => (
        <article
          key={award.title}
          data-badge
          className="glass-panel card-hover rounded-2xl border-highlight/30 p-6"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-highlight/30 bg-highlight/10">
              <AwardIcon className="h-5 w-5 text-highlight" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="eyebrow text-highlight">Award</p>
              <h3 className="heading-4 mt-1 text-ink">{award.title}</h3>
              <p className="mt-1 font-mono text-xs text-ink-muted">
                {award.issuer} · {award.date}
              </p>
              {award.description && <p className="prose mt-3 text-sm">{award.description}</p>}
            </div>
          </div>
        </article>
      ))}

      {certificates.map((cert) => (
        <article
          key={cert.title}
          data-badge
          className="glass-panel card-hover rounded-2xl border-highlight/30 p-6"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-highlight/30 bg-highlight/10">
              <BadgeCheck className="h-5 w-5 text-highlight" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="eyebrow text-highlight">Certificate</p>
              <h3 className="heading-4 mt-1 text-ink">{cert.title}</h3>
              <p className="mt-1 font-mono text-xs text-ink-muted">
                {cert.issuer} · {cert.date}
              </p>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors duration-fast hover:text-accent-2"
                >
                  View credential
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
