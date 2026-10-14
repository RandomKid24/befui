import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Tailwind's preflight, but only inside bef-* roots (marked data-bef) and Radix portals (menus, dialogs), so the host page keeps its own styles.
const S = ':where([data-bef], .pv, [data-radix-popper-content-wrapper], [data-radix-portal], [role=dialog], [role=alertdialog])';
// The React site gets Inter from Google Fonts in index.html and sets it on <body>; here the components carry the font themselves.
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
const scoped = `@layer base {
  [data-bef] { display: contents; }
  ${S} { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; font-feature-settings: 'cv11', 'ss01'; line-height: 1.5; -webkit-font-smoothing: antialiased; }
  ${S} :where(code, kbd, samp, pre) { font-family: 'JetBrains Mono', ui-monospace, monospace; }
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
  ${S} :where(button:not(:disabled), [role='button']:not([aria-disabled='true'])) { cursor: pointer; }
}
@media (prefers-reduced-motion: reduce) { ${S}, ${S} *, ${S} *::before, ${S} *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`;

// Same CSS as src/index.css, but theme + utilities only: no Tailwind preflight, so it does not reset the host page.
const noPreflight = () => ({
  name: 'no-preflight',
  enforce: 'pre' as const,
  transform(_: string, id: string) {
    if (!id.endsWith('befui-html.css')) return;
    // The site's own global rules (html, body, ::selection, scrollbars, reduced motion) stay out: this CSS must not restyle the host page. The useful ones are scoped in `scoped`.
    const theme = fs.readFileSync('src/index.css', 'utf8')
      .replace(/^@import 'tailwindcss'.*\n/, '')
      .replace(/@layer base \{[\s\S]*?\n\}\n/, '')
      .replace(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\n\}\n/, '');
    return `@import url('${FONT_URL}');
@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities) source('../components');
@source '../html/demos';
${theme}
${scoped}`;
  },
});

// Builds the standalone bundle: dist/html/befui.js (a small ES module) + chunks/ (one per component file, loaded when its tag first appears) + befui.css.
export default defineConfig({
  plugins: [noPreflight(), react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  publicDir: false,
  define: { 'process.env.NODE_ENV': '"production"' },
  build: { outDir: 'dist/html', emptyOutDir: true, cssCodeSplit: false, lib: { entry: 'src/html/bundle.ts', formats: ['es'], fileName: () => 'befui.js', cssFileName: 'befui' }, rollupOptions: { output: { chunkFileNames: 'chunks/[name].js' } } },
});
