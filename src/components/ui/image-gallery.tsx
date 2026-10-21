'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface GalleryImage {
  src: string;
  alt: string;
  /** Width over height, so the layout is right before the image loads. Default 1. */
  ratio?: number;
  caption?: string;
}

/**
 * Masonry grid: images of different heights packed into columns with no gaps, each zooming a little on hover with its caption sliding up.
 * `onSelect` gets the index, so you can open the picture in an image viewer or a dialog. Columns follow the width of the card.
 */
export function ImageGallery({ images, onSelect, className }: { images: GalleryImage[]; onSelect?: (index: number) => void; className?: string }) {
  return (
    <div className={cn('w-full columns-2 gap-3 sm:columns-3 [&>*]:mb-3', className)}>
      {images.map((im, i) => (
        <button key={im.src + i} type="button" onClick={() => onSelect?.(i)} className="group relative block w-full overflow-hidden rounded-xl bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring" style={{ breakInside: 'avoid' }}>
          <img src={im.src} alt={im.alt} loading="lazy" style={{ aspectRatio: im.ratio ?? 1 }} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          {im.caption ? <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-xs font-medium text-white transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">{im.caption}</span> : null}
        </button>
      ))}
    </div>
  );
}
