import { useCallback, useMemo, useState } from 'react'
import { SEO } from '../components/SEO'
import BlurText from '../components/reactbits/BlurText'
import Lightbox, { type LightboxItem } from '../components/Lightbox'
import { SkillCard } from '../components/skills/SkillCard'
import { SkillDialog } from '../components/skills/SkillDialog'
import { toManifestPath, withFallbackImage } from '../components/skills/skill-images'
import { cvData } from '../content/cv'
import { getStaticSeoPage } from '../content/seo-pages'
import { useRevealOnScroll } from '@/lib/motion'

export function Skills() {
  const seo = getStaticSeoPage('/skills')
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const showcases = useMemo(() => cvData.skills.showcases.map(withFallbackImage), [])
  const selected = useMemo(
    () => showcases.find((showcase) => showcase.title === selectedTitle) ?? null,
    [showcases, selectedTitle],
  )

  const lightboxItems = useMemo<LightboxItem[]>(
    () =>
      (selected?.images ?? []).map((image, index) => ({
        src: toManifestPath(image),
        alt: `${selected?.title ?? 'Skill'} — image ${index + 1}`,
        caption: selected?.title,
      })),
    [selected],
  )

  // Esc reaches both dialogs; while the lightbox is open it closes that layer only.
  const closeDialog = useCallback(() => {
    if (lightboxIndex !== null) return
    setSelectedTitle(null)
  }, [lightboxIndex])

  const gridRef = useRevealOnScroll({ y: 26, stagger: 0.06, targets: '[data-skill]' })

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

      <header className="section-sm">
        <div className="shell">
          <p className="eyebrow">Capabilities</p>
          <BlurText
            as="h1"
            text="What I work with"
            className="heading-1 mt-3 block text-ink"
            stagger={0.06}
          />
          <p className="prose mt-5 max-w-2xl text-lg">
            The tools and disciplines I actually use day to day — across CAD, manufacturing,
            software, cloud and the business side of running my own companies. Open any card for
            the detail.
          </p>
        </div>
      </header>

      <section className="pb-16 lg:pb-24" aria-label="Skill areas">
        <div className="shell">
          <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {showcases.map((showcase, index) => (
              <div key={showcase.title} data-skill className="h-full">
                <SkillCard
                  showcase={showcase}
                  index={index}
                  onOpen={() => setSelectedTitle(showcase.title)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <SkillDialog
        showcase={selected}
        onClose={closeDialog}
        onViewImage={(index) => setLightboxIndex(index)}
      />

      <Lightbox
        items={lightboxItems}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  )
}
