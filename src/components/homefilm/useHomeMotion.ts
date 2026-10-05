import { useEffect, useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const all = <T extends Element = HTMLElement>(root: ParentNode, sel: string) =>
  Array.from(root.querySelectorAll<T>(sel)) as T[]

/**
 * Scroll reveals for the sections below the film: masked line rises for
 * headings, fades for copy, hairlines drawn across, plates wiped open, and
 * numbers that count up once.
 */
export function useHomeMotion(root: RefObject<HTMLElement>, enabled: boolean, key: unknown) {
  useLayoutEffect(() => {
    const el = root.current
    if (!el || !enabled) return
    let alive = true
    const fontsReady = Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((resolve) => window.setTimeout(resolve, 2500)),
    ])
    const ctx = gsap.context(() => {
      // Headings split into lines (and the footer name into letters) once the type has
      // loaded, so the breaks are measured in the real font. Until then they stay hidden.
      const lineTargets = all(el, '[data-lines]')
      const charTargets = all(el, '[data-chars]')
      gsap.set([...lineTargets, ...charTargets], { autoAlpha: 0 })
      const splitAll = () =>
        ctx.add(() => {
          lineTargets.forEach((target) => {
            SplitText.create(target, {
              type: 'lines',
              mask: 'lines',
              linesClass: 'rh-line',
              autoSplit: true,
              onSplit(self) {
                gsap.set(target, { autoAlpha: 1 })
                return gsap.from(self.lines, {
                  yPercent: 112,
                  duration: 1.25,
                  ease: 'expo.out',
                  stagger: 0.08,
                  scrollTrigger: { trigger: target, start: 'top 90%', once: true },
                })
              },
            })
          })
          charTargets.forEach((mark) => {
            SplitText.create(mark, {
              type: 'chars',
              mask: 'chars',
              charsClass: 'rh-char',
              autoSplit: true,
              onSplit(self) {
                gsap.set(mark, { autoAlpha: 1 })
                return gsap.from(self.chars, {
                  yPercent: 104,
                  duration: 1.5,
                  ease: 'expo.out',
                  stagger: 0.035,
                  scrollTrigger: { trigger: mark, start: 'top 96%', once: true },
                })
              },
            })
          })
        })
      fontsReady.then(() => {
        if (alive) splitAll()
      })

      // Fades: one trigger per element, staggered against its siblings. (ScrollTrigger.batch
      // holds its callback until the next scroll event, so a long jump left things hidden.)
      const reveals = all(el, '[data-reveal]')
      gsap.set(reveals, { opacity: 0, y: 26 })
      reveals.forEach((item) => {
        const siblings = item.parentElement ? all(item.parentElement, ':scope > [data-reveal]') : [item]
        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 1.15,
          ease: 'expo.out',
          delay: Math.max(0, siblings.indexOf(item)) * 0.07,
          scrollTrigger: { trigger: item, start: 'top 94%', once: true },
        })
      })

      all(el, '[data-rule]').forEach((rule) => {
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.6,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: rule.parentElement ?? rule, start: 'top 92%', once: true },
          },
        )
      })

      all(el, '[data-plate]').forEach((plate) => {
        const reveal = plate.querySelector('[data-plate-reveal]')
        const move = plate.querySelector('[data-plate-move]')
        if (!reveal || !move) return
        gsap
          .timeline({ scrollTrigger: { trigger: plate, start: 'top 88%', once: true } })
          .fromTo(reveal, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' })
          .fromTo(move, { scale: 1.3 }, { scale: 1, duration: 2.1, ease: 'expo.out' }, 0.2)

      })

      // insets drift against the main picture (on wide layouts, where they float over it)
      const wide = window.matchMedia('(min-width: 1101px)').matches
      all(el, wide ? '[data-inset]' : '[data-none]').forEach((inset) => {
        gsap.fromTo(
          inset,
          { y: 70 },
          {
            y: -70,
            ease: 'none',
            scrollTrigger: { trigger: inset.parentElement ?? inset, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })

      all(el, '[data-count]').forEach((num) => {
        const target = Number(num.dataset.count)
        const decimals = Number(num.dataset.decimals || 0)
        const prefix = num.dataset.prefix || ''
        const suffix = num.dataset.suffix || ''
        const fmt = new Intl.NumberFormat('en-IE', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
        // written from the data, not read back, so a second mount can't capture a half-counted value
        const final = `${prefix}${fmt.format(target)}${suffix}`
        const o = { v: 0 }
        num.textContent = `${prefix}${fmt.format(0)}${suffix}`
        gsap.to(o, {
          v: target,
          duration: 2,
          ease: 'expo.out',
          scrollTrigger: { trigger: num, start: 'top 94%', once: true },
          onUpdate: () => {
            num.textContent = `${prefix}${fmt.format(o.v)}${suffix}`
          },
          onComplete: () => {
            num.textContent = final
          },
        })
      })

      all(el, '.rh-spec__tools').forEach((list) => {
        const chips = all(list, '[data-chip]')
        gsap.fromTo(
          chips,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.03,
            scrollTrigger: { trigger: list, start: 'top 95%', once: true },
          },
        )
      })

    }, el)

    // the film section is very tall; once its height settles, re-measure
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => {
      alive = false
      window.clearTimeout(refresh)
      ctx.revert()
    }
  }, [root, enabled, key])
}

