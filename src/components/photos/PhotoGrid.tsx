import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import Masonry from '../reactbits/Masonry'
import Lightbox from '../Lightbox'
import { imageMeta } from '../SmartImage'
import PhotoTile from './PhotoTile'
import type { GalleryPhoto } from '@/content/photos'

interface PhotoGridProps {
  photos: GalleryPhoto[]
  className?: string
}

const TILE_SIZES = '(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw'

/**
 * Balanced masonry of the whole gallery. Every tile is a button that opens the
 * shared Lightbox at its own index — indices always match the full array.
 */
export default function PhotoGrid({ photos, className = '' }: PhotoGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (photos.length === 0) {
    return (
      <div className={`glass-panel rounded-2xl px-6 py-16 text-center ${className}`}>
        <ImageOff className="mx-auto mb-4 h-8 w-8 text-ink-muted" aria-hidden="true" />
        <p className="heading-4 text-ink">Nothing on the print bed yet</p>
        <p className="prose mx-auto mt-2 max-w-sm text-sm">
          New prints get photographed and land here. Check back soon.
        </p>
      </div>
    )
  }

  const items = photos.map((photo, index) => {
    const meta = imageMeta(photo.src)
    return {
      key: photo.src,
      aspectRatio: meta ? meta.width / meta.height : 1,
      node: (
        <PhotoTile
          src={photo.src}
          alt={photo.alt}
          index={index}
          total={photos.length}
          sizes={TILE_SIZES}
          onOpen={setOpenIndex}
        />
      ),
    }
  })

  return (
    <>
      <Masonry items={items} className={className} columns={[2, 3, 4]} gapClass="gap-3 sm:gap-4" />

      <Lightbox
        items={photos}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </>
  )
}
