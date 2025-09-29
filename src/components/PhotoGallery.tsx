import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import { cn } from '../lib/utils'

interface PhotoGalleryProps {
  photos: string[]
  className?: string
}

export function PhotoGallery({ photos, className = '' }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [loadedPhotos, setLoadedPhotos] = useState<Set<number>>(new Set())
  const [failedPhotos, setFailedPhotos] = useState<Set<number>>(new Set())

  // Filter out failed photos for display
  const validPhotos = photos.filter((_, index) => !failedPhotos.has(index))

  if (photos.length === 0) {
    return (
      <div className={cn("text-center py-12 text-gray-500 dark:text-gray-400", className)}>
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
      setSelectedPhoto((selectedPhoto + 1) % validPhotos.length)
    }
  }

  const prevPhoto = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto(selectedPhoto === 0 ? validPhotos.length - 1 : selectedPhoto - 1)
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
        {photos.map((photo, index) => {
          if (failedPhotos.has(index)) {
            return null // Don't render failed images
          }
          
          return (
            <div
              key={index}
              className="aspect-square overflow-hidden rounded-lg cursor-pointer group relative"
              onClick={() => openLightbox(index)}
            >
              {!loadedPhotos.has(index) && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <img
                src={photo}
                alt={`3D Printing Photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
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
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="h-8 w-8" />
          </button>
          
          <button
            onClick={prevPhoto}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button
            onClick={nextPhoto}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          
          <div className="max-w-4xl max-h-[90vh] mx-auto px-16">
            <img
              src={validPhotos[selectedPhoto]}
              alt={`3D Printing Photo ${selectedPhoto + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {selectedPhoto + 1} of {validPhotos.length}
          </div>
        </div>
      )}
    </>
  )
}
