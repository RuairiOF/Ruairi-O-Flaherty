import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import GlassSurface from './GlassSurface'
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
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
        <div className="w-[calc(100vw-1rem)] max-w-[24rem] sm:w-auto sm:max-w-none sm:min-w-[320px]">
          <GlassSurface
            enableDistortion
            chromaticAberration={false}
            width="100%"
            height="auto"
            borderRadius={999}
            borderWidth={0.035}
            backgroundOpacity={0.24}
            saturation={1.1}
            blur={10}
            displace={0.18}
            distortionScale={-48}
            className="w-full shadow-lg shadow-black/10"
          >
            <nav className="flex w-full items-center justify-between px-4 py-3 sm:px-6">
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center space-x-2 group"
              >
                <img
                  src={`${basePath}images/branding/Main_Logo.png`}
                  alt="Site logo"
                  className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
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
          </GlassSurface>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed top-20 left-1/2 w-[calc(100vw-1rem)] max-w-sm transform -translate-x-1/2 z-40 md:hidden">
          <div className="bg-white/95 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200/20 dark:border-white/10 rounded-2xl shadow-xl px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
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
      <div className="h-20" />
    </>
  )
}
