import { useMemo, useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/motion'

interface ScrollRevealProps {
  children: string
  className?: string
  /** Word opacity before reveal */
  baseOpacity?: number
  /** Blur px before reveal */
  blurStrength?: number
  as?: 'p' | 'h2' | 'h3' | 'div'
}

/**
 * ReactBits-style scroll-scrubbed paragraph: words sharpen and brighten as
 * the block moves through the viewport.
 */
export default function ScrollReveal({
  children,
  className = '',
  baseOpacity = 0.15,
  blurStrength = 4,
  as: Tag = 'p',
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const words = useMemo(() => children.split(' '), [children])

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const targets = el.querySelectorAll('[data-reveal-word]')
      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, filter: 'blur(0px)' })
        return
      }
      gsap.fromTo(
        targets,
        { opacity: baseOpacity, filter: `blur(${blurStrength}px)` },
        {
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 0.6,
          },
        },
      )
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref as never} className={className} aria-label={children}>
      {words.map((word, i) => (
        <span key={i} data-reveal-word aria-hidden="true" className="inline-block">
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}
