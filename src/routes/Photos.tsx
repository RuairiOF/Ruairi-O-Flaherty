import { SEO } from '../components/SEO'
import { Section } from '../components/Section'
import { PhotoGallery } from '../components/PhotoGallery'
import { cvData } from '../content/cv'

export function Photos() {
  // This would typically come from a data source or API
  // For now, we'll create a placeholder array that you can replace
  const photos = [
    '/images/photos/SprunkeColaMain.jpg',
    '/images/photos/Screenshot 2025-09-10 131111.png',
    '/images/photos/821CC96E-87C9-4796-A2E0-9A8DD687C68A.jpg',
    '/images/photos/LaserLane1.png',
    '/images/photos/5CB5E1DB-5914-4C4E-94C2-75D414B3FBF0.jpg',
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
