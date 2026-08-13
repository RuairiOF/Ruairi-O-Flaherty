import { useRef, type ReactNode } from 'react'
import { ArrowUpRight, Building2, MapPin } from 'lucide-react'
import { gsap, prefersReducedMotion, useGSAP, useRevealOnScroll } from '@/lib/motion'

/**
 * A single vertical spine that draws itself as the section is scrolled.
 * Children are `TimelineItem`s, which hang their own glowing node off the spine.
 */
export function Timeline({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const line = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const el = line.current
      if (!el) return
      if (prefersReducedMotion()) {
        gsap.set(el, { transformOrigin: 'top center', scaleY: 1 })
        return
      }
      gsap.fromTo(
        el,
        { transformOrigin: 'top center', scaleY: 0 },
        {
          transformOrigin: 'top center',
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 75%',
            end: 'bottom 70%',
            scrub: 0.4,
          },
        },
      )
    },
    { scope: root },
  )

  return (
    <div ref={root} className="relative pl-10 sm:pl-14">
      {/* Unlit rail */}
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-3 top-2 w-px bg-line/10 sm:left-5"
      />
      {/* Drawn rail */}
      <span
        ref={line}
        aria-hidden="true"
        className="absolute bottom-2 left-3 top-2 w-px origin-top bg-gradient-to-b from-accent via-accent to-accent-2 sm:left-5"
      />
      <ol className="space-y-5 sm:space-y-7">{children}</ol>
    </div>
  )
}

/** Glowing node + glass card, revealed on scroll. */
export function TimelineItem({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRevealOnScroll<HTMLLIElement>({ y: 28, duration: 0.7 })

  return (
    <li ref={ref} className="relative">
      <span
        aria-hidden="true"
        className="absolute left-[-1.75rem] top-7 h-3 w-3 -translate-x-1/2 rounded-full bg-gradient-to-br from-accent to-accent-2 ring-4 ring-bg shadow-[0_0_16px_rgb(var(--glow)/0.65)] sm:left-[-2.25rem]"
      />
      <article className={`card card-hover p-6 sm:p-7 ${className}`}>{children}</article>
    </li>
  )
}

/** Mono date range + index rule that heads every timeline card. */
export function TimelineMeta({ dates, index }: { dates: string; index: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent-2">{dates}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-line/10" />
      <span className="font-mono text-xs text-ink-muted">
        {String(index + 1).padStart(2, '0')}
      </span>
    </div>
  )
}

export function TimelineOrg({ name, location }: { name: string; location?: string }) {
  return (
    <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
      <span className="inline-flex items-center gap-1.5 font-medium text-ink">
        <Building2 className="h-4 w-4 text-accent" aria-hidden="true" />
        {name}
      </span>
      {location && (
        <span className="inline-flex items-center gap-1.5 text-ink-muted">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {location}
        </span>
      )}
    </p>
  )
}

export function TimelineBullets({ bullets }: { bullets: string[] }) {
  return (
    <ul className="prose mt-4 space-y-2 text-sm sm:text-base">
      {bullets.map((bullet) => (
        <li key={bullet} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-accent to-accent-2"
          />
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  )
}

export function TimelineTags({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-line/10 bg-line/[0.04] px-2.5 py-1 font-mono text-[11px] text-ink-muted"
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}

export function TimelineLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors duration-fast hover:text-accent-2"
    >
      {label}
      <ArrowUpRight
        className="h-4 w-4 transition-transform duration-base ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </a>
  )
}
