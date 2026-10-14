import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Tailwind's preflight, but only inside bef-* roots (marked data-bef) and Radix portals (menus, dialogs), so the host page keeps its own styles.
const S = ':where([data-bef], .pv, [data-radix-popper-content-wrapper], [data-radix-portal], [role=dialog], [role=alertdialog])';
const scoped = `@layer base {
  [data-bef] { display: contents; }
  [data-bef][style] { display: block; }
  ${S} :where(*, ::before, ::after) { box-sizing: border-box; border: 0 solid; border-color: var(--border); margin: 0; padding: 0; }
  ${S} :where(button, input, select, textarea, optgroup) { font: inherit; letter-spacing: inherit; color: inherit; background: transparent; border-radius: 0; opacity: 1; }
  ${S} :where(h1, h2, h3, h4, h5, h6) { font-size: inherit; font-weight: inherit; }
  ${S} :where(a) { color: inherit; text-decoration: inherit; }
  ${S} :where(ol, ul, menu) { list-style: none; }
  ${S} :where(img, svg, video, canvas, audio, iframe) { display: block; vertical-align: middle; }
  ${S} :where(table) { border-collapse: collapse; text-indent: 0; border-color: inherit; }
  ${S} :where(img, video) { max-width: 100%; height: auto; }
  ${S} :where(button, [type=button], [type=submit]) { appearance: button; }
}`;

// Same CSS as src/index.css, but theme + utilities only: no Tailwind preflight, so it does not reset the host page.
const noPreflight = (examples: boolean) => ({
  name: 'no-preflight',
  enforce: 'pre' as const,
  transform(_: string, id: string) {
    if (!id.endsWith('befui-html.css')) return;
    const theme = fs.readFileSync('src/index.css', 'utf8').replace(/^@import 'tailwindcss'.*\n/, '');
    return `@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities) source('../components');
${examples ? "@source '../examples';\n" : ''}${theme}
${scoped}`;
  },
});

// Two builds: default = the all-components bundle, dist/html/befui.js + befui.css (custom elements, React inside).
// --mode previews = the React examples the docs page shows next to the HTML ones, dist/html/previews/ (ES modules, one chunk per example).
export default defineConfig(({ mode }) => {
  const previews = mode === 'previews';
  return {
    plugins: [noPreflight(previews), react(), tailwindcss()],
    resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
    publicDir: false,
    define: { 'process.env.NODE_ENV': '"production"' },
    build: previews
      ? { outDir: 'dist/html/previews', emptyOutDir: true, cssCodeSplit: false, lib: { entry: 'src/html/previews.tsx', formats: ['es'], fileName: () => 'previews.js', cssFileName: 'previews' } }
      : { outDir: 'dist/html', emptyOutDir: true, cssCodeSplit: false, lib: { entry: 'src/html/entry.ts', formats: ['iife'], name: 'befuiHtml', fileName: () => 'befui.js', cssFileName: 'befui' } },
  };
});
