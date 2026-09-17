import { useEffect, useRef, type ReactNode } from 'react'
import { prefersReducedMotion } from '@/lib/motion'

interface ClickSparkProps {
  children: ReactNode
  className?: string
  /** CSS color; defaults to the accent token */
  sparkColor?: string
  sparkCount?: number
  sparkRadius?: number
  duration?: number
}

/** ReactBits-style spark burst on click, drawn on a full-area canvas overlay. */
export default function ClickSpark({
  children,
  className = '',
  sparkColor,
  sparkCount = 8,
  sparkRadius = 24,
  duration = 450,
}: ClickSparkProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparks = useRef<{ x: number; y: number; angle: number; start: number }[]>([])
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)

    const color =
      sparkColor ||
      `rgb(${getComputedStyle(document.documentElement).getPropertyValue('--accent').trim().split(' ').join(',')})`

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      sparks.current = sparks.current.filter((spark) => {
        const t = (now - spark.start) / duration
        if (t >= 1) return false
        const eased = 1 - Math.pow(1 - t, 3)
        const distance = eased * sparkRadius
        const length = 8 * (1 - eased)
        const x1 = spark.x + distance * Math.cos(spark.angle)
        const y1 = spark.y + distance * Math.sin(spark.angle)
        ctx.strokeStyle = color
        ctx.globalAlpha = 1 - t
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x1 + length * Math.cos(spark.angle), y1 + length * Math.sin(spark.angle))
        ctx.stroke()
        return true
      })
      ctx.globalAlpha = 1
      if (sparks.current.length > 0) rafRef.current = requestAnimationFrame(draw)
    }

    const onClick = (e: MouseEvent) => {
      if (prefersReducedMotion()) return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const start = performance.now()
      for (let i = 0; i < sparkCount; i++) {
        sparks.current.push({ x, y, angle: (Math.PI * 2 * i) / sparkCount, start })
      }
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(draw)
    }

    container.addEventListener('click', onClick)
    return () => {
      container.removeEventListener('click', onClick)
      observer.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [sparkColor, sparkCount, sparkRadius, duration])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
      />
      {children}
    </div>
  )
}
