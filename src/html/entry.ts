import * as React from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import { manifest } from './manifest';
import './befui-html.css';

// Every exported component becomes a <bef-kebab-name> tag: DataTable -> <bef-data-table>, DialogTrigger -> <bef-dialog-trigger>.
// The outermost bef-* element turns its light DOM into a React tree (nested bef-* tags map to components, other tags stay plain HTML).
// A component's code is only downloaded when its tag first appears on the page (manifest.ts maps tag -> file).
const camel = (s: string) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

const loaders = import.meta.glob<Record<string, unknown>>('/src/components/ui/*.tsx'); // lazy: one chunk per file
const loaded = new Map<string, React.ElementType>();
const fileLoads = new Map<string, Promise<void>>();
const missing = new Set<string>(); // tags met while rendering whose code is not here yet

const isTag = (name: string) => name in manifest;
const isComponent = (c: unknown) => typeof c === 'function' || (typeof c === 'object' && c !== null && '$$typeof' in c);

function loadFile(file: string) {
  let p = fileLoads.get(file);
  if (!p) {
    p = loaders[`/src/components/ui/${file}.tsx`]!().then((mod) => {
      for (const [tag, [f, name]] of Object.entries(manifest)) if (f === file && isComponent(mod[name])) loaded.set(tag, mod[name] as React.ElementType);
    });
    fileLoads.set(file, p);
  }
  return p;
}

/** Downloads the code for these tags (and the other tags in the same files). */
function load(tags: Iterable<string>) {
  const files = new Set<string>();
  for (const t of tags) if (!loaded.has(t) && manifest[t]) files.add(manifest[t][0]);
  return Promise.all([...files].map(loadFile));
}

/** Every bef-* tag inside el, including ones written as strings in :json attributes. */
function tagsIn(el: Element) {
  const out = new Set<string>([el.localName]);
  for (const m of el.outerHTML.matchAll(/(?:<|&lt;)(bef-[\w-]+)/g)) out.add(m[1]!);
  return out;
}

const RENAME: Record<string, string> = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength', colspan: 'colSpan', rowspan: 'rowSpan' };
const BOOLEAN = new Set(['disabled', 'checked', 'required', 'readonly', 'hidden', 'multiple', 'selected', 'open', 'autofocus', 'controls', 'loop', 'muted', 'autoplay']);
const KEEP_EMPTY = new Set(['value', 'placeholder', 'alt', 'title', 'name']);

const parseStyle = (css: string) =>
  Object.fromEntries(css.split(';').map((d) => d.split(/:(.*)/s)).filter((p) => p[1]?.trim()).map(([k, v]) => [k.trim().startsWith('--') ? k.trim() : camel(k.trim()), v.trim()]));

// A string inside a :json prop that starts with a tag becomes real content, so icons and markup fit in data: {"icon": "<bef-home-icon></bef-home-icon>"}
const HTML = /^\s*<[a-z][\w-]*[\s>/][\s\S]*>\s*$/i;
function htmlNode(html: string, host: Element): React.ReactNode {
  const t = document.createElement('template');
  t.innerHTML = html;
  return React.createElement(React.Fragment, null, ...convert(t.content, host).kids);
}

function readProps(el: Element, host: Element): Record<string, unknown> {
  const isBef = isTag(el.localName);
  const props: Record<string, unknown> = {};
  for (const { name, value } of Array.from(el.attributes)) {
    if (name === 'emit' || name === 'data-bef' || name === 'slot') continue;
    if (name.startsWith('~')) props[camel(name.slice(1))] = new Date(value); // ~to="2026-12-31T09:00"
    else if (name.startsWith(':')) props[camel(name.slice(1))] = JSON.parse(value, (_, v) => (typeof v === 'string' ? (HTML.test(v) ? htmlNode(v, host) : /^~\d{4}-\d\d-\d\d/.test(v) ? new Date(v.slice(1)) : v) : v)); // :value="40", :items='[...]'
    else if (name === 'style') { if (el !== host) props.style = parseStyle(value); } // on the root tag, style stays on the tag itself
    else if (name === 'class' || name.startsWith('data-') || name.startsWith('aria-') || name.startsWith('hx-')) props[RENAME[name] ?? name] = value;
    else if (value === '' && (isBef ? !KEEP_EMPTY.has(name) : BOOLEAN.has(name))) props[camel(name)] = true;
    else props[RENAME[name] ?? (isBef ? camel(name) : name)] = value;
  }
  // emit="value-change open-change" -> onValueChange/onOpenChange fire a bubbling "bef:value-change" CustomEvent on the host
  for (const ev of (el.getAttribute('emit') ?? '').split(/\s+/).filter(Boolean)) {
    props[camel(`on-${ev}`)] = (...args: unknown[]) => {
      host.dispatchEvent(new CustomEvent(`bef:${ev}`, { bubbles: true, detail: args[0] }));
      // value-change / open-change / checked-change on the host also write the new value back (:value="..."), so controlled components just work
      const prop = ev === 'change' ? 'value' : ev.replace(/-change$/, '');
      if (el === host && (prop !== ev || ev === 'change')) {
        for (const a of [prop, `:${prop}`, `~${prop}`]) host.removeAttribute(a);
        const v = args[0];
        try {
          if (v instanceof Date) host.setAttribute(`~${prop}`, v.toISOString());
          else if (v !== undefined) host.setAttribute(`:${prop}`, JSON.stringify(v));
        } catch { /* not JSON, leave it */ }
      }
    };
  }
  return props;
}

