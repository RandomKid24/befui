import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Same CSS as src/index.css, but theme + utilities only: no Tailwind preflight, so it does not reset the host page.
const noPreflight = () => ({
  name: 'no-preflight',
  enforce: 'pre' as const,
  transform(_: string, id: string) {
    if (!id.endsWith('befui-html.css')) return;
    const theme = fs.readFileSync('src/index.css', 'utf8').replace(/^@import 'tailwindcss'.*\n/, '');
    return `@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities) source('../components');
${theme}
@layer base { *, ::before, ::after { box-sizing: border-box; } }`;
  },
});

// Builds the all-components HTML bundle: dist/html/befui.js + befui.css (custom elements, React inside).
export default defineConfig({
  plugins: [noPreflight(), react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  publicDir: false,
  define: { 'process.env.NODE_ENV': '"production"' },
  build: {
    outDir: 'dist/html',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: { entry: 'src/html/entry.ts', formats: ['iife'], name: 'befuiHtml', fileName: () => 'befui.js', cssFileName: 'befui' },
  },
});
