import BlurText from '../reactbits/BlurText'
import ShinyText from '../reactbits/ShinyText'
import { cn } from '../../lib/utils'

interface SectionIntroProps {
  /** Engineering-style label, e.g. "01 / Featured work" */
  eyebrow: string
  title: string
  lead?: string
  align?: 'left' | 'center'
  className?: string
}

/** Shared eyebrow + heading + lead block for the home page sections. */
export default function SectionIntro({
  eyebrow,
  title,
  lead,
  align = 'left',
  className,
}: SectionIntroProps) {
  const centered = align === 'center'

  return (
    <div className={cn(centered && 'text-center', className)}>
      <p className="eyebrow">
        <ShinyText>{eyebrow}</ShinyText>
      </p>
      <BlurText
        as="h2"
        text={title}
        className={cn('heading-2 mt-3 text-ink', centered && 'mx-auto')}
      />
      {lead && (
        <p
          className={cn('prose mt-4 max-w-2xl text-lg', centered && 'mx-auto')}
        >
          {lead}
        </p>
      )}
    </div>
  )
}
