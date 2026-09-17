import { useRef, type ReactNode, type HTMLAttributes } from 'react'

interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  /** CSS color for the spotlight; defaults to the glow token */
  spotlightColor?: string
}

/** ReactBits-style card with a pointer-tracking radial highlight over glass. */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgb(var(--glow) / 0.18)',
  ...rest
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
    el.style.setProperty('--spot-opacity', '1')
  }

  const onPointerLeave = () => {
    ref.current?.style.setProperty('--spot-opacity', '0')
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`relative overflow-hidden glass-panel rounded-2xl ${className}`}
      {...rest}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-slow"
        style={{
          opacity: 'var(--spot-opacity, 0)' as unknown as number,
          background: `radial-gradient(360px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${spotlightColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  )
}
