import { SEO } from '../components/SEO'
import { Section } from '../components/Section'
import { PhotoGallery } from '../components/PhotoGallery'
import { cvData } from '../content/cv'

export function Photos() {
  const basePath = import.meta.env.VITE_BASE_PATH || '/'
  
  // Curated list of the best 3D printing photos
  // This ensures we only show high-quality, relevant photos
  const photos = [
    `${basePath}images/photos/LaserLane1.png`,
    `${basePath}images/photos/SprunkeColaMain.jpg`,
    `${basePath}images/photos/IMG_2856.JPG`,
    `${basePath}images/photos/IMG_2859.PNG`,
    `${basePath}images/photos/IMG_2862.JPG`,
    `${basePath}images/photos/IMG_2864.JPG`,
    `${basePath}images/photos/IMG_3027.JPG`,
    `${basePath}images/photos/IMG_3062.jpg`,
    `${basePath}images/photos/IMG_3077.jpg`,
    `${basePath}images/photos/IMG_3078.jpg`,
    `${basePath}images/photos/IMG_3162.jpg`,
    `${basePath}images/photos/IMG_3168.jpg`,
    `${basePath}images/photos/IMG_3175.jpg`,
    `${basePath}images/photos/IMG_3179.jpg`,
    `${basePath}images/photos/IMG_3786.jpg`,
    `${basePath}images/photos/IMG_4062.jpg`,
    `${basePath}images/photos/IMG_4105.jpg`,
    `${basePath}images/photos/IMG_4110.jpg`,
    `${basePath}images/photos/IMG_4122.jpg`,
    `${basePath}images/photos/IMG_4130.jpg`,
    `${basePath}images/photos/IMG_4137.jpg`,
    `${basePath}images/photos/IMG_4140.jpg`,
    `${basePath}images/photos/IMG_1349.PNG`,
    `${basePath}images/photos/IMG_1481.jpg`,
    `${basePath}images/photos/IMG_1482.jpg`,
    `${basePath}images/photos/IMG_1484.jpg`,
    `${basePath}images/photos/IMG_1492.jpg`,
    `${basePath}images/photos/IMG_1504.jpg`,
    `${basePath}images/photos/IMG_1878.jpg`,
    `${basePath}images/photos/IMG_2171.jpg`,
    `${basePath}images/photos/IMG_2206.jpg`,
    `${basePath}images/photos/IMG_2323.jpg`,
    `${basePath}images/photos/IMG_2600.jpg`,
    `${basePath}images/photos/IMG_2784.jpg`,
    `${basePath}images/photos/IMG_0129.jpg`,
    `${basePath}images/photos/IMG_0633.jpg`,
    `${basePath}images/photos/IMG_0643.jpg`,
    `${basePath}images/photos/IMG_0647.jpg`,
    `${basePath}images/photos/IMG_0657.jpg`,
    `${basePath}images/photos/IMG_0659.jpg`,
    `${basePath}images/photos/IMG_0667.jpg`,
    `${basePath}images/photos/IMG_0727.jpg`,
    `${basePath}images/photos/IMG_1236.jpg`,
    `${basePath}images/photos/IMG_1320.jpg`,
    `${basePath}images/photos/5CB5E1DB-5914-4C4E-94C2-75D414B3FBF0.jpg`,
    `${basePath}images/photos/821CC96E-87C9-4796-A2E0-9A8DD687C68A.jpg`,
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
