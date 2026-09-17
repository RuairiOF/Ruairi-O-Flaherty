import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import SmartImage from './SmartImage'

/* ------------------------------------------------------------------------ */
/* Shared dialog hooks                                                      */
/* ------------------------------------------------------------------------ */

/** Locks body scroll while `active`. Safe to nest (ref-counted). */
let scrollLocks = 0
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    scrollLocks += 1
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      scrollLocks -= 1
      if (scrollLocks === 0) document.body.style.overflow = prev
    }
  }, [active])
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/** Traps Tab focus inside `ref` while `active`; restores focus on release. */
export function useFocusTrap(ref: RefObject<HTMLElement>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return
    const container = ref.current
    const previouslyFocused = document.activeElement as HTMLElement | null

    const first = container.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (focusable.length === 0) return
      const firstEl = focusable[0]
      const lastEl = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }

    container.addEventListener('keydown', onKeyDown)
    return () => {
      container.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
  }, [ref, active])
}

/* ------------------------------------------------------------------------ */
/* Generic glass dialog shell                                               */
/* ------------------------------------------------------------------------ */

interface DialogProps {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
  /** Extra classes for the panel */
  className?: string
}

export function Dialog({ open, onClose, label, children, className = '' }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  useScrollLock(open)
  useFocusTrap(panelRef, open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 glass-overlay animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`glass-panel rounded-2xl max-h-[90vh] overflow-y-auto scrollbar-thin animate-slide-up ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

/* ------------------------------------------------------------------------ */
/* Lightbox                                                                 */
/* ------------------------------------------------------------------------ */

export interface LightboxItem {
  src: string
  alt: string
  /** Optional caption shown under the media */
  caption?: string
  /** "image" (default) or "video" */
  kind?: 'image' | 'video'
}

interface LightboxProps {
  items: LightboxItem[]
  /** Index of the open item, or null when closed */
  index: number | null
  onClose: () => void
  onNavigate: (nextIndex: number) => void
}

/**
 * The one media lightbox: keyboard (Esc/arrows), focus trap, scroll lock,
 * pointer swipe, neighbor preload, counter + caption.
 */
export default function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const open = index !== null && index >= 0 && index < items.length
  const panelRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)

  useScrollLock(open)
  useFocusTrap(panelRef, open)

  const goto = useCallback(
    (delta: number) => {
      if (index === null) return
      const next = (index + delta + items.length) % items.length
      onNavigate(next)
    },
    [index, items.length, onNavigate],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') goto(1)
      else if (e.key === 'ArrowLeft') goto(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, goto])

  // Preload neighbors
  useEffect(() => {
    if (!open || index === null) return
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    for (const delta of [1, -1]) {
      const item = items[(index + delta + items.length) % items.length]
      if (item && item.kind !== 'video') {
        const img = new Image()
        img.src = `${base}${item.src}`
      }
    }
  }, [open, index, items])

  if (!open || index === null) return null

  const item = items[index]
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const many = items.length > 1

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      className="fixed inset-0 z-[100] flex flex-col glass-overlay animate-fade-in"
      onClick={onClose}
      onPointerDown={(e) => {
        touchStartX.current = e.clientX
      }}
      onPointerMove={(e) => {
        if (touchStartX.current !== null && e.pointerType === 'touch') {
          setDragOffset(e.clientX - touchStartX.current)
        }
      }}
      onPointerUp={(e) => {
        if (touchStartX.current === null) return
        const dx = e.clientX - touchStartX.current
        touchStartX.current = null
        setDragOffset(0)
        if (Math.abs(dx) > 60) goto(dx < 0 ? 1 : -1)
      }}
      onPointerCancel={() => {
        touchStartX.current = null
        setDragOffset(0)
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-3 text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-mono text-sm text-ink-muted" aria-live="polite">
          {index + 1} / {items.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="p-2 rounded-full glass-panel text-ink hover:text-accent transition-colors"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Media */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 sm:px-16 pb-4">
        <div
          className="max-w-full max-h-full flex items-center justify-center"
          style={dragOffset ? { transform: `translateX(${dragOffset * 0.35}px)` } : undefined}
          onClick={(e) => e.stopPropagation()}
        >
          {item.kind === 'video' ? (
            <video
              src={`${base}${item.src}`}
              controls
              playsInline
              className="max-w-full max-h-[75vh] rounded-lg"
            />
          ) : (
            <SmartImage
              key={item.src}
              src={item.src}
              alt={item.alt}
              sizes="100vw"
              priority
              className="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded-lg select-none"
              draggable={false}
            />
          )}
        </div>

        {many && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goto(-1)
              }}
              aria-label="Previous"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass-panel text-ink hover:text-accent transition-colors"
            >
              <ChevronLeft className="w-6 h-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goto(1)
              }}
              aria-label="Next"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass-panel text-ink hover:text-accent transition-colors"
            >
              <ChevronRight className="w-6 h-6" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {item.caption && (
        <p
          className="px-4 pb-4 text-center text-sm text-ink-muted"
          onClick={(e) => e.stopPropagation()}
        >
          {item.caption}
        </p>
      )}
    </div>,
    document.body,
  )
}
