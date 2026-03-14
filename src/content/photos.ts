export interface GalleryPhoto {
  src: string
  alt: string
}

const galleryPhotoFileNames = [
  'LaserLane1.webp',
  'SprunkeColaMain.webp',
  'IMG_2856.webp',
  'IMG_2859.webp',
  'IMG_2862.webp',
  'IMG_2864.webp',
  'IMG_3027.webp',
  'IMG_3062.webp',
  'IMG_3077.webp',
  'IMG_3078.webp',
  'IMG_3162.webp',
  'IMG_3168.webp',
  'IMG_3175.webp',
  'IMG_3179.webp',
  'IMG_3786.webp',
  'IMG_4062.webp',
  'IMG_4105.webp',
  'IMG_4110.webp',
  'IMG_4122.webp',
  'IMG_4130.webp',
  'IMG_4137.webp',
  'IMG_4140.webp',
  'IMG_1349.webp',
  'IMG_1481.webp',
  'IMG_1482.webp',
  'IMG_1484.webp',
  'IMG_1492.webp',
  'IMG_1504.webp',
  'IMG_1878.webp',
  'IMG_2171.webp',
  'IMG_2206.webp',
  'IMG_2323.webp',
  'IMG_2600.webp',
  'IMG_2784.webp',
  'IMG_0129.webp',
  'IMG_0633.webp',
  'IMG_0643.webp',
  'IMG_0647.webp',
  'IMG_0657.webp',
  'IMG_0659.webp',
  'IMG_0667.webp',
  'IMG_0727.webp',
  'IMG_1236.webp',
  'IMG_1320.webp',
  '5CB5E1DB-5914-4C4E-94C2-75D414B3FBF0.webp',
  '821CC96E-87C9-4796-A2E0-9A8DD687C68A.webp',
]

const toHumanLabel = (fileName: string) =>
  fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const galleryPhotos: GalleryPhoto[] = galleryPhotoFileNames.map((fileName, index) => ({
  src: `/images/photos/gallery/${fileName}`,
  alt: `3D printing portfolio photo ${index + 1}: ${toHumanLabel(fileName)}`,
}))

