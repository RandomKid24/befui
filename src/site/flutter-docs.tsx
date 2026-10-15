import * as React from 'react';
import { cn } from '@/lib/utils';

// The Flutter (Android and iOS) version of every component: one Dart file per widget in flutter/lib/befui, with an example in flutter/lib/examples.
// Delete this file and its uses in pages.tsx, App.tsx and layout.tsx to remove the Flutter section.
export const widgets = import.meta.glob<string>('/flutter/lib/befui/*.dart', { query: '?raw', import: 'default' });
export const examples = import.meta.glob<string>('/flutter/lib/examples/*.dart', { query: '?raw', import: 'default' });

export const snake = (slug: string) => slug.replace(/-/g, '_');
export const flutterSlugs = Object.keys(widgets)
  .map((p) => p.split('/').pop()!.replace('.dart', '').replace(/_/g, '-'))
  .filter((n) => !['theme', 'core', 'icons'].includes(n))
  .sort();
export const hasFlutter = (slug: string) => `/flutter/lib/befui/${snake(slug)}.dart` in widgets;

export function useText(files: Record<string, () => Promise<string>>, path: string) {
  const [text, setText] = React.useState<string | null>(null);
  React.useEffect(() => {
    let live = true;
    setText(null);
    (files[path]?.() ?? Promise.resolve('')).then((t) => live && setText(t));
    return () => { live = false; };
  }, [files, path]);
  return text;
}

/** The widget as rendered by Flutter (flutter test renders every example to a PNG, light and dark), shown inside an iPhone frame. */
function useDark() {
  const [dark, setDark] = React.useState(() => document.documentElement.classList.contains('dark'));
  React.useEffect(() => {
    const ob = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark')));
    ob.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => ob.disconnect();
  }, []);
  return dark;
}

/** The real Flutter widget, running in the browser at phone size. Drawn at 390px wide like a phone and scaled to fit the frame. */
function FlutterLive({ slug }: { slug: string }) {
  const box = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState({ w: 0, h: 0 });
  const dark = useDark();
  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);
  const k = size.w ? size.w / 390 : 1;
  return (
    <div ref={box} className="absolute inset-0">
      {size.w > 0 && (
        <iframe
          key={dark ? 'dark' : 'light'}
          title={`${slug} running in Flutter`}
          src={`${import.meta.env.BASE_URL}flutter-app/index.html?w=${slug}&theme=${dark ? 'dark' : 'light'}`}
          style={{ width: 390, height: size.h / k, transform: `scale(${k})`, transformOrigin: '0 0' }}
          className="absolute left-0 top-0 border-0 bg-transparent"
        />
      )}
    </div>
  );
}

export function FlutterShot({ slug, width = 300, className, live = 'off' }: { slug: string; width?: number; className?: string; live?: 'off' | 'click' | 'auto' }) {
  const [missing, setMissing] = React.useState(false);
  const [on, setOn] = React.useState(live === 'auto');
  if (missing) return null;
  return (
    <div className={cn('flex justify-center', className)}>
      <div className="relative" style={{ width: `min(100%, ${width}px)` }}>
        {/* side buttons: action, volume up/down, power */}
        <span aria-hidden className="absolute -left-[3px] top-[88px] h-6 w-[3px] rounded-l bg-neutral-500" />
        <span aria-hidden className="absolute -left-[3px] top-[132px] h-11 w-[3px] rounded-l bg-neutral-500" />
        <span aria-hidden className="absolute -left-[3px] top-[184px] h-11 w-[3px] rounded-l bg-neutral-500" />
        <span aria-hidden className="absolute -right-[3px] top-[148px] h-16 w-[3px] rounded-r bg-neutral-500" />
        {/* titanium rim, black bezel, screen */}
        <div className="rounded-[3.1rem] bg-gradient-to-b from-neutral-300 via-neutral-500 to-neutral-400 p-[2px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.45)]">
          <div className="rounded-[3rem] bg-black p-[8px]">
            <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[2.4rem] bg-background">
              <div className="relative flex h-12 shrink-0 items-center justify-between px-7 pt-2 text-[12px] font-semibold" style={{ zoom: Math.min(1, width / 300) }}>
                <span>9:41</span>
                <span aria-hidden className="absolute left-1/2 top-2.5 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
                <span aria-hidden className="flex items-center gap-1">
                  <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></svg>
                  <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M1 3.8a9 9 0 0 1 13 0M3.2 6.2a5.8 5.8 0 0 1 8.6 0" /><circle cx="7.5" cy="9" r="1" fill="currentColor" stroke="none" /></svg>
                  <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="18" height="8" rx="2.2" fill="currentColor" /><path d="M23 4v4a2 2 0 0 0 0-4z" fill="currentColor" opacity=".45" /></svg>
                </span>
              </div>
              <div className="relative min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {(['light', 'dark'] as const).map((m) => (
                  <img
                    key={m}
                    src={`${import.meta.env.BASE_URL}flutter/${slug}-${m}.webp`}
                    alt={`${slug} widget in Flutter, ${m} theme`}
                    width={390}
                    loading="lazy"
                    decoding="async"
                    onError={() => setMissing(true)}
                    className={cn('w-full', m === 'light' ? 'dark:hidden' : 'hidden dark:block')}
                  />
                ))}
                {on && <FlutterLive slug={slug} />}
                {live === 'click' && !on && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOn(true); }}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg hover:opacity-90"
                  >
                    Try it live
                  </button>
                )}
              </div>
              <div aria-hidden className="mx-auto mb-2 mt-1 h-[5px] w-[100px] shrink-0 rounded-full bg-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
