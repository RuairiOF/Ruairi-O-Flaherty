import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SEO } from '../components/SEO'
import { getStaticSeoPage } from '../content/seo-pages'
import { FilmStage } from '../components/homefilm/FilmStage'
import { StaticIntro } from '../components/homefilm/StaticIntro'
import { HomeNav } from '../components/homefilm/HomeNav'
import {
  Arrow,
  ContactSection,
  ExperienceSection,
  HomeFooter,
  ToolsSection,
  WorkSection,
} from '../components/homefilm/Sections'
import { useCursorFx, useHomeMotion } from '../components/homefilm/useHomeMotion'
import '../styles/home.css'

/** The film needs room and a reader who is happy with motion; everyone else gets the stills. */
const FILM_QUERY = '(min-width: 1024px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)'
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)'

function useMedia(query: string) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatch(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return match
}

export function Home() {
  const seo = getStaticSeoPage('/')
  const film = useMedia(FILM_QUERY)
  const reduce = useMedia(REDUCE_QUERY)
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const html = document.documentElement
    html.classList.add('rh-home')
    return () => html.classList.remove('rh-home')
  }, [])

  useHomeMotion(rootRef, !reduce, film)
  useCursorFx(rootRef, film)

  return (
    <div className="rh" ref={rootRef}>
      <SEO
        title={seo?.title}
        description={seo?.description}
        keywords={seo?.keywords}
        image={seo?.image}
        imageAlt={seo?.imageAlt}
        url={seo?.path}
        type={seo?.type}
        structuredData={seo?.structuredData}
      />
      <a href="#main-content" className="rh-skip">
        Skip to content
      </a>
      <HomeNav film={film} />
      <main id="main-content" tabIndex={-1}>
        {film ? <FilmStage key="film" /> : <StaticIntro key="static" />}
        <WorkSection />
        <ExperienceSection />
        <ToolsSection />
        <ContactSection />
      </main>
      <HomeFooter />
      <div className="rh-cursor" data-cursor-pill aria-hidden="true">
        <span data-cursor-label>View project</span>
        <Arrow />
      </div>
    </div>
  )
}
