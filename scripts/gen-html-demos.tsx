// Generates src/html/demos/<slug>.html for every component by running the real React example with <bef-*> tag emitters (see vite.gen.config.ts).
// Run: npx vite-node -c vite.gen.config.ts scripts/gen-html-demos.tsx [slug ...]
import * as React from 'react';
import fs from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { finish, notes } from './gen/tag';
import { format, tidyAttrs } from './gen/format';
import { buildScript } from './gen/script';

// JSX in the examples compiles to __h(...) / __Fragment (see vite.gen.config.ts)
(globalThis as unknown as Record<string, unknown>).__h = React.createElement;
(globalThis as unknown as Record<string, unknown>).__Fragment = React.Fragment;

const slugs = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync('src/examples').map((f) => f.replace(/\.tsx$/, '')).sort();
fs.mkdirSync('src/html/demos', { recursive: true });
const report: Record<string, string[]> = {};
for (const slug of slugs) {
  notes.dropped.clear(); notes.scripts.length = 0; notes.n = 0;
  try {
    const mod = await import(`/src/examples/${slug}.tsx`);
    const Demo = mod.default as React.ComponentType;
    const markup = tidyAttrs(finish(renderToStaticMarkup(<Demo />)));
    let html = format(markup);
    const flags = [...notes.dropped].map((d) => `dropped ${d}`);
    if (notes.scripts.length) {
      html += '\n' + buildScript(slug, notes.scripts) + '\n';
    }
    fs.writeFileSync(`src/html/demos/${slug}.html`, html.replace(/\n+$/, '') + '\n');
    if (flags.length) report[slug] = flags;
  } catch (e) {
    report[slug] = [`ERROR ${(e as Error).message.slice(0, 120)}`];
  }
}
fs.writeFileSync('src/html/demos/_report.json', JSON.stringify(report, null, 1));
console.log(`generated ${slugs.length}, ${Object.keys(report).length} need attention`);
