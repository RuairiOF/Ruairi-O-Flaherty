import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '../lib/utils'

type Theme = 'light' | 'dark'

// Key must stay 'theme' — the inline script in index.html reads it before first paint.
const STORAGE_KEY = 'theme'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')

  const getSavedTheme = (): Theme | null => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY)
      return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : null
    } catch {
      return null
    }
  }

  useEffect(() => {
    const savedTheme = getSavedTheme()
    const supportsMatchMedia = typeof window.matchMedia === 'function'
    const systemTheme =
      supportsMatchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    const initialTheme = savedTheme || systemTheme

    setTheme(initialTheme)
    updateTheme(initialTheme)
  }, [])

  const updateTheme = (newTheme: Theme) => {
    document.documentElement.classList.toggle('dark', newTheme === 'dark')

    try {
      localStorage.setItem(STORAGE_KEY, newTheme)
    } catch {
      // Ignore storage errors (e.g. private mode restrictions)
    }
  }

  const nextTheme: Theme = theme === 'light' ? 'dark' : 'light'

  const toggleTheme = () => {
    setTheme(nextTheme)
    updateTheme(nextTheme)
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn btn-ghost btn-sm relative !h-8 !w-8 !rounded-full !p-0"
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      <Moon
        aria-hidden="true"
        className={cn(
          'absolute h-4 w-4 transition-all duration-base ease-spring',
          isDark
            ? 'rotate-90 scale-50 opacity-0'
            : 'rotate-0 scale-100 opacity-100'
        )}
      />
      <Sun
        aria-hidden="true"
        className={cn(
          'absolute h-4 w-4 transition-all duration-base ease-spring',
          isDark
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-50 opacity-0'
        )}
      />
    </button>
  )
}
