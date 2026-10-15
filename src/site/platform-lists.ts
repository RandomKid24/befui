import { components } from '@/registry';

// Which components have an HTML or Flutter version. Only file names are read (the files themselves load on demand), so this is cheap enough for the sidebar.
const names = (paths: string[], strip: RegExp) => paths.map((p) => p.split('/').pop()!.replace(strip, '').replace(/_/g, '-'));

export const htmlSlugs = names(Object.keys(import.meta.glob('/src/html/demos/*.html')), /\.html$/).sort();
export const flutterSlugs = names(Object.keys(import.meta.glob('/flutter/lib/befui/*.dart')), /\.dart$/)
  .filter((n) => !['theme', 'core', 'icons'].includes(n))
  .sort();
export const hasHtml = (slug: string) => htmlSlugs.includes(slug);
export const hasFlutter = (slug: string) => flutterSlugs.includes(slug);

/** Components that have a version on this platform, in site order. */
export function platformList(platform: 'html' | 'flutter') {
  const have = new Set(platform === 'html' ? htmlSlugs : flutterSlugs);
  return components.filter((c) => have.has(c.slug));
}
