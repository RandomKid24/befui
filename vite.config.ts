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

export default defineConfig({
  plugins: [react(), tailwindcss(), copyWeb()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: { port: Number(process.env.PORT) || 3000, host: '0.0.0.0' },
  test: { environment: 'jsdom', setupFiles: ['./vitest.setup.ts'], include: ['src/**/*.test.{ts,tsx}'], testTimeout: 30000, css: false },
});
