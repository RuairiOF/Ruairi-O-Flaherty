import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

/**
 * Programmatic scroll for in-page links. Long jumps across the film run it
 * forwards or backwards at speed rather than cutting, so the duration grows
 * a little with distance.
 */
export function scrollToY(y: number) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const target = Math.max(0, Math.round(y))
  if (reduce) {
    window.scrollTo(0, target)
    return
  }
  const screens = Math.abs(target - window.scrollY) / Math.max(1, window.innerHeight)
  gsap.to(window, {
    scrollTo: { y: target, autoKill: true },
    duration: Math.min(2.6, 0.9 + screens * 0.11),
    ease: 'expo.inOut',
    overwrite: true,
  })
}

export function scrollToElement(el: Element | null, offset = 0) {
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  scrollToY(top)
}
