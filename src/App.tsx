import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { SkipToContent } from './components/SkipToContent'
import { Home } from './routes/Home'
import { Projects } from './routes/Projects'
import { Experience } from './routes/Experience'
import { Contact } from './routes/Contact'
import { NotFound } from './routes/NotFound'

function App() {
  const basePath = import.meta.env.VITE_BASE_PATH || '/'

  return (
    <Router basename={basePath}>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <SkipToContent />
        <Navbar />
        
        <main id="main-content" className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  )
}

export default App

