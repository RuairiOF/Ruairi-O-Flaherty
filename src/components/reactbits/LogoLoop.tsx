import type { ReactNode } from 'react'
import { useReducedMotion } from '@/lib/motion'
import './LogoLoop.css'

export interface LogoLoopItem {
  key: string
  node: ReactNode
}

interface LogoLoopProps {
  items: LogoLoopItem[]
  /** Seconds for one full loop */
  speed?: number
  className?: string
  /** Fade the edges into the background */
  fadeEdges?: boolean
}

/**
 * ReactBits-style infinite logo marquee. The track is duplicated once for a
 * seamless loop; pauses on hover and stops under reduced motion.
 */
export default function LogoLoop({
  items,
  speed = 24,
  className = '',
  fadeEdges = true,
}: LogoLoopProps) {
  const reduced = useReducedMotion()

  return (
    <div
      className={`logo-loop ${fadeEdges ? 'logo-loop-fade' : ''} ${className}`}
      role="marquee"
      aria-label="Partner logos"
    >
      <div
        className={`logo-loop-track ${reduced ? 'logo-loop-static' : ''}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="logo-loop-group"
            aria-hidden={copy === 1 ? 'true' : undefined}
          >
            {items.map((item) => (
              <div key={`${copy}-${item.key}`} className="logo-loop-item">
                {item.node}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
