// Vite does not minify ES-module libraries, so squeeze dist/html/befui.js and chunks/*.js here.
import fs from 'node:fs';
import { transformSync } from 'esbuild';

const files = ['dist/html/befui.js', ...fs.readdirSync('dist/html/chunks').map((f) => `dist/html/chunks/${f}`)].filter((f) => f.endsWith('.js'));
let before = 0, after = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const out = transformSync(src, { minify: true, format: 'esm', target: 'es2022', legalComments: 'none' }).code;
  fs.writeFileSync(f, out);
  before += src.length; after += out.length;
}
console.log(`minified ${files.length} files: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);
