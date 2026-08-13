import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Shared motion vocabulary — matches the CSS tokens in styles/index.css */
export const EASE_OUT_EXPO = 'expo.out'
export const EASE_SPRING = 'back.out(1.4)'
export const DUR_FAST = 0.15
export const DUR_BASE = 0.3
export const DUR_SLOW = 0.6

const QUERY = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(QUERY).matches
}

/** Reactive prefers-reduced-motion. All ambient/decorative motion must gate on this. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

interface RevealOptions {
  /** Vertical offset in px before reveal (default 24) */
  y?: number
  /** Seconds (default DUR_SLOW) */
  duration?: number
  /** Stagger between children matching `stagger` selector, seconds */
  stagger?: number
  /** Child selector to stagger; when omitted the container itself animates */
  targets?: string
  delay?: number
}

/**
 * Fade-and-rise entrance when the element scrolls into view.
 * Collapses to a fast opacity fade under reduced motion.
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {},
) {
  const ref = useRef<T>(null)
  const { y = 24, duration = DUR_SLOW, stagger = 0.08, targets, delay = 0 } = options

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const items: gsap.TweenTarget = targets ? el.querySelectorAll(targets) : el
      const reduced = prefersReducedMotion()

      gsap.fromTo(
        items,
        reduced ? { opacity: 0 } : { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: reduced ? DUR_FAST : duration,
          ease: EASE_OUT_EXPO,
          stagger: reduced ? 0 : stagger,
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        },
      )
    },
    { scope: ref },
  )

  return ref
}

export { gsap, ScrollTrigger, useGSAP }
