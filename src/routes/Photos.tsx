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
              <BlurText as="span" text="3D printing" className="block" />{' '}
              <span className="block gradient-text animate-fade-in">Photos</span>
            </h1>
            <p className="prose mt-6 text-lg">
              {galleryPhotos.length} photos of prints, prototypes and finished products
              from ROF’s 3D. Select a photo to see it full size.
            </p>
          </header>

          <PhotoGrid photos={galleryPhotos} />
        </div>
      </section>
    </>
  )
}
