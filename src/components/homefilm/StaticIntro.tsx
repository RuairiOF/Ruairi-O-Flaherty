import { useLayoutEffect, useRef } from 'react'
import { FILM_HEIGHT, FILM_WATERLINE_0, FILM_WIDTH } from '../../content/film'
import { filmFrameUrl } from './frames'
import { ABOUT_FACTS, ABOUT_TEXT, FILM_CREDIT, HERO_EYEBROW, HERO_LEAD, HERO_PLACE } from './copy'
import { TEXT_BLOCKS } from './timeline'

const STILLS: Record<string, { frame: number; fig: string; caption: string }> = {
  design: { frame: 46, fig: '01', caption: 'Printhead, exploded view' },
  build: { frame: 70, fig: '02', caption: 'Printhead, assembled' },
  ship: { frame: 150, fig: '03', caption: 'Deployment' },
  now: { frame: 300, fig: '05', caption: FILM_CREDIT },
}

/**
 * The film's story as stills, for small screens and for anyone who has asked
 * for less motion. Same words, same pictures, no scroll-driven playback.
 */
export function StaticIntro() {
  const heroRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = heroRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      const s = Math.max(w / FILM_WIDTH, h / FILM_HEIGHT)
      const y = (h - FILM_HEIGHT * s) / 2 + FILM_WATERLINE_0 * FILM_HEIGHT * s
      el.style.setProperty('--rh-wl', `${Math.round(y)}px`)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <>
      <section ref={heroRef} className="rh-static-hero" data-nav-tone="ink" aria-label="Introduction">
        <img src={filmFrameUrl(0)} alt="" aria-hidden="true" decoding="async" {...{ fetchpriority: 'high' }} />
        <div className="rh-hero">
          <div className="rh-hero__inner">
            <div className="rh-hero__top">
              <p className="rh-hero__eyebrow">
                <span className="rh-dot" aria-hidden="true" />
                {HERO_EYEBROW}
                <span aria-hidden="true">·</span>
                {HERO_PLACE}
              </p>
              <h1 className="rh-hero__title">
                Ruairí
                <br />
                O’Flaherty
              </h1>
            </div>
            <div className="rh-hero__bottom">
              <p className="rh-hero__lead">{HERO_LEAD}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="rh-static-story" data-nav-tone="ink">
        {TEXT_BLOCKS.map((b) => {
          const still = STILLS[b.id]
          return (
            <section className="rh-static-chapter" key={b.id} aria-labelledby={`still-${b.id}`}>
              <figure data-reveal>
                <img
                  src={filmFrameUrl(still.frame)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={FILM_WIDTH}
                  height={FILM_HEIGHT}
                />
                <figcaption>
                  <span className="rh-mono">Fig. {still.fig}</span>
                  {still.caption}
                </figcaption>
              </figure>
              <div>
                <p className="rh-block__label" data-reveal>
                  <span>
                    <span className="rh-mono">{b.index}</span>
                    {b.label}
                  </span>
                </p>
                <h2 className="rh-block__title" id={`still-${b.id}`} data-lines>
                  {b.title}
                </h2>
                <p className="rh-block__body" data-reveal>
                  {b.body}
                </p>
              </div>
            </section>
          )
        })}
      </div>

      <section className="rh-static-about" data-nav-tone="ink" aria-labelledby="about-title">
        <p className="rh-about__label" id="about-title" data-reveal>
          <span className="rh-mono">06</span>
          About
        </p>
        <p className="rh-about__lead" data-lines>
          {ABOUT_TEXT}
        </p>
        <dl className="rh-about__facts">
          {ABOUT_FACTS.map(([k, v]) => (
            <div key={k} className="rh-about__fact" data-reveal>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  )
}
