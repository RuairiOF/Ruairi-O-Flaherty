import { useRef, type ReactNode } from 'react'
import { gsap, useReducedMotion } from '@/lib/motion'

interface TiltedCardProps {
  children: ReactNode
  className?: string
  /** Max tilt in degrees */
  maxTilt?: number
  scale?: number
}

/**
 * ReactBits-style 3D tilt-on-hover. Only active for mouse pointers and
 * disabled entirely under reduced motion.
 */
export default function TiltedCard({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.02,
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || reduced || e.pointerType !== 'mouse') return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(el, {
      rotateY: px * maxTilt * 2,
      rotateX: -py * maxTilt * 2,
      scale,
      transformPerspective: 900,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  const onPointerLeave = () => {
    const el = ref.current
    if (!el) return
    gsap.to(el, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: 'power3.out' })
  }

  return (
    <div style={{ perspective: 900 }}>
      <div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className={`will-change-transform ${className}`}
      >
        {children}
      </div>
    </div>
  )
}
