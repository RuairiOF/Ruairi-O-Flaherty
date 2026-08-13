import { useRef, type ReactNode } from 'react'
import { gsap, useReducedMotion } from '@/lib/motion'

interface MagnetProps {
  children: ReactNode
  className?: string
  /** How far (px) around the element the pull starts */
  padding?: number
  /** 1 = follows pointer fully; lower = subtler */
  magnetStrength?: number
}

/** ReactBits-style magnetic pull toward the pointer. Mouse-only, motion-safe. */
export default function Magnet({
  children,
  className = '',
  padding = 24,
  magnetStrength = 0.35,
}: MagnetProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current
    const inner = innerRef.current
    if (!wrap || !inner || reduced || e.pointerType !== 'mouse') return
    const rect = wrap.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    gsap.to(inner, {
      x: (e.clientX - cx) * magnetStrength,
      y: (e.clientY - cy) * magnetStrength,
      duration: 0.3,
      ease: 'power3.out',
    })
  }

  const onPointerLeave = () => {
    if (!innerRef.current) return
    gsap.to(innerRef.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
  }

  return (
    <div
      ref={wrapRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={className}
      style={{ padding, margin: -padding, display: 'inline-block' }}
    >
      <div ref={innerRef} className="will-change-transform">
        {children}
      </div>
    </div>
  )
}
