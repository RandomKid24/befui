// Turns the props that cannot be attributes (functions, data holding functions) into the <script> of a generated example.
import fs from 'node:fs';
import ts from 'typescript';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Script } from './tag';

const ident = /^[A-Za-z_$][\w$]*$/;
const fnSource = (f: Function) => String(f).replace(/\/\* @__PURE__ \*\/ /g, '').replace(/\(0,\s*__vite_ssr_import_\d+__\.(\w+)\)/g, 'T.$1').replace(/__vite_ssr_import_\d+__\.(\w+)/g, 'T.$1');

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

/** Module-level statements of the example (data, helpers) that the generated code refers to, as plain JS. */
function helpers(slug: string, code: string) {
  const text = fs.readFileSync(`src/examples/${slug}.tsx`, 'utf8');
  const sf = ts.createSourceFile(`${slug}.tsx`, text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
  const uiNames = new Set<string>();
  const stmts: { names: string[]; text: string }[] = [];
  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st)) {
      const from = (st.moduleSpecifier as ts.StringLiteral).text;
      if (from.startsWith('@/components/ui/')) st.importClause?.namedBindings && ts.isNamedImports(st.importClause.namedBindings) && st.importClause.namedBindings.elements.forEach((e) => !e.isTypeOnly && uiNames.add(e.name.text));
      continue;
    }
    if (ts.isInterfaceDeclaration(st) || ts.isTypeAliasDeclaration(st)) continue;
    const isDefault = ts.getModifiers(st as ts.HasModifiers)?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword);
    if (isDefault) continue;
    const names: string[] = [];
    if (ts.isVariableStatement(st)) st.declarationList.declarations.forEach((d) => ts.isIdentifier(d.name) && names.push(d.name.text));
    else if (ts.isFunctionDeclaration(st) && st.name) names.push(st.name.text);
    if (names.length) stmts.push({ names, text: st.getText(sf) });
  }
  const need = new Set<number>();
  let grew = true;
  let hay = code;
  while (grew) {
    grew = false;
    stmts.forEach((s, i) => { if (!need.has(i) && s.names.some((n) => new RegExp(`\\b${n.replace(/\$/g, '\\$')}\\b`).test(hay))) { need.add(i); hay += '\n' + s.text; grew = true; } });
  }
  const js = ts.transpileModule([...need].sort((a, b) => a - b).map((i) => stmts[i]!.text).join('\n'), {
    compilerOptions: { jsx: ts.JsxEmit.React, jsxFactory: '__h', jsxFragmentFactory: '__Fragment', target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText.trim();
  const used = [...uiNames].filter((n) => new RegExp(`\\b${n}\\b`).test(js + '\n' + code));
  return { js, used };
}

export function buildScript(slug: string, scripts: Script[]) {
  const body = scripts.map(({ id, props }) => {
    const entries = Object.entries(props).map(([k, v]) => `  ${ident.test(k) ? k : JSON.stringify(k)}: ${toJs(v, '  ')},`);
    return `document.getElementById(${JSON.stringify(id)}).props = {\n${entries.join('\n')}\n};`;
  }).join('\n');
  const { js, used } = helpers(slug, body);
  const needsH = /\b__h\(|\b__Fragment\b|\bT\./.test(js + body);
  const prelude = [
    needsH && 'const { h: __h, T, Fragment: __Fragment } = befui;',
    ...used.map((n) => `const ${n} = T.${n};`),
  ].filter(Boolean).join('\n');
  return `<script type="module">\n${[prelude, js, body].filter(Boolean).join('\n\n')}\n</script>`;
}
