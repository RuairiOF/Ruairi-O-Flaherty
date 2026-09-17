import type { ReactNode } from 'react'
import { useReducedMotion } from '@/lib/motion'
import './ShinyText.css'

interface ShinyTextProps {
  children: ReactNode
  className?: string
  /** Seconds for one shine sweep */
  speed?: number
  disabled?: boolean
}

/** ReactBits-style text with a periodic light sweep. Static under reduced motion. */
export default function ShinyText({
  children,
  className = '',
  speed = 3,
  disabled = false,
}: ShinyTextProps) {
  const reduced = useReducedMotion()
  const off = disabled || reduced

  return (
    <span
      className={`shiny-text ${off ? 'shiny-text-static' : ''} ${className}`}
      style={off ? undefined : { animationDuration: `${speed}s` }}
    >
      {children}
    </span>
  )
}
