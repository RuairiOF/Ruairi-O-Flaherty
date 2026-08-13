import type { ReactNode } from 'react'
import { useRevealOnScroll } from '@/lib/motion'

interface RevealProps {
  children: ReactNode
  className?: string
  y?: number
  delay?: number
}

/** Per-block scroll entrance, so long columns reveal as you read rather than at once. */
export default function Reveal({ children, className = '', y = 20, delay = 0 }: RevealProps) {
  const ref = useRevealOnScroll<HTMLDivElement>({ y, delay })
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
