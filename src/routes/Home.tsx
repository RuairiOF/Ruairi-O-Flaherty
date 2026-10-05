import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SEO } from '../components/SEO'
import { getStaticSeoPage } from '../content/seo-pages'
import { FilmStage } from '../components/homefilm/FilmStage'
import { StaticAbout, StaticIntro } from '../components/homefilm/StaticIntro'
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

type Mode = 'desktop' | 'mobile' | 'static'

/**
 * Landscape screens get the full-frame film, portrait screens the phone cut
 * that follows the action, and anyone who has asked for less motion or less
 * data gets the stills.
 */
function pickMode(): Mode {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static'
  const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  if (c?.saveData) return 'static'
  const w = window.innerWidth
  const h = window.innerHeight
  if (w >= 1024 && h >= 560) return 'desktop'
  if (w / h >= 1.2 && h >= 360) return 'desktop'
  return 'mobile'
}

function useMode(): Mode {
  const [mode, setMode] = useState<Mode>(pickMode)
  useEffect(() => {
    let timer = 0
    const update = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setMode(pickMode()), 150)
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    window.addEventListener('resize', update)
    mq.addEventListener('change', update)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', update)
      mq.removeEventListener('change', update)
    }
  }, [])
  return mode
}

export function Home() {
  const seo = getStaticSeoPage('/')
  const mode = useMode()
  const reduce = mode === 'static' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const html = document.documentElement
    html.classList.add('rh-home')
    return () => html.classList.remove('rh-home')
  }, [])

  useHomeMotion(rootRef, !reduce, mode)
  useCursorFx(rootRef, mode)

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
      <HomeNav film={mode !== 'static'} />
      <main id="main-content" tabIndex={-1}>
        {mode === 'static' ? <StaticIntro key="static" /> : <FilmStage key={mode} profile={mode} />}
        {mode === 'mobile' ? <StaticAbout /> : null}
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
