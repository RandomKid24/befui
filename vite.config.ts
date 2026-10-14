import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: { port: Number(process.env.PORT) || 3000, host: '0.0.0.0' },
  test: { environment: 'jsdom', setupFiles: ['./vitest.setup.ts'], include: ['src/**/*.test.{ts,tsx}'], testTimeout: 30000, css: false },
});
