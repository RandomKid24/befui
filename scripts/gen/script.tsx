// Turns the props that cannot be attributes (functions, data holding functions) into the <script> of a generated example.
import fs from 'node:fs';
import ts from 'typescript';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Script } from './tag';

const ident = /^[A-Za-z_$][\w$]*$/;
let components: Record<string, unknown> = {}; // tag manifest of the run in progress
const fnSource = (f: Function) => String(f).replace(/__vite_ssr_import_\d+__\.toast\b/g, 'befui.toast').replace(/\/\* @__PURE__ \*\/ /g, '').replace(/\(0,\s*__vite_ssr_import_\d+__\.(\w+)\)/g, (_, n) => ref(n)).replace(/__vite_ssr_import_\d+__\.(\w+)/g, (_, n) => ref(n));
const ref = (n: string) => (`bef-${n.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase()}` in components ? `T.${n}` : n);

function toJs(v: unknown, indent: string): string {
  if (typeof v === 'function') return fnSource(v);
  if (React.isValidElement(v)) return JSON.stringify(renderToStaticMarkup(<>{v}</>));
  if (v instanceof Date) return `new Date(${JSON.stringify(v.toISOString())})`;
  const inner = indent + '  ';
  if (Array.isArray(v)) {
    const items = v.map((x) => toJs(x, inner));
    const one = `[${items.join(', ')}]`;
    return one.length <= 90 && !one.includes('\n') ? one : `[\n${items.map((i) => inner + i).join(',\n')},\n${indent}]`;
  }
  if (v && typeof v === 'object') {
    const items = Object.entries(v).map(([k, x]) => `${ident.test(k) ? k : JSON.stringify(k)}: ${toJs(x, inner)}`);
    const one = `{ ${items.join(', ')} }`;
    return one.length <= 90 && !one.includes('\n') ? one : `{\n${items.map((i) => inner + i).join(',\n')},\n${indent}}`;
  }
  return JSON.stringify(v) ?? 'undefined';
}

const GLOBALS = new Set(['befui', 'T', '__h', '__Fragment', 'Date', 'Math', 'JSON', 'Intl', 'Number', 'String', 'Array', 'Object', 'Promise', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'DOMException', 'AbortController', 'Blob', 'File', 'URL', 'FormData', 'requestAnimationFrame', 'structuredClone', 'crypto', 'console', 'document', 'window', 'undefined', 'NaN', 'Infinity', 'Boolean', 'parseInt', 'parseFloat', 'Set', 'Map', 'Error', 'RegExp', 'isNaN', 'navigator', 'location']);

/** Names a function source uses that are neither its own locals nor allowed globals. */
export function freeNames(src: string, known: Set<string>) {
  const sf = ts.createSourceFile('f.js', `(${src})`, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS);
  const locals = new Set<string>();
  const refs = new Set<string>();
  const bind = (n: ts.Node) => { if (ts.isIdentifier(n)) locals.add(n.text); else n.forEachChild(bind); };
  const visit = (n: ts.Node) => {
    if ((ts.isParameter(n) || ts.isVariableDeclaration(n) || ts.isBindingElement(n)) && n.name) bind(n.name);
    if ((ts.isFunctionDeclaration(n) || ts.isFunctionExpression(n)) && n.name) locals.add(n.name.text);
    if (ts.isIdentifier(n)) {
      const p = n.parent;
      const isProp = (ts.isPropertyAccessExpression(p) && p.name === n) || (ts.isPropertyAssignment(p) && p.name === n) || (ts.isMethodDeclaration(p) && p.name === n) || (ts.isShorthandPropertyAssignment(p) && false);
      if (!isProp) refs.add(n.text);
    }
    n.forEachChild(visit);
  };
  visit(sf);
  return [...refs].filter((r) => !locals.has(r) && !GLOBALS.has(r) && !known.has(r));
}

const kebab = (n: string) => n.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();

