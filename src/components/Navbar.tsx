import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '../lib/utils'

const basePath = import.meta.env.BASE_URL || '/'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Experience', href: '/experience' },
  { name: 'Skills', href: '/skills' },
  { name: 'Contact', href: '/contact' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const originalOverflow = useRef('')
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  useEffect(() => {
    if (isOpen) {
      originalOverflow.current = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = originalOverflow.current
    }

    return () => {
      document.body.style.overflow = originalOverflow.current
    }
  }, [isOpen])

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-2 sm:pt-4">
        <nav
          className={cn(
            'flex w-[calc(100%-1rem)] max-w-[24rem] items-center justify-between px-3 py-2 rounded-full transition-all duration-300 shadow-lg',
            'sm:w-auto sm:max-w-none sm:min-w-[320px] sm:px-6 sm:py-3',
            'bg-stone-50/90 dark:bg-white/10 backdrop-blur-md border border-stone-200/30 dark:border-white/10',
            'hover:shadow-xl hover:shadow-teal-500/10 dark:hover:shadow-teal-400/10'
          )}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group"
          >
            <img
              src={`${basePath}images/branding/Main_Logo.webp`}
              alt="Site logo"
              className="h-6 sm:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 ml-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'relative px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 group',
                  isActivePath(item.href)
                    ? 'text-teal-700 dark:text-teal-400 bg-teal-100/90 dark:bg-teal-500/25'
                    : 'text-stone-700 dark:text-stone-200 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-stone-100/90 dark:hover:bg-white/15'
                )}
              >
                <span className="relative z-10">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right side - Theme toggle and mobile menu */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1.5 rounded-full text-stone-700 dark:text-stone-200 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-stone-100/90 dark:hover:bg-white/15 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed top-14 sm:top-20 left-1/2 w-[calc(100%-1rem)] max-w-sm transform -translate-x-1/2 z-40 md:hidden">
          <div className="bg-white/95 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200/20 dark:border-white/10 rounded-2xl shadow-xl px-3 py-3 space-y-1 sm:px-4 sm:py-4 sm:space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'block px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  isActivePath(item.href)
                    ? 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/20'
                    : 'text-stone-700 dark:text-stone-300 hover:text-teal-700 dark:hover:text-teal-400 hover:bg-stone-50 dark:hover:bg-white/10'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-14 sm:h-20" />
    </>
  )
}
