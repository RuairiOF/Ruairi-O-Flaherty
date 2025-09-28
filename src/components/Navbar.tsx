import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '../lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Experience', href: '/experience' },
  { name: 'Contact', href: '/contact' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
        <nav
          className={cn(
            'flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 shadow-lg',
            'bg-gray-50/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200/30 dark:border-gray-600/30',
            'hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10'
          )}
          style={{ width: 'fit-content', minWidth: '320px' }}
        >
          {/* Logo with Gradient */}
          <Link
            to="/"
            className="flex items-center space-x-2 group"
          >
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-blue-900 transition-all duration-300">
              Ruairi
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 ml-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'relative px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 group',
                  isActivePath(item.href)
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
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
              className="md:hidden p-1.5 rounded-full text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 md:hidden">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/20 dark:border-gray-700/20 rounded-2xl shadow-xl px-6 py-4 space-y-2 min-w-[280px]">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                  isActivePath(item.href)
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
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

