import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/motion'

interface CountUpProps {
  /** Final value */
  to: number
  from?: number
  /** Seconds */
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
  /** Locale-format the number (thousands separators) */
  separator?: boolean
}

/** ReactBits-style number count-up when scrolled into view. */
export default function CountUp({
  to,
  from = 0,
  duration = 1.6,
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0,
  separator = true,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  const format = (value: number) => {
    const fixed = value.toFixed(decimals)
    if (!separator) return fixed
    return Number(fixed).toLocaleString('en-IE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      if (prefersReducedMotion()) {
        el.textContent = `${prefix}${format(to)}${suffix}`
        return
      }
      const state = { value: from }
      gsap.to(state, {
        value: to,
        duration,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${format(state.value)}${suffix}`
        },
      })
    },
    { scope: ref },
  )

  return (
    <span ref={ref} className={className}>
      {prefix}
      {format(from)}
      {suffix}
    </span>
  )
}
