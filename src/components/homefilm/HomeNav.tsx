import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFilmNav } from './navTone'
import { scrollToElement, scrollToY } from './scroll'
import { useDublinTime } from './useDublinTime'

const LINKS: { label: string; href: string }[] = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Photos', href: '/photos' },
  { label: 'Contact', href: '#contact' },
]

function Roll({ children }: { children: string }) {
  return (
    <>
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </>
  )
}

/**
 * Navigation for the homepage. Over the film it takes its colour from the
 * picture; over the sections it reads data-nav-tone and tucks away while the
 * reader scrolls down, coming back on the way up.
 */
export function HomeNav({ film }: { film: boolean }) {
  const filmState = useFilmNav()
  const time = useDublinTime()
  const [overFilm, setOverFilm] = useState(film)
  const [sectionTone, setSectionTone] = useState<'ink' | 'light'>('ink')
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    let raf = 0
    // Section edges in page coordinates, measured when the layout changes rather
    // than on every scroll frame, so scrolling never forces a layout.
    let filmTop = 0
    let filmEnd = -1
    let toneSections: { top: number; bottom: number; tone: 'ink' | 'light' }[] = []
    const measure = () => {
      const y = window.scrollY
      const filmEl = film ? document.querySelector<HTMLElement>('[data-nav-section="film"]') : null
      if (filmEl) {
        const r = filmEl.getBoundingClientRect()
        filmTop = r.top + y
        // the pinned stage leaves the top of the screen one screen before the section ends
        filmEnd = r.bottom + y - window.innerHeight
      } else filmEnd = -1
      toneSections = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-tone]')).map((el) => {
        const r = el.getBoundingClientRect()
        return { top: r.top + y, bottom: r.bottom + y, tone: el.dataset.navTone === 'light' ? 'light' : 'ink' }
      })
    }
    const update = () => {
      raf = 0
      const y = window.scrollY
      const probe = y + 36
      const onFilm = filmEnd > 0 && y >= filmTop - 36 && y < filmEnd + 36
      setOverFilm(onFilm)
      if (!onFilm) {
        let tone: 'ink' | 'light' = 'ink'
        for (const s of toneSections) if (probe >= s.top && probe < s.bottom) tone = s.tone
        setSectionTone(tone)
      }
      const past = !onFilm && y > (film ? 200 : window.innerHeight * 0.6)
      setSolid(past)
      if (past && y > lastY + 4) setHidden(true)
      else if (y < lastY - 4 || !past) setHidden(false)
      lastY = y
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const onLayout = () => {
      measure()
      onScroll()
    }
    measure()
    update()
    const ro = new ResizeObserver(onLayout)
    ro.observe(document.body)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onLayout)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onLayout)
    }
  }, [film])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [menuOpen])

  const overPicture = overFilm && !menuOpen
  const tone = menuOpen ? 'light' : overPicture ? filmState.tone : sectionTone
  const linksTone = menuOpen ? 'light' : overPicture ? filmState.linksTone : sectionTone
  const clockTone = menuOpen ? 'light' : overPicture ? filmState.clockTone : sectionTone
  const showWordmark = !film || !overFilm || !filmState.hero
  const ready = !film || filmState.ready

  const onAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(href)
    scrollToElement(el)
    history.replaceState(null, '', href)
  }

  const classes = [
    'rh-nav',
    showWordmark ? '' : 'has-hero',
    solid && !menuOpen ? 'is-solid' : '',
    hidden && !menuOpen ? 'is-hidden' : '',
    overPicture ? 'is-film' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const bg = sectionTone === 'light' ? 'var(--cobalt)' : 'var(--paper)'

  return (
    <>
      <header
        className={classes}
        data-tone={tone}
        style={
          {
            '--nav-bg': bg,
            '--nav-rule': sectionTone === 'light' ? 'rgb(255 255 255 / 0.14)' : 'rgb(10 22 49 / 0.08)',
            opacity: ready ? 1 : 0,
            transition: 'opacity 1s var(--ease), transform 0.6s var(--ease), color 0.5s var(--ease)',
          } as React.CSSProperties
        }
      >
        <Link
          to="/"
          className="rh-wordmark"
          aria-label="Ruairí O’Flaherty, home"
          onClick={(e) => {
            setMenuOpen(false)
            e.preventDefault()
            scrollToY(0)
          }}
        >
          <span>Ruairí O’Flaherty</span>
        </Link>

        <nav aria-label="Primary" data-tone={linksTone}>
          <ul className="rh-nav__links">
            {LINKS.map((l) => (
              <li key={l.label}>
                {l.href.startsWith('#') ? (
                  <a href={l.href} className="rh-roll" onClick={(e) => onAnchor(e, l.href)}>
                    <Roll>{l.label}</Roll>
                  </a>
                ) : (
                  <Link to={l.href} className="rh-roll">
                    <Roll>{l.label}</Roll>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <p
          className="rh-nav__clock"
          data-tone={clockTone}
          style={{
            opacity: overFilm && filmState.quietRight ? 0 : 1,
            transition: 'opacity 0.5s var(--ease)',
          }}
        >
          <span>Dublin</span>
          <span className="rh-mono">{time}</span>
        </p>

        <button
          type="button"
          className="rh-nav__menu"
          aria-expanded={menuOpen}
          aria-controls="rh-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? 'Close' : 'Menu'}
          <i aria-hidden="true" />
        </button>
      </header>

      <div id="rh-menu" className={`rh-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <ul>
          {[...LINKS, { label: 'Projects', href: '/projects' }, { label: 'Skills', href: '/skills' }].map((l) => (
            <li key={l.label}>
              {l.href.startsWith('#') ? (
                <a href={l.href} onClick={(e) => onAnchor(e, l.href)} tabIndex={menuOpen ? 0 : -1}>
                  {l.label}
                </a>
              ) : (
                <Link to={l.href} tabIndex={menuOpen ? 0 : -1}>
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <p>
          Dublin <span className="rh-mono">{time}</span>
        </p>
      </div>
    </>
  )
}