// Children with slot="name" become the prop `name` instead of children: <bef-banner><bef-button slot="action">Undo</bef-button>Saved</bef-banner>
function convert(el: Node, host: Element) {
  const kids: React.ReactNode[] = [];
  const slots: Record<string, React.ReactNode[]> = {};
  for (const n of Array.from(el.childNodes)) {
    const slot = n.nodeType === Node.ELEMENT_NODE ? (n as Element).getAttribute('slot') : null;
    if (slot) (slots[camel(slot)] ??= []).push(toReact(n, host));
    else kids.push(toReact(n, host));
  }
  const props: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(slots)) props[k] = v.length === 1 ? v[0] : React.createElement(React.Fragment, null, ...v);
  return { kids, slots: props };
}

function toReact(node: Node, host: Element): React.ReactNode {
  if (node.nodeType === Node.TEXT_NODE) return /^\s*$/.test(node.textContent ?? '') && node.textContent!.includes('\n') ? null : node.textContent; // indentation between tags is formatting, not content
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  const el = node as Element;
  const { kids, slots } = convert(el, host);
  const type = loaded.get(el.localName) ?? el.localName;
  if (type === el.localName && isTag(type)) missing.add(type);
  // el.props = {...} also works on a nested tag: it was stored on the element before we got here
  const own = (el as unknown as { extra?: Record<string, unknown> }).extra;
  return React.createElement(type, { ...readProps(el, host), ...slots, ...own }, ...kids);
}

/** What befui.h returns: markup that is already escaped. */
class Html { constructor(readonly html: string) {} toString() { return this.html; } }
const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const kebab = (n: string) => n.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
const Fragment = Symbol('Fragment');
function hAttrs(props: Record<string, unknown> | null) {
  let out = '';
  for (const [k, v] of Object.entries(props ?? {})) {
    if (k === 'children' || k === 'key' || k === 'ref' || v === undefined || v === null) continue;
    if (typeof v === 'function') { if (/^on[A-Z]\w*Change$|^onChange$/.test(k)) out += ` emit="${kebab(k.slice(2))}"`; continue; }
    const name = k === 'className' ? 'class' : k === 'htmlFor' ? 'for' : /^(data|aria|hx)-/.test(k) ? k : kebab(k);
    if (k === 'style' && typeof v === 'object') out += ` style="${esc(Object.entries(v as object).map(([p, x]) => `${kebab(p)}:${x}`).join(';'))}"`;
    else if (v === true) out += ` ${name}`;
    else if (typeof v === 'string' && !HTML.test(v)) out += ` ${name}="${esc(v)}"`;
    else if (v instanceof Date) out += ` ~${name}="${v.toISOString()}"`;
    else out += ` :${name}='${JSON.stringify(v instanceof Html ? v.html : v, (_, x) => (x instanceof Html ? x.html : x)).replace(/'/g, '&#39;')}'`;
  }
  return out;
}
const hKids = (kids: unknown[]): string => kids.flat(Infinity).map((c) => (c === null || c === undefined || c === false || c === true ? '' : c instanceof Html ? c.html : esc(String(c)))).join('');
/** JSX-style builder that returns markup: h('bef-badge', { variant: 'success' }, 'Active'). Used by render functions in el.props. */
const h = (type: string | symbol, props: Record<string, unknown> | null, ...kids: unknown[]) => {
  const inner = hKids(props && 'children' in props && !kids.length ? [props.children] : kids);
  return new Html(type === Fragment ? inner : `<${String(type)}${hAttrs(props)}>${inner}</${String(type)}>`);
};
/** T.Badge -> 'bef-badge', so converted React code can keep writing <Badge>: h(T.Badge, ...) */
const T = new Proxy({}, { get: (_, name: string) => `bef-${kebab(name)}` });

