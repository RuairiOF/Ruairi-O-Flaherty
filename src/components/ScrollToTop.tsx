import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return

    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    return () => {
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  useLayoutEffect(() => {
    const html = document.documentElement
    const body = document.body
    const previousHtmlScrollBehavior = html.style.scrollBehavior
    const previousBodyScrollBehavior = body.style.scrollBehavior

    // Force instant route-change scroll resets even when smooth scrolling is enabled globally.
    html.style.scrollBehavior = 'auto'
    body.style.scrollBehavior = 'auto'
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    const frame = window.requestAnimationFrame(() => {
      html.style.scrollBehavior = previousHtmlScrollBehavior
      body.style.scrollBehavior = previousBodyScrollBehavior
    })

    return () => {
      window.cancelAnimationFrame(frame)
      html.style.scrollBehavior = previousHtmlScrollBehavior
      body.style.scrollBehavior = previousBodyScrollBehavior
    }
  }, [pathname])

  return null
}
