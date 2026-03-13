import { SEO } from '../components/SEO'
import { Section } from '../components/Section'
import { PhotoGallery } from '../components/PhotoGallery'
import { galleryPhotos } from '../content/photos'
import { getStaticSeoPage } from '../content/seo-pages'
import { withBasePath } from '../lib/seo'

export function Photos() {
  const seo = getStaticSeoPage('/photos')
  const basePath = import.meta.env.BASE_URL || '/'
  const photos = galleryPhotos.map((photo) => ({
    ...photo,
    src: withBasePath(photo.src, basePath),
  }))

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
        title="3D Printing Gallery"
        description="A showcase of 3D printed creations, prototypes, and finished products"
        centered
        className="pt-8 lg:pt-16"
        titleAs="h1"
      >
        <PhotoGallery photos={photos} />
      </Section>
    </>
  )
}
