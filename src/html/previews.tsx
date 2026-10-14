import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { DirectionProvider } from '@radix-ui/react-direction';
import './befui-html.css';

// The same example each component has on the React docs site, so the HTML docs can show it as the reference preview.
const demos = import.meta.glob<{ default: React.ComponentType }>('/src/examples/*.tsx');

/** Renders examples/<slug>.tsx into el. Returns a function that unmounts it. */
export async function mount(slug: string, el: HTMLElement) {
  const load = demos[`/src/examples/${slug}.tsx`];
  if (!load) throw new Error(`no example for ${slug}`);
  const { default: Demo } = await load();
  const root = createRoot(el);
  root.render(<DirectionProvider dir="ltr"><React.Suspense fallback={null}><Demo /></React.Suspense></DirectionProvider>);
  return () => queueMicrotask(() => root.unmount());
}
