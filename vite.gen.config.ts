import path from 'path';
import { defineConfig } from 'vite';
// @ts-expect-error plain .mjs script, no types
import { buildManifest } from './scripts/html-manifest.mjs';

// Used by scripts/gen-html-demos.tsx (run with vite-node): every `@/components/ui/<name>` import becomes a module whose components are <bef-*> tag emitters.
const manifest = buildManifest() as Record<string, [string, string]>;
const shim = {
  name: 'tag-shim',
  enforce: 'pre' as const,
  resolveId(id: string) {
    return id.startsWith('\0shim:') ? id : null;
  },
  load(id: string) {
    if (!id.startsWith('\0shim:')) return null;
    const slug = id.slice(6);
    const real = path.resolve('src/components/ui', `${slug}.tsx`);
    const mine = Object.entries(manifest).filter(([, [f]]) => f === slug);
    return `export * from ${JSON.stringify(real)};
import { makeTag } from ${JSON.stringify(path.resolve('scripts/gen/tag.tsx'))};
${mine.map(([tag, [, name]]) => `export const ${name} = makeTag(${JSON.stringify(tag)});`).join('\n')}`;
  },
};

export default defineConfig({
  plugins: [shim],
  esbuild: { jsx: 'transform', jsxFactory: '__h', jsxFragment: '__Fragment' }, // JSX inside function props compiles to __h(...) calls, which the generated scripts provide
  resolve: { alias: [{ find: /^@\/components\/ui\/([\w-]+)$/, replacement: '\0shim:$1' }, { find: '@', replacement: path.resolve(__dirname, 'src') }] },
});
