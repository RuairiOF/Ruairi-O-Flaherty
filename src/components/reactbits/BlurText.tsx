import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion, EASE_OUT_EXPO } from '@/lib/motion'

interface BlurTextProps {
  text: string
  className?: string
  /** Animate by word (default) or character */
  animateBy?: 'words' | 'chars'
  delay?: number
  /** Seconds per unit */
  duration?: number
  stagger?: number
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
}

/** ReactBits-style blur-in text reveal, triggered when scrolled into view. */
export default function BlurText({
  text,
  className = '',
  animateBy = 'words',
  delay = 0,
  duration = 0.7,
  stagger = 0.05,
  as: Tag = 'span',
}: BlurTextProps) {
  const ref = useRef<HTMLElement>(null)
  const units = animateBy === 'words' ? text.split(' ') : Array.from(text)

  useGSAP(
    () => {
      if (!ref.current) return
      const targets = ref.current.querySelectorAll('[data-blur-unit]')
      const reduced = prefersReducedMotion()
      gsap.fromTo(
        targets,
        reduced
          ? { opacity: 0 }
          : { opacity: 0, filter: 'blur(8px)', y: 12 },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: reduced ? 0.15 : duration,
          ease: EASE_OUT_EXPO,
          stagger: reduced ? 0 : stagger,
          delay,
          scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
        },
      )
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {units.map((unit, i) => (
        <span
          key={i}
          data-blur-unit
          aria-hidden="true"
          className="inline-block will-change-transform"
        >
          {unit === ' ' ? ' ' : unit}
          {animateBy === 'words' && i < units.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}
