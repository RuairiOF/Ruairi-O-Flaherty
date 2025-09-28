import { SEO } from '../components/SEO'
import { Section } from '../components/Section'
import { PhotoGallery } from '../components/PhotoGallery'
import { cvData } from '../content/cv'

export function Photos() {
  // This would typically come from a data source or API
  // For now, we'll create a placeholder array that you can replace
  const photos = [
    '/images/photos/SprunkeColaMain.jpg',
    // Add more photo paths here, e.g.:
    // '/images/photos/photo2.jpg',
    // '/images/photos/photo3.jpg',
  ]

  return (
    <>
      <SEO
        title="3D Printing Gallery"
        description={`3D printing portfolio and creations by ${cvData.person.name}`}
      />

      <Section
        title="3D Printing Gallery"
        description="A showcase of 3D printed creations, prototypes, and finished products"
        centered
        className="pt-8 lg:pt-16"
      >
        <PhotoGallery photos={photos} />
      </Section>
    </>
  )
}
