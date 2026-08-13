import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { SkipToContent } from './components/SkipToContent'
import { ScrollToTop } from './components/ScrollToTop'
import AuroraBackground from './components/AuroraBackground'

const Home = lazy(() => import('./routes/Home').then((m) => ({ default: m.Home })))
const Projects = lazy(() => import('./routes/Projects').then((m) => ({ default: m.Projects })))
const ProjectDetail = lazy(() =>
  import('./routes/ProjectDetail').then((m) => ({ default: m.ProjectDetail })),
)
const Experience = lazy(() =>
  import('./routes/Experience').then((m) => ({ default: m.Experience })),
)
const Skills = lazy(() => import('./routes/Skills').then((m) => ({ default: m.Skills })))
const Contact = lazy(() => import('./routes/Contact').then((m) => ({ default: m.Contact })))
const Photos = lazy(() => import('./routes/Photos').then((m) => ({ default: m.Photos })))
const NotFound = lazy(() => import('./routes/NotFound').then((m) => ({ default: m.NotFound })))

function RouteFallback() {
  return (
    <div className="flex items-center justify-center py-32" role="status" aria-label="Loading">
      <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  )
}

/** Enter-only page transition: each route fades and rises in on navigation. */
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  return (
    <div key={location.pathname} className="motion-safe:animate-slide-up">
      {children}
    </div>
  )
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuroraBackground />
      <div className="relative z-10 min-h-screen flex flex-col overflow-x-hidden">
        <SkipToContent />
        <Navbar />

        <main id="main-content" className="flex-1">
          <Suspense fallback={<RouteFallback />}>
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route path="/experience" element={<Experience />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/photos" element={<Photos />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<Navigate to="/experience" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </Suspense>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
