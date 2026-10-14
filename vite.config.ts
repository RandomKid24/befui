import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// /web is the React-free build (see web/). Dev serves it from the project root; this copies it into dist.
const copyWeb = () => ({
  name: 'copy-web',
  closeBundle() {
    if (fs.existsSync('web')) fs.cpSync('web', 'dist/web', { recursive: true, filter: (f) => !f.endsWith('package.json') });
  },
});

// Dev only: serve the built HTML docs (npm run build:html) at /html, like the build does.
const serveHtmlDocs = () => ({
  name: 'serve-html-docs',
  configureServer(server: import('vite').ViteDevServer) {
    const types: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
    server.middlewares.use('/html', (req, res, next) => {
      const name = (req.url ?? '/').split('?')[0].replace(/^\/$/, '/index.html');
      const file = path.join('dist/html', path.normalize(name));
      if (!file.startsWith(path.normalize('dist/html')) || !fs.existsSync(file)) return next();
      res.setHeader('Content-Type', types[path.extname(file)] ?? 'application/octet-stream');
      res.end(fs.readFileSync(file));
    });
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), copyWeb(), serveHtmlDocs()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: { port: Number(process.env.PORT) || 3000, host: '0.0.0.0' },
  test: { environment: 'jsdom', setupFiles: ['./vitest.setup.ts'], include: ['src/**/*.test.{ts,tsx}'], testTimeout: 30000, css: false },
});
