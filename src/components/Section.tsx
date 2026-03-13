import { ReactNode } from 'react'
import { cn } from '../lib/utils'

interface SectionProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
  titleAs?: 'h1' | 'h2'
  centered?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Section({
  children,
  className,
  title,
  description,
  titleAs = 'h2',
  centered = false,
  size = 'md',
}: SectionProps) {
  const sizeClasses = {
    sm: 'section-sm',
    md: 'section',
    lg: 'section',
  }

  return (
    <section className={cn(sizeClasses[size], className)}>
      <div className="container">
        {(title || description) && (
          <div className={cn('mb-12 lg:mb-16', centered && 'text-center')}>
            {title && (
              titleAs === 'h1' ? (
                <h1 className="heading-2 mb-4 text-stone-900 dark:text-white">{title}</h1>
              ) : (
                <h2 className="heading-2 mb-4 text-stone-900 dark:text-white">{title}</h2>
              )
            )}
            {description && (
              <p className="prose text-lg max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

