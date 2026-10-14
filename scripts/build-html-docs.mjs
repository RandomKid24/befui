// Builds dist/html docs: demos.json (component list + the HTML example for each) and copies the docs shell.
import fs from 'node:fs';
import { buildComponentCss } from './html-css.mjs';

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
const src = fs.readFileSync('src/registry/index.ts', 'utf8');
const unesc = (s) => s.replace(/\\(.)/g, '$1');
const metas = [...src.matchAll(/^  m\('([a-z0-9-]+)', '((?:[^'\\]|\\.)*)', '([A-Za-z]+)', '((?:[^'\\]|\\.)*)'(.*)\),?$/gm)];
const list = [], demo = {};
for (const [, slug, name, category, description, rest] of metas) {
  const file = fs.readFileSync(`src/components/ui/${slug}.tsx`, 'utf8');
  const tags = [...file.matchAll(/^export (?:const|function) ([A-Z]\w*)/gm)].map((x) => `bef-${kebab(x[1])}`);
  list.push({ slug, name: unesc(name), category, description: unesc(description), wide: /wide:\s*true/.test(rest), tags });
  const f = `src/html/demos/${slug}.html`;
  if (fs.existsSync(f)) demo[slug] = fs.readFileSync(f, 'utf8').trim();
}
fs.mkdirSync('dist/html', { recursive: true });
fs.writeFileSync('dist/html/demos.json', JSON.stringify({ list, demo }));
for (const f of ['docs.css', 'docs.js']) fs.copyFileSync(`src/html/docs/${f}`, `dist/html/${f}`);
fs.copyFileSync('src/html/docs/index.html', 'dist/html/index.html');
const sources = Object.fromEntries(list.map((c) => [c.slug, fs.readFileSync(`src/components/ui/${c.slug}.tsx`, 'utf8')]));
const cssCount = buildComponentCss('dist/html/befui.css', sources, 'dist/html');
for (const c of list) c.css = fs.existsSync(`dist/html/css/${c.slug}.css`);
fs.writeFileSync('dist/html/demos.json', JSON.stringify({ list, demo }));
console.log(`html docs (css for ${cssCount}): ${list.length} components, ${Object.keys(demo).length} with an example`);
