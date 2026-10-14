// Stand-in for every library component while generating the HTML examples: instead of rendering the component it renders its <bef-*> tag,
// so running the real React example (state, maps, local helpers and all) with renderToStaticMarkup produces the HTML for it.
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { tidyAttrs } from './format';

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
const COLON = '__colon__', TILDE = '__tilde__', TRUE = '\u0001true'; // TRUE marks a bare attribute, so a real empty string survives

export type Script = { id: string; props: Record<string, unknown> };
// per example run: handlers we dropped (clicks and the like), and props that need script (functions, or data holding functions)
export const notes: { dropped: Set<string>; scripts: Script[]; n: number } = { dropped: new Set(), scripts: [], n: 0 };
const asHtml = (el: React.ReactNode) => tidyAttrs(finish(renderToStaticMarkup(<>{el}</>))); // same cleanup as the top level, so nested markup reads the same

// Epoch timestamps and dates close to the moment of generation become "~now-14m", so the example does not show a frozen time.
const rel = (t: number) => {
  const d = Date.now() - t;
  if (Math.abs(d) > 3 * 864e5) return null;
  const sign = d >= 0 ? '-' : '+';
  const a = Math.abs(d);
  return a < 90e3 ? '~now' : a < 90 * 6e4 ? `~now${sign}${Math.round(a / 6e4)}m` : a < 36 * 36e5 ? `~now${sign}${Math.round(a / 36e5)}h` : `~now${sign}${Math.round(a / 864e5)}d`;
};
function json(v: unknown): string | undefined {
  return JSON.stringify(v, (k, x) => {
    if (typeof x === 'number' && x > 1.6e12 && /^(at|time|date|created|updated|start|end)/i.test(k)) return rel(x) ?? x;
    if (React.isValidElement(x)) return asHtml(x);
    if (typeof x === 'function') { notes.dropped.add('fn-in-data'); return undefined; }
    return x;
  }, undefined);
}
// Dates become "~iso" inside JSON (read back as Date by the runtime)
const reviveDates = (v: unknown): unknown => (v instanceof Date ? (rel(v.getTime()) ?? `~${v.toISOString()}`) : Array.isArray(v) ? v.map(reviveDates) : v && typeof v === 'object' && !React.isValidElement(v) && Object.getPrototypeOf(v) === Object.prototype ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, reviveDates(x)])) : v);

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
    // onSelect with a `selected` prop and onSave with a `value` prop write their result back like the *Change handlers
    const SYNC: Record<string, string> = { onSelect: 'selected', onSave: 'value', onFlip: 'flipped', onWishlist: 'wishlisted' };
    if (typeof v === 'function' && SYNC[k] && SYNC[k] in props) { emit.push(kebab(k.slice(2))); continue; }
    if (holdsFn(v)) { script[k] = v; continue; } // functions (handlers too): script.tsx keeps the ones that only use their own arguments
    const name = /^(data|aria|hx)-/.test(k) ? k : k === 'htmlFor' ? 'for' : kebab(k);
    if (v === undefined || v === null) continue;
    if (v === true) attrs[name] = TRUE;
    else if (typeof v === 'string') attrs[name] = v;
    else if (v instanceof Date) attrs[TILDE + name] = Math.abs(v.getTime() - Date.now()) < 5 * 60000 ? 'now' : v.toISOString(); // "now" is read as the current time, so the example does not go stale
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
export const finish = (html: string) => html.replaceAll(` ${COLON}`, ' :').replaceAll(` ${TILDE}`, ' ~').replaceAll(`="${TRUE}"`, '');
