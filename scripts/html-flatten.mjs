// Tailwind puts everything in @layer, and any unlayered CSS on the host page (h2 { ... }, button { ... }, a { ... }) beats layered rules no matter the specificity.
// Dropping the layers lets component classes win over a page's element selectors, like they do in the React site. Rule order stays, so base < utilities still holds.
import fs from 'node:fs';
import postcss from 'postcss';

for (const file of ['dist/html/befui.css']) {
  const root = postcss.parse(fs.readFileSync(file, 'utf8'));
  root.walkAtRules('layer', (at) => { if (at.nodes) at.replaceWith(at.nodes); else at.remove(); });
  fs.writeFileSync(file, root.toString());
  console.log(`flattened ${file}: ${(fs.statSync(file).size / 1024).toFixed(1)} KB`);
}
