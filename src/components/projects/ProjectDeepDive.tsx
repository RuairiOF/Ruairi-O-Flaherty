import { ArrowRight, Check } from 'lucide-react'
import type { ProjectCaseStudy } from '../../types'
import Reveal from './Reveal'

interface ProjectDeepDiveProps {
  caseStudy: ProjectCaseStudy
}

export default function ProjectDeepDive({ caseStudy }: ProjectDeepDiveProps) {
  const isSystem = caseStudy.variant === 'system'

  return (
    <div>
      <Reveal>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-12">
          <div>
            <p className="eyebrow">{caseStudy.eyebrow}</p>
            <span
              aria-hidden="true"
              className="mt-4 hidden h-px w-12 bg-accent lg:block"
            />
          </div>
          <div className="max-w-3xl">
            <h2 className="heading-2 text-ink">{caseStudy.title}</h2>
            <p className="prose mt-5 text-lg">{caseStudy.introduction}</p>
          </div>
        </div>
      </Reveal>

      <Reveal y={28}>
        <div
          className={
            'relative mt-10 overflow-hidden rounded-3xl border p-4 sm:p-6 lg:p-8 ' +
            (isSystem
              ? 'border-cyan-300/15 bg-[#080b12] text-white'
              : 'border-line/10 bg-surface-2/45')
          }
        >
          <div
            aria-hidden="true"
            className={
              'pointer-events-none absolute inset-0 ' +
              (isSystem
                ? 'bg-[radial-gradient(circle_at_20%_10%,rgb(var(--accent)/0.25),transparent_36%),radial-gradient(circle_at_95%_90%,rgb(var(--accent-2)/0.16),transparent_35%)]'
                : 'bg-[radial-gradient(circle_at_0%_0%,rgb(var(--accent)/0.15),transparent_34%),radial-gradient(circle_at_100%_100%,rgb(var(--accent-2)/0.12),transparent_34%)]')
            }
          />

          <div className="relative grid gap-3 md:grid-cols-5">
            {caseStudy.steps.map((step, index) => (
              <div
                key={step.label}
                className={
                  'relative min-h-[10rem] rounded-2xl border p-4 ' +
                  (isSystem
                    ? 'border-white/10 bg-white/[0.055]'
                    : 'border-line/10 bg-surface/65')
                }
              >
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={
                      'font-mono text-[10px] uppercase tracking-[0.16em] ' +
                      (isSystem ? 'text-cyan-200/70' : 'text-accent')
                    }
                  >
                    {step.label}
                  </p>
                  {step.status && (
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-emerald-200">
                      {step.status}
                    </span>
                  )}
                </div>
                <h3
                  className={
                    'mt-5 font-display text-lg font-semibold ' +
                    (isSystem ? 'text-white' : 'text-ink')
                  }
                >
                  {step.title}
                </h3>
                <p
                  className={
                    'mt-2 text-sm leading-relaxed ' +
                    (isSystem ? 'text-white/55' : 'text-ink-muted')
                  }
                >
                  {step.description}
                </p>

                {index < caseStudy.steps.length - 1 && (
                  <span className="absolute -right-5 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line/10 bg-bg text-ink-muted md:flex">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <div
        className={
          'mt-8 grid gap-4 ' +
          (caseStudy.sections.length === 3
            ? 'lg:grid-cols-3'
            : 'md:grid-cols-2')
        }
      >
        {caseStudy.sections.map((section, index) => (
          <Reveal
            key={section.title}
            delay={Math.min(index * 0.05, 0.15)}
            y={24}
          >
            <article className="glass-panel h-full rounded-2xl p-6 sm:p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                {section.eyebrow}
              </p>
              <h3 className="heading-4 mt-3 text-ink">{section.title}</h3>
              <p className="prose mt-4 text-sm">{section.body}</p>
              {section.points && section.points.length > 0 && (
                <ul className="mt-5 space-y-2.5">
                  {section.points.map(point => (
                    <li
                      key={point}
                      className="flex gap-2.5 text-sm leading-relaxed text-ink-muted"
                    >
                      <Check
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent-2"
                        strokeWidth={2}
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </Reveal>
        ))}
      </div>

      {caseStudy.closing && (
        <Reveal y={20}>
          <aside className="relative mt-8 overflow-hidden rounded-2xl border border-accent/20 bg-accent/[0.07] px-6 py-7 sm:px-8">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-accent to-accent-2"
            />
            <p className="eyebrow text-accent">{caseStudy.closing.label}</p>
            <p className="mt-3 max-w-4xl text-lg leading-relaxed text-ink">
              {caseStudy.closing.text}
            </p>
          </aside>
        </Reveal>
      )}
    </div>
  )
}
