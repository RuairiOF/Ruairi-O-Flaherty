import type { LucideIcon } from 'lucide-react'
import CountUp from '../reactbits/CountUp'
import { useRevealOnScroll } from '@/lib/motion'

export interface Stat {
  label: string
  value: number
  suffix?: string
  icon: LucideIcon
}

/** Glass tiles with scroll-triggered count-up numerals. */
export function StatStrip({ stats }: { stats: Stat[] }) {
  const ref = useRevealOnScroll({ y: 20, stagger: 0.09, targets: '[data-stat]' })

  return (
    <div ref={ref} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, suffix, icon: Icon }) => (
        <div key={label} data-stat className="glass-panel rounded-2xl p-5 sm:p-6">
          <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
          <p className="mt-4 flex items-baseline gap-0.5">
            <CountUp
              to={value}
              duration={1.4}
              className="font-display text-3xl font-semibold tabular-nums text-ink sm:text-4xl"
            />
            {suffix && (
              <span className="font-display text-2xl font-semibold text-accent-2">{suffix}</span>
            )}
          </p>
          <p className="eyebrow mt-2">{label}</p>
        </div>
      ))}
    </div>
  )
}
