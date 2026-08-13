import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/lib/motion'

interface FuzzyTextProps {
  children: string
  fontSize?: string
  fontWeight?: number | string
  fontFamily?: string
  /** CSS color; defaults to the ink token */
  color?: string
  baseIntensity?: number
  hoverIntensity?: number
}

/** ReactBits-style canvas text with a scanline "fuzz" that intensifies on hover. */
export default function FuzzyText({
  children,
  fontSize = 'clamp(6rem, 20vw, 12rem)',
  fontWeight = 700,
  fontFamily = "'Clash Display', sans-serif",
  color,
  baseIntensity = 0.18,
  hoverIntensity = 0.5,
}: FuzzyTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let hovering = false
    const reduced = prefersReducedMotion()

    const init = async () => {
      if (document.fonts?.ready) await document.fonts.ready
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const resolvedColor =
        color ||
        `rgb(${getComputedStyle(document.documentElement).getPropertyValue('--ink').trim().split(' ').join(',')})`

      // Measure using an offscreen element so clamp()/vw font sizes resolve.
      const probe = document.createElement('span')
      probe.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font-weight:${fontWeight};font-family:${fontFamily};font-size:${fontSize}`
      probe.textContent = children
      document.body.appendChild(probe)
      const rect = probe.getBoundingClientRect()
      const computedSize = parseFloat(getComputedStyle(probe).fontSize)
      document.body.removeChild(probe)

      const fuzzRange = 30
      const width = Math.ceil(rect.width) + fuzzRange * 2
      const height = Math.ceil(rect.height * 1.2)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)

      const off = document.createElement('canvas')
      off.width = width * dpr
      off.height = height * dpr
      const offCtx = off.getContext('2d')
      if (!offCtx) return
      offCtx.scale(dpr, dpr)
      offCtx.font = `${fontWeight} ${computedSize}px ${fontFamily}`
      offCtx.textBaseline = 'middle'
      offCtx.fillStyle = resolvedColor
      offCtx.fillText(children, fuzzRange, height / 2)

      const draw = () => {
        ctx.clearRect(0, 0, width, height)
        const intensity = hovering ? hoverIntensity : baseIntensity
        const rowHeight = 2
        for (let y = 0; y < height; y += rowHeight) {
          const dx = reduced ? 0 : (Math.random() - 0.5) * fuzzRange * intensity
          ctx.drawImage(
            off,
            0,
            y * dpr,
            width * dpr,
            rowHeight * dpr,
            dx,
            y,
            width,
            rowHeight,
          )
        }
        if (!reduced) raf = requestAnimationFrame(draw)
      }
      draw()

      canvas.onmouseenter = () => {
        hovering = true
      }
      canvas.onmouseleave = () => {
        hovering = false
      }
    }

    init()
    return () => cancelAnimationFrame(raf)
  }, [children, fontSize, fontWeight, fontFamily, color, baseIntensity, hoverIntensity])

  return <canvas ref={canvasRef} role="img" aria-label={children} />
}
