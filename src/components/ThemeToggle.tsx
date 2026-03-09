import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const getSavedTheme = (): 'light' | 'dark' | null => {
    try {
      const savedTheme = localStorage.getItem('theme')
      return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : null
    } catch {
      return null
    }
  }

  useEffect(() => {
    const savedTheme = getSavedTheme()
    const supportsMatchMedia = typeof window.matchMedia === 'function'
    const systemTheme =
      supportsMatchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    const initialTheme = savedTheme || systemTheme

    setTheme(initialTheme)
    updateTheme(initialTheme)
  }, [])

  const updateTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement
    
    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    try {
      localStorage.setItem('theme', newTheme)
    } catch {
      // Ignore storage errors (e.g. private mode restrictions)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    updateTheme(newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-sm"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  )
}

