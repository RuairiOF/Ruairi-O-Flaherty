import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { SEO } from '../components/SEO'
import { Section } from '../components/Section'

export function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist"
      />

      <Section className="min-h-[60vh] flex items-center">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-8xl lg:text-9xl font-bold text-gray-200 dark:text-gray-800 mb-4">
              404
            </h1>
            <h2 className="heading-2 text-gray-900 dark:text-white mb-4">
              Page Not Found
            </h2>
            <p className="prose text-lg">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="btn btn-primary btn-lg group"
            >
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="btn btn-secondary btn-lg group"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </button>
          </div>

          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <h3 className="heading-4 text-gray-900 dark:text-white mb-4">
              Looking for something specific?
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/projects"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Projects
              </Link>
              <Link
                to="/about"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                About Me
              </Link>
              <Link
                to="/contact"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}

