import { useMemo, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { SEO } from '../components/SEO'
import { Section } from '../components/Section'
import { cvData } from '../content/cv'
import { getStaticSeoPage } from '../content/seo-pages'
import type { SkillShowcase } from '../types'

const basePath = import.meta.env.BASE_URL || '/'
const skillImageFallbacks: Record<string, string> = {
  'Business & Logistics': `${basePath}images/photos/radios.webp`,
  'Software Development': `${basePath}images/photos/MeOnALaptop.webp`,
}

function withFallbackImage(showcase: SkillShowcase): SkillShowcase {
  if (showcase.images.length > 0) return showcase

  const fallbackImage = skillImageFallbacks[showcase.title]
  if (!fallbackImage) return showcase

  return {
    ...showcase,
    images: [fallbackImage],
  }
}

function ImageViewer({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0)

  if (images.length === 0) return null

  return (
    <div className="relative w-full h-[60vh] rounded-2xl overflow-hidden bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/10">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`${title} ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-500 ${
            i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          loading="lazy"
          decoding="async"
        />
      ))}
      {images.length > 1 && (
        <>
          <button
            onClick={() => setActive((active - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActive((active + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === active ? 'bg-white w-5' : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function SkillModal({ showcase, onClose }: { showcase: SkillShowcase; onClose: () => void }) {
  const hasImages = showcase.images.length > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-stone-900/95 dark:backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-transparent dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-stone-100 dark:bg-white/10 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-stone-600 dark:text-stone-300" />
        </button>

        <div className="p-6 space-y-5">
          <div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white pr-8">
              {showcase.title}
            </h3>
            <p className="text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
              {showcase.description}
            </p>
          </div>

          {hasImages && (
            <ImageViewer images={showcase.images} title={showcase.title} />
          )}

          <div className="flex flex-wrap gap-2">
            {showcase.tools.map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 dark:bg-white/10 dark:text-stone-300"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SkillCard({ showcase, onClick }: { showcase: SkillShowcase; onClick: () => void }) {
  const hasImages = showcase.images.length > 0

  return (
    <div
      className="group cursor-pointer rounded-2xl overflow-hidden border border-stone-200 dark:border-white/10 bg-white dark:bg-white/5 dark:backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-400/30 transition-all duration-300"
      onClick={onClick}
    >
      {hasImages ? (
        <div className="relative h-40 overflow-hidden">
          <img
            src={showcase.images[0]}
            alt={showcase.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${showcase.imagePosition ?? 'object-center'}`}
            loading="lazy"
            decoding="async"
          />
          {showcase.images.length > 1 && (
            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/50 text-white text-xs">
              +{showcase.images.length - 1}
            </span>
          )}
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-stone-500/10 dark:from-teal-500/15 dark:via-cyan-500/10 dark:to-stone-500/5 flex items-end p-3 overflow-hidden">
          <div className="flex flex-wrap gap-1">
            {showcase.tools.slice(0, 5).map((tool) => (
              <span key={tool} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/60 dark:bg-white/10 text-stone-500 dark:text-stone-400">
                {tool}
              </span>
            ))}
            {showcase.tools.length > 5 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/60 dark:bg-white/10 text-stone-400 dark:text-stone-500">
                +{showcase.tools.length - 5}
              </span>
            )}
          </div>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-bold text-stone-900 dark:text-white mb-1">
          {showcase.title}
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2">
          {showcase.description}
        </p>
      </div>
    </div>
  )
}

export function Skills() {
  const [selected, setSelected] = useState<SkillShowcase | null>(null)
  const seo = getStaticSeoPage('/skills')
  const showcases = useMemo(
    () => cvData.skills.showcases.map(withFallbackImage),
    []
  )

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
        structuredData={seo?.structuredData}
      />

      <Section
        title="What I Work With"
        description="The tools and skills I actually use day-to-day across my projects and businesses."
        centered
        titleAs="h1"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {showcases.map((showcase) => (
              <SkillCard
                key={showcase.title}
                showcase={showcase}
                onClick={() => setSelected(showcase)}
              />
            ))}
          </div>
        </div>
      </Section>

      {selected && (
        <SkillModal
          showcase={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
