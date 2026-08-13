import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'
import { SEO } from '../components/SEO'
import ClickSpark from '../components/reactbits/ClickSpark'
import FuzzyText from '../components/reactbits/FuzzyText'
import StarBorder from '../components/reactbits/StarBorder'
import { getStaticSeoPage } from '../content/seo-pages'

const quickLinks = [
  { label: 'Projects', to: '/projects' },
  { label: 'Experience', to: '/experience' },
  { label: 'Skills', to: '/skills' },
  { label: 'Photos', to: '/photos' },
  { label: 'Contact', to: '/contact' },
]

export function NotFound() {
  const seo = getStaticSeoPage('/404')
  const navigate = useNavigate()
  const location = useLocation()

  // Only step back when the visitor arrived through the app; otherwise "back"
  // would bounce them off the site entirely.
  const goBack = () => {
    if (location.key !== 'default' && window.history.length > 2) navigate(-1)
    else navigate('/')
  }

  return (
    <>
      <SEO
        title={seo?.title}
        description={seo?.description}
        keywords={seo?.keywords}
        image={seo?.image}
        imageAlt={seo?.imageAlt}
        url={seo?.path}
        type={seo?.type}
        noindex={seo?.noindex}
        nofollow={seo?.nofollow}
        structuredData={seo?.structuredData}
      />

      <ClickSpark className="section flex min-h-[70vh] items-center">
        <div className="shell text-center">
          <p className="eyebrow mb-6">Error / 404</p>

          <div className="flex justify-center overflow-hidden">
            <FuzzyText fontSize="clamp(5rem, 18vw, 11rem)" fontWeight={600}>
              404
            </FuzzyText>
          </div>

          <h1 className="heading-3 mt-6 text-ink">This page got lost in the aurora.</h1>
          <p className="prose mx-auto mt-4 max-w-md text-lg">
            The link you followed drifted off the map. Everything else is still exactly where it
            should be.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <StarBorder as={Link} to="/" size="lg" variant="primary">
              <Home className="mr-2 h-5 w-5" aria-hidden="true" />
              Go Home
            </StarBorder>

            <button type="button" onClick={goBack} className="btn btn-secondary btn-lg">
              <ArrowLeft className="mr-2 h-5 w-5" aria-hidden="true" />
              Go Back
            </button>
          </div>

          <div className="mt-14">
            <p className="eyebrow mb-4">Or try one of these</p>
            <nav className="flex flex-wrap justify-center gap-2" aria-label="Site sections">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="rounded-full glass-panel px-4 py-1.5 text-sm text-ink-muted transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </ClickSpark>
    </>
  )
}
