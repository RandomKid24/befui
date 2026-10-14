// Stand-in for every library component while generating the HTML examples: instead of rendering the component it renders its <bef-*> tag,
// so running the real React example (state, maps, local helpers and all) with renderToStaticMarkup produces the HTML for it.
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
const COLON = '__colon__', TILDE = '__tilde__';

export type Script = { id: string; props: Record<string, unknown> };
// per example run: handlers we dropped (clicks and the like), and props that need script (functions, or data holding functions)
export const notes: { dropped: Set<string>; scripts: Script[]; n: number } = { dropped: new Set(), scripts: [], n: 0 };
const asHtml = (el: React.ReactNode) => renderToStaticMarkup(<>{el}</>);

function json(v: unknown): string | undefined {
  return JSON.stringify(v, (_k, x) => {
    if (React.isValidElement(x)) return asHtml(x);
    if (typeof x === 'function') { notes.dropped.add('fn-in-data'); return undefined; }
    return x;
  }, undefined);
}
// Dates become "~iso" inside JSON (read back as Date by the runtime)
const reviveDates = (v: unknown): unknown => (v instanceof Date ? `~${v.toISOString()}` : Array.isArray(v) ? v.map(reviveDates) : v && typeof v === 'object' && !React.isValidElement(v) && Object.getPrototypeOf(v) === Object.prototype ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, reviveDates(x)])) : v);

const holdsFn = (v: unknown): boolean =>
  typeof v === 'function' || (Array.isArray(v) ? v.some(holdsFn) : !!v && typeof v === 'object' && !React.isValidElement(v) && !(v instanceof Date) && Object.getPrototypeOf(v) === Object.prototype && Object.values(v).some(holdsFn));

function toAttrs(props: Record<string, unknown>) {
  const attrs: Record<string, unknown> = {};
  const emit: string[] = [];
  const script: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (k === 'children' || k === 'key' || k === 'ref') continue;
    if (k === 'className') { if (v) attrs.class = v; continue; }
    if (k === 'style') { attrs.style = v; continue; }
    if (typeof v === 'function' && /^on[A-Z]\w*Change$|^onChange$/.test(k)) { emit.push(kebab(k.slice(2))); continue; }
    if (typeof v === 'function' && /^on[A-Z]/.test(k)) { notes.dropped.add(k); continue; } // clicks and the like: nothing to draw
    if (holdsFn(v)) { script[k] = v; continue; }
    const name = /^(data|aria|hx)-/.test(k) ? k : k === 'htmlFor' ? 'for' : kebab(k);
    if (v === undefined || v === null) continue;
    if (v === true) attrs[name] = '';
    else if (typeof v === 'string') attrs[name] = v;
    else if (v instanceof Date) attrs[TILDE + name] = v.toISOString();
    else if (React.isValidElement(v)) attrs[COLON + name] = JSON.stringify(asHtml(v));
    else { const j = json(reviveDates(v)); if (j !== undefined) attrs[COLON + name] = j; }
  }
  if (emit.length) attrs.emit = emit.join(' ');
  if (Object.keys(script).length) {
    const id = typeof attrs.id === 'string' ? attrs.id : `g${++notes.n}`;
    attrs.id = id;
    notes.scripts.push({ id, props: script });
  }
  return attrs;
}

export function makeTag(tag: string) {
  const Shim = (props: Record<string, unknown>) => {
    if (typeof props.children === 'function') notes.dropped.add('render-children');
    return React.createElement(tag, toAttrs(props), props.children as React.ReactNode);
  };
  Shim.displayName = tag;
  return Shim;
}

/** Turns the placeholder attribute names back into :name and ~name. */
export const finish = (html: string) => html.replaceAll(` ${COLON}`, ' :').replaceAll(` ${TILDE}`, ' ~');