function wrapFns(v: unknown, host: Element): unknown {
  if (typeof v === 'function') return (...a: unknown[]) => {
    const r = v(...a);
    const html = r instanceof Html ? r.html : typeof r === 'string' && HTML.test(r) ? r : null;
    return html ? htmlNode(html, host) : r;
  };
  if (v instanceof Html) return htmlNode(v.html, host);
  if (typeof v === 'string' && HTML.test(v)) return htmlNode(v, host);
  if (Array.isArray(v)) return v.map((x) => wrapFns(x, host));
  if (v && Object.getPrototypeOf(v) === Object.prototype) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, wrapFns(x, host)]));
  return v;
}

const ready = () => new Promise<void>((r) => (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', () => r(), { once: true }) : setTimeout(r)));

const insideBef = (el: Element) => {
  for (let p = el.parentElement; p; p = p.parentElement) if (p.localName.startsWith('bef-')) return true;
  return false;
};

class BefElement extends HTMLElement {
  private root?: Root;
  private starting = false;
  private kids?: React.ReactNode[];
  private slots: Record<string, unknown> = {};
  extra: Record<string, unknown> = {};
  private watcher = new MutationObserver(() => this.render());

  // Non-JSON props (functions, JSX): el.props = { columns: [...], onRowClick: fn }
  // Functions that return an HTML string (render, renderCard, bulkActions...) get that string turned into content, like :json props.
  set props(v: Record<string, unknown>) { this.extra = wrapFns(v, this) as Record<string, unknown>; if (this.root) this.render(); }

  connectedCallback() {
    // el.props = {...} run before this element was upgraded (inline script above the module) is a plain property on the instance: move it to the setter
    if (Object.prototype.hasOwnProperty.call(this, 'props')) { const early = (this as unknown as { props: Record<string, unknown> }).props; delete (this as unknown as { props?: unknown }).props; this.props = early; }
    if (insideBef(this)) return;
    this.setAttribute('data-bef', '');
    queueMicrotask(async () => {
      if (!this.isConnected || this.root || this.starting) return;
      this.starting = true;
      await ready(); // inline scripts that set el.props run before we read the tags
      await load(tagsIn(this));
      this.starting = false;
      if (!this.isConnected || this.root) return;
      ({ kids: this.kids, slots: this.slots } = convert(this, this));
      this.replaceChildren();
      this.root = createRoot(this);
      this.watcher.observe(this, { attributes: true });
      this.render();
    });
  }

  disconnectedCallback() {
    this.watcher.disconnect();
    const root = this.root;
    this.root = undefined;
    if (root) queueMicrotask(() => root.unmount());
  }

  private render() {
    if (!this.root || !this.kids) return;
    const type = loaded.get(this.localName);
    if (!type) return;
    flushSync(() => this.root!.render(React.createElement(type, { ...readProps(this, this), ...this.slots, ...this.extra }, ...this.kids!)));
    (window as { htmx?: { process(el: Element): void } }).htmx?.process(this); // wire hx-* attributes React just rendered
    if (missing.size) { // a render function returned tags we have not downloaded yet: fetch them, then draw again
      const tags = [...missing];
      missing.clear();
      load(tags).then(() => this.root && this.render());
    }
  }
}

for (const tag of Object.keys(manifest)) {
  if (!customElements.get(tag)) customElements.define(tag, class extends BefElement {});
}

// befui.toast.success('Saved') etc. load the toast code on first use (put a <bef-toaster> on the page to show them)
const toastCall = (k: string) => (...a: unknown[]) => import('@/components/ui/toast').then((m) => (m.toast as unknown as Record<string, (...x: unknown[]) => unknown>)[k]!(...a));
(window as unknown as { befui: unknown }).befui = { load, h, T, Fragment, toast: Object.fromEntries(['success', 'error', 'info', 'dismiss'].map((k) => [k, toastCall(k)])) };
