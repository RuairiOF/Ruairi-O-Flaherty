import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/lib/motion'
import Grainient from './Grainient'

/**
 * Site-wide ambient background: animated aurora shader in dark mode,
 * a static gradient wash under reduced motion or while the tab is hidden.
 */
export default function AuroraBackground() {
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(!document.hidden)

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  return (
    <div className="pointer-events-none fixed -inset-px z-0 hidden dark:block" aria-hidden="true">
      {reduced || !visible ? (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(80% 60% at 20% 10%, rgb(76 29 149 / 0.35), transparent 60%),' +
              'radial-gradient(70% 50% at 85% 30%, rgb(8 51 68 / 0.5), transparent 65%),' +
              'radial-gradient(60% 60% at 50% 90%, rgb(30 27 75 / 0.5), transparent 70%)',
          }}
        />
      ) : (
        <Grainient
          color1="#2e1065"
          color2="#083344"
          color3="#1e1b4b"
          timeSpeed={1.1}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5.6}
          warpSpeed={1.6}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          contrast={1.4}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      )}
      {/* Soft veil so content glass always has something to blur against */}
      <div className="absolute inset-0 bg-bg/40" />
    </div>
  )
}
