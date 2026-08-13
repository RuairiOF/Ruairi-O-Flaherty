import { SEO } from '../components/SEO'
import PhotoGrid from '../components/photos/PhotoGrid'
import BlurText from '../components/reactbits/BlurText'
import { galleryPhotos } from '../content/photos'
import { getStaticSeoPage } from '../content/seo-pages'

export function Photos() {
  const seo = getStaticSeoPage('/photos')

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

      <section className="section">
        <div className="shell-wide">
          <header className="mb-12 max-w-3xl lg:mb-16">
            <p className="eyebrow mb-4">Gallery</p>
            <h1 className="heading-1 text-ink">
              <BlurText as="span" text="Fresh off the" className="block" />
              <span className="block gradient-text animate-fade-in">print bed.</span>
            </h1>
            <p className="prose mt-6 text-lg">
              {galleryPhotos.length} photos from ROF&rsquo;s 3D &mdash; my 3D-printing bench, where
              prototypes, props and finished pieces come off the plate. Tap any frame to open it
              full size.
            </p>
          </header>

          <PhotoGrid photos={galleryPhotos} />
        </div>
      </section>
    </>
  )
}
