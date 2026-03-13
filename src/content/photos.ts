export interface GalleryPhoto {
  src: string
  alt: string
}

const galleryPhotoFileNames = [
  'LaserLane1.png',
  'SprunkeColaMain.jpg',
  'IMG_2856.JPG',
  'IMG_2859.PNG',
  'IMG_2862.JPG',
  'IMG_2864.JPG',
  'IMG_3027.JPG',
  'IMG_3062.jpg',
  'IMG_3077.jpg',
  'IMG_3078.jpg',
  'IMG_3162.jpg',
  'IMG_3168.jpg',
  'IMG_3175.jpg',
  'IMG_3179.jpg',
  'IMG_3786.jpg',
  'IMG_4062.jpg',
  'IMG_4105.jpg',
  'IMG_4110.jpg',
  'IMG_4122.jpg',
  'IMG_4130.jpg',
  'IMG_4137.jpg',
  'IMG_4140.jpg',
  'IMG_1349.PNG',
  'IMG_1481.jpg',
  'IMG_1482.jpg',
  'IMG_1484.jpg',
  'IMG_1492.jpg',
  'IMG_1504.jpg',
  'IMG_1878.jpg',
  'IMG_2171.jpg',
  'IMG_2206.jpg',
  'IMG_2323.jpg',
  'IMG_2600.jpg',
  'IMG_2784.jpg',
  'IMG_0129.jpg',
  'IMG_0633.jpg',
  'IMG_0643.jpg',
  'IMG_0647.jpg',
  'IMG_0657.jpg',
  'IMG_0659.jpg',
  'IMG_0667.jpg',
  'IMG_0727.jpg',
  'IMG_1236.jpg',
  'IMG_1320.jpg',
  '5CB5E1DB-5914-4C4E-94C2-75D414B3FBF0.jpg',
  '821CC96E-87C9-4796-A2E0-9A8DD687C68A.jpg',
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

