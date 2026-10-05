import {
  ArrowRight,
  Bike,
  Boxes,
  Factory,
  Printer,
  Search,
  SlidersHorizontal,
  Store,
} from 'lucide-react'
import type { ProjectCaseStudy } from '../../types'

interface ProjectVisualProps {
  variant: ProjectCaseStudy['variant']
  compact?: boolean
}

const systemNodes = [
  { label: 'Find', icon: Search },
  { label: 'Slice', icon: SlidersHorizontal },
  { label: 'Send', icon: Printer },
  { label: 'Restock', icon: Boxes },
]

/**
 * A project-specific cover for case studies that are waiting on photography.
 * These are diagrams, not fake product imagery, so the page still feels honest.
 */
export default function ProjectVisual({
  variant,
  compact = false,
}: ProjectVisualProps) {
  if (variant === 'supply-chain') {
    return (
      <div
        aria-hidden="true"
        className="relative flex h-full w-full items-center overflow-hidden bg-surface-2/70"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_35%,rgb(var(--accent)/0.28),transparent_34%),radial-gradient(circle_at_80%_68%,rgb(var(--accent-2)/0.22),transparent_36%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgb(var(--line))_1px,transparent_1px),linear-gradient(90deg,rgb(var(--line))_1px,transparent_1px)] [background-size:42px_42px]" />

        <div
          className={
            'relative mx-auto w-full ' +
            (compact ? 'max-w-lg px-6' : 'max-w-5xl px-6 sm:px-10')
          }
        >
          <div className="flex items-center justify-between gap-4">
            <div className="glass-panel rounded-2xl p-4 sm:p-5">
              <Factory
                className="h-6 w-6 text-accent sm:h-8 sm:w-8"
                strokeWidth={1.6}
              />
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                Factory
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-ink sm:text-2xl">
                China
              </p>
            </div>

            <div className="flex min-w-0 flex-1 items-center">
              <span className="h-px flex-1 bg-gradient-to-r from-accent to-accent-2" />
              <Bike
                className="mx-3 h-8 w-8 shrink-0 text-ink sm:mx-6 sm:h-12 sm:w-12"
                strokeWidth={1.4}
              />
              <ArrowRight className="h-5 w-5 shrink-0 text-accent-2 sm:h-7 sm:w-7" />
              <span className="h-px flex-1 bg-accent-2" />
            </div>

            <div className="glass-panel rounded-2xl p-4 text-right sm:p-5">
              <Store
                className="ml-auto h-6 w-6 text-accent-2 sm:h-8 sm:w-8"
                strokeWidth={1.6}
              />
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                Direct
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-ink sm:text-2xl">
                Ireland
              </p>
            </div>
          </div>

          {!compact && (
            <div className="mt-7 flex items-end justify-between gap-4">
              <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
                Fewer handoffs. A Chinese-market interface. A price that finally
                made sense.
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                Sur-Ron / Talaria
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full items-center overflow-hidden bg-[#080b12]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgb(var(--accent)/0.32),transparent_42%),radial-gradient(circle_at_80%_100%,rgb(var(--accent-2)/0.18),transparent_38%)]" />
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgb(255_255_255/0.18)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div
        className={
          'relative mx-auto w-full ' +
          (compact ? 'max-w-xl px-5' : 'max-w-5xl px-6 sm:px-10')
        }
      >
        <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
          <span>printbot / pipeline</span>
          <span className="flex items-center gap-2 text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_currentColor]" />
            ready
          </span>
        </div>

        <div
          className={
            'grid gap-2.5 sm:gap-4 ' +
            (compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4')
          }
        >
          {systemNodes.map(({ label, icon: Icon }, index) => (
            <div
              key={label}
              className="relative rounded-xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur-md sm:p-5"
            >
              <div className="flex items-start justify-between">
                <Icon
                  className="h-5 w-5 text-cyan-300 sm:h-6 sm:w-6"
                  strokeWidth={1.6}
                />
                <span className="font-mono text-[9px] text-white/35">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="mt-4 font-display text-sm font-semibold text-white sm:text-lg">
                {label}
              </p>
              {!compact && (
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
                  job accepted
                </p>
              )}
            </div>
          ))}
        </div>

        {!compact && (
          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
              Shopify order
            </span>
            <ArrowRight className="h-4 w-4 text-violet-300" />
            <span className="text-right font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300">
              stock target met
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
