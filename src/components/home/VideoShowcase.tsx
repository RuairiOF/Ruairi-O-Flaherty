import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Pause, Play, Volume2, VolumeX } from 'lucide-react'

const base = import.meta.env.BASE_URL.replace(/\/$/, '')
const VIDEO_SRC = `${base}/images/photos/NukaColaRadio/video_of_radio_production.mp4`
const POSTER_SRC = `${base}/images/photos/NukaColaRadio/radio-image-1.webp`

/** Full-bleed featured build player: click-to-play, muted by default, glass chrome. */
export default function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play()
    else video.pause()
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  // The card links to the project while keeping the player controls clickable:
  // a stretched link sits under the controls rather than wrapping them.
  return (
    <div className="card card-hover group relative">
      <div className="relative aspect-video bg-surface-2">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          muted
          playsInline
          loop
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="h-full w-full object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent" />

        {/* Mouse affordance only — the accessible link is the heading below */}
        <Link
          to="/projects/nukacolaradio"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 z-10"
        />

        {!isPlaying && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <button
              type="button"
              onClick={togglePlay}
              className="glass-panel pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full text-ink transition-all duration-base ease-out-expo hover:scale-110 hover:text-accent sm:h-20 sm:w-20"
              aria-label="Play video"
            >
              <Play
                className="ml-1 h-7 w-7 sm:h-8 sm:w-8"
                fill="currentColor"
                aria-hidden="true"
              />
            </button>
          </div>
        )}

        {isPlaying && (
          <div className="absolute right-4 top-4 z-20 flex gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors duration-fast hover:text-accent"
              aria-label="Pause video"
            >
              <Pause className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors duration-fast hover:text-accent"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Volume2 className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="eyebrow inline-block rounded-full border border-accent/30 bg-accent/15 px-2.5 py-1 text-accent">
                Featured build
              </span>
              <h3 className="heading-3 mt-3 text-ink">
                <Link
                  to="/projects/nukacolaradio"
                  className="pointer-events-auto transition-colors duration-fast hover:text-accent"
                >
                  Nukacola Radio
                </Link>
              </h3>
              <p className="prose mt-1 hidden max-w-lg text-sm sm:block">
                Hand-finished retro game-inspired Bluetooth radios — from
                sourcing to customer delivery
              </p>
            </div>
            <span className="hidden shrink-0 items-center gap-1 text-sm font-medium text-accent opacity-0 transition-opacity duration-base group-hover:opacity-100 sm:inline-flex">
              View project
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
