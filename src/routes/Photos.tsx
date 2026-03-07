import { SEO } from '../components/SEO'
import { Section } from '../components/Section'
import { PhotoGallery } from '../components/PhotoGallery'
import { cvData } from '../content/cv'

export function Photos() {
  const basePath = import.meta.env.BASE_URL || '/'
  const photosBasePath = `${basePath}images/photos/gallery/`
  
  // Curated list of the best 3D printing photos
  // This ensures we only show high-quality, relevant photos
  const photos = [
    `${photosBasePath}LaserLane1.png`,
    `${photosBasePath}SprunkeColaMain.jpg`,
    `${photosBasePath}IMG_2856.JPG`,
    `${photosBasePath}IMG_2859.PNG`,
    `${photosBasePath}IMG_2862.JPG`,
    `${photosBasePath}IMG_2864.JPG`,
    `${photosBasePath}IMG_3027.JPG`,
    `${photosBasePath}IMG_3062.jpg`,
    `${photosBasePath}IMG_3077.jpg`,
    `${photosBasePath}IMG_3078.jpg`,
    `${photosBasePath}IMG_3162.jpg`,
    `${photosBasePath}IMG_3168.jpg`,
    `${photosBasePath}IMG_3175.jpg`,
    `${photosBasePath}IMG_3179.jpg`,
    `${photosBasePath}IMG_3786.jpg`,
    `${photosBasePath}IMG_4062.jpg`,
    `${photosBasePath}IMG_4105.jpg`,
    `${photosBasePath}IMG_4110.jpg`,
    `${photosBasePath}IMG_4122.jpg`,
    `${photosBasePath}IMG_4130.jpg`,
    `${photosBasePath}IMG_4137.jpg`,
    `${photosBasePath}IMG_4140.jpg`,
    `${photosBasePath}IMG_1349.PNG`,
    `${photosBasePath}IMG_1481.jpg`,
    `${photosBasePath}IMG_1482.jpg`,
    `${photosBasePath}IMG_1484.jpg`,
    `${photosBasePath}IMG_1492.jpg`,
    `${photosBasePath}IMG_1504.jpg`,
    `${photosBasePath}IMG_1878.jpg`,
    `${photosBasePath}IMG_2171.jpg`,
    `${photosBasePath}IMG_2206.jpg`,
    `${photosBasePath}IMG_2323.jpg`,
    `${photosBasePath}IMG_2600.jpg`,
    `${photosBasePath}IMG_2784.jpg`,
    `${photosBasePath}IMG_0129.jpg`,
    `${photosBasePath}IMG_0633.jpg`,
    `${photosBasePath}IMG_0643.jpg`,
    `${photosBasePath}IMG_0647.jpg`,
    `${photosBasePath}IMG_0657.jpg`,
    `${photosBasePath}IMG_0659.jpg`,
    `${photosBasePath}IMG_0667.jpg`,
    `${photosBasePath}IMG_0727.jpg`,
    `${photosBasePath}IMG_1236.jpg`,
    `${photosBasePath}IMG_1320.jpg`,
    `${photosBasePath}5CB5E1DB-5914-4C4E-94C2-75D414B3FBF0.jpg`,
    `${photosBasePath}821CC96E-87C9-4796-A2E0-9A8DD687C68A.jpg`,
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