/** What the example file declares at module level and imports from the library. */
function moduleInfo(slug: string) {
  const text = fs.readFileSync(`src/examples/${slug}.tsx`, 'utf8');
  const sf = ts.createSourceFile(`${slug}.tsx`, text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
  const imports = new Map<string, string>(); // name -> library file
  const stmts: { names: string[]; text: string }[] = [];
  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st)) {
      const from = (st.moduleSpecifier as ts.StringLiteral).text;
      const nb = st.importClause?.namedBindings;
      if (from.startsWith('@/components/ui/') && nb && ts.isNamedImports(nb)) nb.elements.forEach((e) => !e.isTypeOnly && imports.set(e.name.text, from.slice('@/components/ui/'.length)));
      continue;
    }
    if (ts.isInterfaceDeclaration(st) || ts.isTypeAliasDeclaration(st)) continue;
    if (ts.getModifiers(st as ts.HasModifiers)?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)) continue;
    const names: string[] = [];
    if (ts.isVariableStatement(st)) st.declarationList.declarations.forEach((d) => ts.isIdentifier(d.name) && names.push(d.name.text));
    else if (ts.isFunctionDeclaration(st) && st.name) names.push(st.name.text);
    if (names.length) stmts.push({ names, text: st.getText(sf) });
  }
  // plain consts inside the demo component (const today = ..., const columns = [...]) behave like module-level ones as long as no hook is involved
  const demo = sf.statements.find((st): st is ts.FunctionDeclaration => ts.isFunctionDeclaration(st) && !!ts.getModifiers(st)?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword));
  for (const st of demo?.body?.statements ?? []) {
    if (!ts.isVariableStatement(st) || /\buse[A-Z]\w*\(|React\.use\w*\(/.test(st.getText(sf))) continue;
    const names: string[] = [];
    st.declarationList.declarations.forEach((d) => ts.isIdentifier(d.name) && names.push(d.name.text));
    if (names.length) stmts.push({ names, text: st.getText(sf) });
  }
  return { imports, stmts };
}

const fnsIn = (v: unknown): Function[] =>
  typeof v === 'function' ? [v] : Array.isArray(v) ? v.flatMap(fnsIn) : v && typeof v === 'object' && !React.isValidElement(v) && !(v instanceof Date) ? Object.values(v).flatMap(fnsIn) : [];

export async function buildScript(slug: string, scripts: Script[], manifest: Record<string, unknown>) {
  components = manifest;
  const info = moduleInfo(slug);
  const everyName = new Set([...info.imports.keys(), ...info.stmts.flatMap((s) => s.names)]);
  // a helper statement is usable when everything it refers to is usable too (not state, not setState...)
  const okStmt = new Set(info.stmts.map((_, i) => i));
  for (let changed = true; changed;) {
    changed = false;
    const okNames = new Set([...info.imports.keys(), ...[...okStmt].flatMap((i) => info.stmts[i]!.names)]);
    for (const i of [...okStmt]) {
      const js = ts.transpileModule(info.stmts[i]!.text, { compilerOptions: { jsx: ts.JsxEmit.React, jsxFactory: '__h', jsxFragmentFactory: '__Fragment', target: ts.ScriptTarget.ES2022 } }).outputText;
      const own = new Set(info.stmts[i]!.names);
      const bad = freeNames(js.replace(/;\s*$/, '').replace(/^(?:const|let|var)\s+\w+\s*=\s*/, ''), new Set([...okNames, ...own]));
      if (bad.length) { okStmt.delete(i); changed = true; }
    }
  }
  const known = new Set([...info.imports.keys(), ...[...okStmt].flatMap((i) => info.stmts[i]!.names)]);
  void everyName;
  const flags: string[] = [];
  const usedIds = new Set<string>();
  const entries = scripts.map(({ id, props }) => {
    const keep: string[] = [];
    for (const [k, v] of Object.entries(props)) {
      const bad = fnsIn(v).flatMap((f) => freeNames(fnSource(f), known));
      if (bad.length) { flags.push(/^on[A-Z]/.test(k) ? `dropped ${k} (uses ${[...new Set(bad)].join(', ')})` : `MANUAL ${k} uses ${[...new Set(bad)].join(', ')}`); continue; }
      keep.push(`  ${ident.test(k) ? k : JSON.stringify(k)}: ${toJs(v, '  ')},`);
    }
    if (!keep.length) return '';
    usedIds.add(id);
    return `document.getElementById(${JSON.stringify(id)}).props = {\n${keep.join('\n')}\n};`;
  }).filter(Boolean);
  if (!entries.length) return { html: '', usedIds, flags };

  const body = entries.join('\n');
  // module-level statements (data, helpers) the code refers to, transitively
  const need = new Set<number>();
  let hay = body;
  for (let grew = true; grew;) {
    grew = false;
    info.stmts.forEach((st, i) => { if (okStmt.has(i) && !need.has(i) && st.names.some((n) => new RegExp(`\\b${n.replace(/\$/g, '\\$')}\\b`).test(hay))) { need.add(i); hay += '\n' + st.text; grew = true; } });
  }
  const js = ts.transpileModule([...need].sort((a, b) => a - b).map((i) => info.stmts[i]!.text).join('\n'), {
    compilerOptions: { jsx: ts.JsxEmit.React, jsxFactory: '__h', jsxFragmentFactory: '__Fragment', target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText.trim();
  const code = js + '\n' + body;
  // library names the code uses: components become tag names, plain functions (startOfDay, formatCurrency...) are copied in
  const prelude: string[] = [];
  for (const [name, file] of info.imports) {
    if (name === 'toast' || !new RegExp(`\\b${name}\\b`).test(code)) continue;
    if (`bef-${kebab(name)}` in manifest) prelude.push(`const ${name} = T.${name};`);
    else {
      const real = (await import(/* @vite-ignore */ `/src/components/ui/${file}.tsx`))[name];
      prelude.push(`const ${name} = ${typeof real === 'function' ? fnSource(real) : JSON.stringify(real)};`);
    }
  }
  const needsH = /\b__h\(|\b__Fragment\b|\bT\./.test(code + prelude.join('\n'));
  const top = [needsH && 'const { h: __h, T, Fragment: __Fragment } = befui;', ...prelude].filter(Boolean).join('\n');
  return { html: `<script type="module">\n${[top, js, body].filter(Boolean).join('\n\n')}\n</script>`, usedIds, flags };
}