/**
 * Pointer details: a "View project" pill in place of the cursor over plates,
 * and a preview
 * that follows the cursor down the project index.
 */
export function useCursorFx(root: RefObject<HTMLElement>, key: unknown) {
  useEffect(() => {
    const el = root.current
    if (!el) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const pill = el.querySelector<HTMLElement>('[data-cursor-pill]')
    const pillLabel = el.querySelector<HTMLElement>('[data-cursor-label]')
    const peek = el.querySelector<HTMLElement>('[data-peek-box]')
    const peekImgs = all<HTMLImageElement>(el, '[data-peek-img]')
    if (!pill || !pillLabel) return

    el.classList.add('rh-cursor-ready')
    gsap.set(pill, { xPercent: -50, yPercent: -50, x: -200, y: -200, opacity: 0, scale: 0.5 })
    const pillX = gsap.quickTo(pill, 'x', { duration: 0.42, ease: 'power3' })
    const pillY = gsap.quickTo(pill, 'y', { duration: 0.42, ease: 'power3' })
    let peekX: ((v: number) => void) | null = null
    let peekY: ((v: number) => void) | null = null
    let peekR: ((v: number) => void) | null = null
    if (peek) {
      gsap.set(peek, { x: -600, y: -600, yPercent: -50, opacity: 0, scale: 0.86 })
      peekX = gsap.quickTo(peek, 'x', { duration: 0.75, ease: 'power3' })
      peekY = gsap.quickTo(peek, 'y', { duration: 0.75, ease: 'power3' })
      peekR = gsap.quickTo(peek, 'rotation', { duration: 0.9, ease: 'power3' })
    }

    let pillOn = false
    let peekIdx = -1
    let lastX = 0
    const showPill = (on: boolean, text?: string) => {
      if (text) pillLabel.textContent = text
      if (on === pillOn) return
      pillOn = on
      gsap.to(pill, {
        opacity: on ? 1 : 0,
        scale: on ? 1 : 0.5,
        duration: on ? 0.5 : 0.3,
        ease: on ? 'expo.out' : 'power2.out',
        overwrite: 'auto',
      })
    }
    const showPeek = (i: number, x: number, y: number) => {
      if (!peek || i === peekIdx) return
      const wasOff = peekIdx < 0
      peekIdx = i
      peekImgs.forEach((img) => img.classList.toggle('is-on', Number(img.dataset.peekImg) === i))
      if (i < 0) {
        gsap.to(peek, { opacity: 0, scale: 0.86, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
        return
      }
      if (wasOff) {
        const px = Math.min(x + 36, window.innerWidth - peek.offsetWidth - 20)
        gsap.set(peek, { x: px, y })
      }
      gsap.to(peek, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out', overwrite: 'auto' })
    }

    const onMove = (e: PointerEvent) => {
      const x = e.clientX
      const y = e.clientY
      pillX(x)
      pillY(y)
      const t = e.target as HTMLElement | null
      const target = t?.closest<HTMLElement>('[data-cursor]')
      showPill(!!target, target?.dataset.cursor)
      const row = t?.closest<HTMLElement>('[data-peek]')
      if (row && peek) {
        const i = Number(row.dataset.peek)
        showPeek(i, x, y)
        peekX?.(Math.min(x + 36, window.innerWidth - peek.offsetWidth - 20))
        peekY?.(y)
        peekR?.(Math.max(-4.5, Math.min(4.5, (x - lastX) * 0.35)))
      } else if (peekIdx >= 0) showPeek(-1, x, y)
      lastX = x
    }
    const onLeave = () => {
      showPill(false)
      showPeek(-1, 0, 0)
    }
    const onScroll = () => {
      if (pillOn || peekIdx >= 0) {
        const hovered = document.querySelectorAll(':hover')
        const last = hovered[hovered.length - 1] as HTMLElement | undefined
        if (!last?.closest('[data-cursor]')) showPill(false)
        if (!last?.closest('[data-peek]')) showPeek(-1, 0, 0)
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.classList.remove('rh-cursor-ready')
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', onScroll)
      gsap.killTweensOf([pill, peek])
    }
  }, [root, key])
}
