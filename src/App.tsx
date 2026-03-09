import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { SkipToContent } from './components/SkipToContent'
import { Home } from './routes/Home'
import { Projects } from './routes/Projects'
import { Experience } from './routes/Experience'
import { Skills } from './routes/Skills'
import { Contact } from './routes/Contact'
import { Photos } from './routes/Photos'
import { NotFound } from './routes/NotFound'
import Grainient from './components/Grainient'

function App() {
  return (
    <Router>
      <div className="hidden dark:block fixed inset-0 z-0" style={{ transform: 'translateZ(0)', willChange: 'transform', backfaceVisibility: 'hidden' }}>
        <Grainient
          color1="#1a3a3a"
          color2="#0f2b3d"
          color3="#1c2e2a"
          timeSpeed={1.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5.6}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>
      <div className="relative z-10 min-h-screen flex flex-col bg-stone-50 dark:bg-transparent">
        <SkipToContent />
        <Navbar />
        
        <main id="main-content" className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/photos" element={<Photos />} />
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

