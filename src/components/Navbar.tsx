import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import SmartImage from './SmartImage'
import Magnet from './reactbits/Magnet'
import { useFocusTrap, useScrollLock } from './Lightbox'
import { EASE_OUT_EXPO, gsap, prefersReducedMotion } from '../lib/motion'
import { cn } from '../lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Experience', href: '/experience' },
  { name: 'Skills', href: '/skills' },
  { name: 'Photos', href: '/photos' },
]

const contactLink = { name: 'Contact', href: '/contact' }

/** Scroll distance (px) after which the pill condenses. */
const CONDENSE_AT = 40

function matchesPath(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [condensed, setCondensed] = useState(false)
  const location = useLocation()

  const listRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>())
  const overlayRef = useRef<HTMLDivElement>(null)
  const hasMoved = useRef(false)

  useScrollLock(isOpen)
  useFocusTrap(overlayRef, isOpen)

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Scroll-aware condensing
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > CONDENSE_AT)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /** Slides the active-route pill under the current link. */
  const moveIndicator = useCallback(
    (animate: boolean) => {
      const indicator = indicatorRef.current
      if (!indicator || !listRef.current) return

      const active = navigation.find(item =>
        matchesPath(location.pathname, item.href)
      )
      const el = active ? linkRefs.current.get(active.href) : undefined
      const duration = animate && !prefersReducedMotion() ? 0.45 : 0

      if (!el) {
        gsap.to(indicator, { opacity: 0, duration, ease: EASE_OUT_EXPO })
        return
      }

      gsap.to(indicator, {
        x: el.offsetLeft,
        width: el.offsetWidth,
        opacity: 1,
        duration,
        ease: EASE_OUT_EXPO,
      })
    },
    [location.pathname]
  )

  useEffect(() => {
    moveIndicator(hasMoved.current)
    hasMoved.current = true
    // Re-measure once web fonts settle, otherwise the pill lands on pre-swap widths
    const raf = requestAnimationFrame(() => moveIndicator(false))
    document.fonts?.ready.then(() => moveIndicator(false)).catch(() => {})
    return () => cancelAnimationFrame(raf)
  }, [moveIndicator, condensed])

  useEffect(() => {
    const onResize = () => moveIndicator(false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [moveIndicator])

  // Esc closes the mobile menu
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  // Staggered entrance for the overlay links
  useEffect(() => {
    if (!isOpen || !overlayRef.current) return
    const items = overlayRef.current.querySelectorAll('[data-menu-item]')
    const reduced = prefersReducedMotion()
    const ctx = gsap.context(() => {
      gsap.fromTo(items, reduced ? { opacity: 0 } : { opacity: 0, y: 28 }, {
        opacity: 1,
        y: 0,
        duration: reduced ? 0.15 : 0.55,
        ease: EASE_OUT_EXPO,
        stagger: reduced ? 0 : 0.06,
      })
    }, overlayRef)
    return () => ctx.revert()
  }, [isOpen])

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-2 pt-2 sm:pt-4">
        <nav
          aria-label="Primary"
          className={cn(
            'glass-nav flex w-full items-center gap-2 rounded-full transition-all duration-base ease-out-expo',
            'sm:w-auto',
            condensed
              ? 'px-2.5 py-1.5 sm:px-4 sm:py-2 border-line/20 shadow-lg shadow-glow/10'
              : 'px-3 py-2 sm:px-6 sm:py-3 shadow-md shadow-glow/5'
          )}
        >
          <Link
            to="/"
            className="group flex shrink-0 items-center"
            aria-label="Home"
          >
            <SmartImage
              src="/images/branding/Main_Logo.webp"
              alt="Ruairí O'Flaherty"
              sizes="120px"
              priority
              className={cn(
                'w-auto object-contain transition-all duration-base ease-out-expo group-hover:scale-105',
                condensed ? 'h-6 sm:h-7' : 'h-6 sm:h-8'
              )}
            />
          </Link>

          {/* Desktop links with a sliding active indicator */}
          <div
            ref={listRef}
            className="relative ml-2 hidden items-center md:flex"
          >
            <span
              ref={indicatorRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-accent/15 opacity-0 ring-1 ring-accent/30"
            />
            {navigation.map(item => {
              const active = matchesPath(location.pathname, item.href)
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  ref={el => {
                    if (el) linkRefs.current.set(item.href, el)
                    else linkRefs.current.delete(item.href)
                  }}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative z-10 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-fast',
                    active ? 'text-accent' : 'text-ink-muted hover:text-ink'
                  )}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <ThemeToggle />

            <div className="hidden md:block">
              <Magnet padding={14} magnetStrength={0.3}>
                <Link
                  to={contactLink.href}
                  aria-current={
                    matchesPath(location.pathname, contactLink.href)
                      ? 'page'
                      : undefined
                  }
                  className="btn btn-primary btn-sm !rounded-full gap-1"
                >
                  {contactLink.name}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Magnet>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(open => !open)}
              className="btn btn-ghost btn-sm !rounded-full !p-2 md:hidden"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile full-screen menu */}
      {isOpen && (
        <div
          ref={overlayRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="glass-overlay fixed inset-0 z-[60] flex flex-col bg-bg/90 md:hidden"
        >
          <div className="flex items-center justify-between px-5 pt-4">
            <span className="eyebrow">Menu</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn btn-ghost btn-sm !rounded-full !p-2"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav
            aria-label="Mobile"
            className="flex flex-1 flex-col justify-center gap-1 px-5"
          >
            {[...navigation, contactLink].map((item, i) => {
              const active = matchesPath(location.pathname, item.href)
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  data-menu-item
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group flex items-baseline gap-4 rounded-2xl px-3 py-3 transition-colors duration-fast',
                    active ? 'text-accent' : 'text-ink hover:text-accent'
                  )}
                >
                  <span className="font-mono text-xs text-ink-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="heading-3">{item.name}</span>
                  <ArrowUpRight
                    className="ml-auto h-5 w-5 shrink-0 self-center text-ink-muted transition-transform duration-base ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              )
            })}
          </nav>

          <div data-menu-item className="border-t border-line/10 px-8 py-6">
            <p className="eyebrow">Dublin, Ireland</p>
          </div>
        </div>
      )}

      {/* Spacer — Home cancels this with a matching negative margin for its full-bleed hero */}
      <div className="h-14 sm:h-20" />
    </>
  )
}
