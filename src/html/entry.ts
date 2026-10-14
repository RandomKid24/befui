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
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  const el = node as Element;
  const { kids, slots } = convert(el, host);
  const type = loaded.get(el.localName) ?? el.localName;
  if (type === el.localName && isTag(type)) missing.add(type);
  return React.createElement(type, { ...readProps(el, host), ...slots }, ...kids);
}

function wrapFns(v: unknown, host: Element): unknown {
  if (typeof v === 'function') return (...a: unknown[]) => { const r = v(...a); return typeof r === 'string' && HTML.test(r) ? htmlNode(r, host) : r; };
  if (Array.isArray(v)) return v.map((x) => wrapFns(x, host));
  if (v && Object.getPrototypeOf(v) === Object.prototype) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, wrapFns(x, host)]));
  return v;
}

const insideBef = (el: Element) => {
  for (let p = el.parentElement; p; p = p.parentElement) if (p.localName.startsWith('bef-')) return true;
  return false;
};

class BefElement extends HTMLElement {
  private root?: Root;
  private starting = false;
  private kids?: React.ReactNode[];
  private slots: Record<string, unknown> = {};
  private extra: Record<string, unknown> = {};
  private watcher = new MutationObserver(() => this.render());

  // Non-JSON props (functions, JSX): el.props = { columns: [...], onRowClick: fn }
  // Functions that return an HTML string (render, renderCard, bulkActions...) get that string turned into content, like :json props.
  set props(v: Record<string, unknown>) { this.extra = wrapFns(v, this) as Record<string, unknown>; if (this.root) this.render(); }

  connectedCallback() {
    if (insideBef(this)) return;
    this.setAttribute('data-bef', '');
    queueMicrotask(async () => {
      if (!this.isConnected || this.root || this.starting) return;
      this.starting = true;
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
(window as unknown as { befui: unknown }).befui = { load, toast: Object.fromEntries(['success', 'error', 'info', 'dismiss'].map((k) => [k, toastCall(k)])) };
