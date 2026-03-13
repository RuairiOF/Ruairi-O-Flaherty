import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import { cn } from '../lib/utils'
import type { GalleryPhoto } from '../content/photos'

interface PhotoGalleryProps {
  photos: GalleryPhoto[]
  className?: string
}

export function PhotoGallery({ photos, className = '' }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [loadedPhotos, setLoadedPhotos] = useState<Set<number>>(new Set())
  const [failedPhotos, setFailedPhotos] = useState<Set<number>>(new Set())

  const visiblePhotos = photos
    .map((photo, originalIndex) => ({ photo, originalIndex }))
    .filter((entry) => !failedPhotos.has(entry.originalIndex))

  if (photos.length === 0) {
    return (
      <div className={cn("text-center py-12 text-stone-500 dark:text-stone-400", className)}>
        <p>No 3D printing photos available yet.</p>
        <p className="text-sm mt-2">Add photos of your 3D printed creations to /public/images/photos/ to see them here.</p>
      </div>
    )
  }

  const openLightbox = (index: number) => {
    setSelectedPhoto(index)
  }

  const closeLightbox = () => {
    setSelectedPhoto(null)
  }

  const nextPhoto = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto((selectedPhoto + 1) % visiblePhotos.length)
    }
  }

  const prevPhoto = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto(selectedPhoto === 0 ? visiblePhotos.length - 1 : selectedPhoto - 1)
    }
  }

  const handleImageLoad = (index: number) => {
    setLoadedPhotos(prev => new Set([...prev, index]))
  }

  const handleImageError = (index: number) => {
    setFailedPhotos(prev => new Set([...prev, index]))
  }

  return (
    <>
      <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
        {visiblePhotos.map(({ photo, originalIndex }, visibleIndex) => {
          return (
            <div
              key={originalIndex}
              className="aspect-square overflow-hidden rounded-lg cursor-pointer group relative"
              onClick={() => openLightbox(visibleIndex)}
            >
              {!loadedPhotos.has(originalIndex) && (
                <div className="absolute inset-0 bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-stone-400" />
                </div>
              )}
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                onLoad={() => handleImageLoad(originalIndex)}
                onError={() => handleImageError(originalIndex)}
              />
            </div>
          )
        })}
      </div>

      {/* Lightbox */}
      {selectedPhoto !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-stone-300 transition-colors"
            aria-label="Close image gallery"
          >
            <X className="h-8 w-8" />
          </button>
          
          <button
            onClick={prevPhoto}
            className="absolute left-4 text-white hover:text-stone-300 transition-colors"
            aria-label="Previous gallery image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button
            onClick={nextPhoto}
            className="absolute right-4 text-white hover:text-stone-300 transition-colors"
            aria-label="Next gallery image"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          
          <div className="max-w-4xl max-h-[90vh] mx-auto px-16">
            <img
              src={visiblePhotos[selectedPhoto].photo.src}
              alt={visiblePhotos[selectedPhoto].photo.alt}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {selectedPhoto + 1} of {visiblePhotos.length}
          </div>
        </div>
      )}
    </>
  )
}
