// For each component: the CSS rules its source file uses, pulled out of the built befui.css, plus the theme variables and keyframes they need.
import fs from 'node:fs';
import postcss from 'postcss';

const unescapeCss = (s) => s.replace(/\\([\da-f]{1,6}) ?/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/\\(.)/g, '$1');
const classesOf = (selector) => [...selector.matchAll(/\.((?:\\.|[\w-])+)/g)].map((m) => unescapeCss(m[1]));
const vars = (text) => [...text.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]).filter((v) => !v.startsWith('--tw-'));

function print(node, depth = 1) {
  const pad = '  '.repeat(depth - 1);
  if (node.type === 'decl') return `${pad}${node.prop}: ${node.value};`;
  if (node.type === 'rule') return `${pad}${node.selector.replace(/,\s*/g, `,\n${pad}`)} {\n${node.nodes.map((n) => print(n, depth + 1)).join('\n')}\n${pad}}`;
  if (node.type === 'atrule') return node.nodes ? `${pad}@${node.name} ${node.params} {\n${node.nodes.map((n) => print(n, depth + 1)).join('\n')}\n${pad}}` : `${pad}@${node.name} ${node.params};`;
  return '';
}

export function buildComponentCss(cssFile, files, outDir) {
  const root = postcss.parse(fs.readFileSync(cssFile, 'utf8'));
  const byClass = new Map(); // class -> [{ order, wrappers: [at-rule], rule }]
  const defs = { light: new Map(), dark: new Map() }; // custom properties from :root and .dark
  const keyframes = new Map();
  const props = new Map();
  let order = 0;

  const index = (rule, wrappers) => {
    for (const c of classesOf(rule.selector)) { if (!byClass.has(c)) byClass.set(c, []); byClass.get(c).push({ order: order++, wrappers, rule }); }
  };
  const collectVars = (rule) => {
    const target = /(^|,)\s*\.dark\b/.test(rule.selector) ? defs.dark : /(:root|:host|\.light)/.test(rule.selector) ? defs.light : null;
    if (target) rule.each((d) => { if (d.type === 'decl' && d.prop.startsWith('--') && !d.prop.startsWith('--tw-') && !target.has(d.prop)) target.set(d.prop, d.value); });
  };
  const walk = (node, wrappers) => {
    node.each((n) => {
      if (n.type === 'rule') { collectVars(n); index(n, wrappers); }
      else if (n.type === 'atrule') {
        if (n.name === 'keyframes') keyframes.set(n.params, n);
        else if (n.name === 'property') props.set(n.params, n);
        else if (n.name === 'layer' && n.nodes) walk(n, wrappers);
        else if (n.nodes && /^(media|supports)$/.test(n.name)) walk(n, [...wrappers, n]);
      }
    });
  };
  walk(root, []);

  let written = 0;
  fs.mkdirSync(`${outDir}/css`, { recursive: true });
  for (const [slug, src] of Object.entries(files)) {
    const tokens = new Set();
    for (const m of src.matchAll(/(["'`])((?:\\.|(?!\1)[^\\])*)\1/g)) for (const t of m[2].split(/\s+/)) if (t) tokens.add(t);
    const hits = [...tokens].flatMap((t) => byClass.get(t) ?? []);
    const seen = new Set();
    const uniq = hits.filter((h) => !seen.has(h.rule) && seen.add(h.rule)).sort((a, b) => a.order - b.order);
    if (!uniq.length) continue;

    // group consecutive rules that share the same media/supports wrappers
    const body = [];
    for (const h of uniq) {
      const key = h.wrappers.map((w) => `${w.name} ${w.params}`).join('|');
      const last = body[body.length - 1];
      if (last && last.key === key) last.rules.push(h.rule); else body.push({ key, wrappers: h.wrappers, rules: [h.rule] });
    }
    const utilities = body.map(({ wrappers, rules }) => {
      const inner = rules.map((r) => print(r, wrappers.length + 1)).join('\n');
      return wrappers.reduceRight((acc, w, i) => `${'  '.repeat(i)}@${w.name} ${w.params} {\n${acc}\n${'  '.repeat(i)}}`, inner);
    }).join('\n\n');

    // theme variables and keyframes the rules read, followed transitively
    const text = utilities;
    const need = new Set(vars(text));
    const frames = new Set();
    const grow = (t) => { for (const [name] of keyframes) if (new RegExp(`(^|[\\s,(])${name.replace(/[-]/g, '\\-')}([\\s,;)]|$)`).test(t)) frames.add(name); };
    grow(text);
    for (let pass = 0; pass < 4; pass++) for (const v of [...need]) for (const m of [defs.light, defs.dark]) { const val = m.get(v); if (val) { vars(val).forEach((x) => need.add(x)); grow(val); } }
    const keyText = [...frames].map((n) => print(keyframes.get(n))).join('\n\n');
    const lines = (m) => [...need].filter((v) => m.get(v)).sort().map((v) => `  ${v}: ${m.get(v)};`);
    const light = lines(defs.light), dark = [...need].filter((v) => defs.dark.get(v) && defs.dark.get(v) !== defs.light.get(v)).sort().map((v) => `  ${v}: ${defs.dark.get(v)};`);
    const propText = [...props].filter(([name]) => new RegExp(`var\\(${name}[,)]`).test(text + keyText)).map(([, at]) => print(at)).join('\n');

    const parts = [
      '/* The rules this component uses, taken from befui.css. Load befui.css to get all of it; this is for reading, porting or restyling. */',
      light.length && `/* Theme variables it reads (set them on :root, or .dark for dark mode) */\n:root {\n${light.join('\n')}\n}`,
      dark.length && `.dark {\n${dark.join('\n')}\n}`,
      `/* Utility rules */\n${utilities}`,
      keyText && `/* Animations */\n${keyText}`,
      propText,
    ].filter(Boolean);
    fs.writeFileSync(`${outDir}/css/${slug}.css`, parts.join('\n\n') + '\n');
    written++;
  }
  return written;
}
