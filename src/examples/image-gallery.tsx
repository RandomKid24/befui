import { ImageGallery } from '@/components/ui/image-gallery';

/** Inline SVG pictures so the demo needs no network; use real photo URLs in your app. */
const pic = (a: string, b: string, w: number, h: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/></svg>`)}`;

export default function ImageGalleryDemo() {
  const data: [string, string, number, number, string][] = [
    ['#6366f1', '#ec4899', 4, 5, 'Sunset'], ['#06b6d4', '#10b981', 1, 1, 'Lagoon'], ['#f59e0b', '#ef4444', 4, 3, 'Ember'],
    ['#8b5cf6', '#3b82f6', 3, 4, 'Dusk'], ['#14b8a6', '#84cc16', 1, 1, 'Meadow'], ['#f43f5e', '#f59e0b', 5, 4, 'Spice'],
  ];
  return <ImageGallery className="w-[32rem] max-w-full" images={data.map(([a, b, w, h, c]) => ({ src: pic(a, b, w * 100, h * 100), alt: c, ratio: w / h, caption: c }))} />;
}
