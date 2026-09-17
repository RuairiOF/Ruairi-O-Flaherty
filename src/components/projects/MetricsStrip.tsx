import { Check } from 'lucide-react'
import CountUp from '../reactbits/CountUp'
import { useRevealOnScroll } from '@/lib/motion'
import { parseHighlight, type MetricHighlight, type NoteHighlight } from './media'

interface MetricsStripProps {
  highlights: string[]
}

/** Numbers pulled out of the highlight copy, counted up; the rest as chips. */
export default function MetricsStrip({ highlights }: MetricsStripProps) {
  const ref = useRevealOnScroll<HTMLDivElement>({ targets: '[data-reveal]', y: 20, stagger: 0.06 })
  const parsed = highlights.map(parseHighlight)
  const metrics = parsed.filter((item): item is MetricHighlight => item.kind === 'metric')
  const notes = parsed.filter((item): item is NoteHighlight => item.kind === 'note')

  if (parsed.length === 0) return null

  return (
    <div ref={ref}>
      <h2 className="sr-only">Highlights</h2>

      {metrics.length > 0 && (
        <ul className="flex flex-wrap gap-4">
          {metrics.map((metric) => (
            <li
              key={metric.source}
              data-reveal
              className="glass-panel min-w-[13rem] flex-1 rounded-2xl p-5 sm:p-6"
            >
              <CountUp
                to={metric.value}
                decimals={metric.decimals}
                suffix={metric.suffix}
                className="gradient-text font-display text-4xl font-semibold tracking-tight sm:text-5xl"
              />
              <p className="mt-2 text-sm leading-snug text-ink-muted">{metric.label}</p>
            </li>
          ))}
        </ul>
      )}

      {notes.length > 0 && (
        <ul className={`flex flex-wrap gap-2 ${metrics.length > 0 ? 'mt-4' : ''}`}>
          {notes.map((note) => (
            <li
              key={note.label}
              data-reveal
              className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-ink"
            >
              <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-accent-2" />
              {note.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
