// Cuts the rules each component uses out of the built dist/html/befui.css and writes src/html/css/<slug>.css (the CSS tab on the site).
import fs from 'node:fs';
import { buildComponentCss } from './html-css.mjs';

fs.rmSync('src/html/css', { recursive: true, force: true });
const sources = Object.fromEntries(fs.readdirSync('src/components/ui').filter((f) => f.endsWith('.tsx')).map((f) => [f.replace(/\.tsx$/, ''), fs.readFileSync(`src/components/ui/${f}`, 'utf8')]));
console.log(`css: ${buildComponentCss('dist/html/befui.css', sources, 'src/html')} components`);
