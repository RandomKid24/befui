import * as React from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import { toast } from '@/components/ui/toast';
import './befui-html.css';

// Every exported component becomes a <bef-kebab-name> tag: DataTable -> <bef-data-table>, DialogTrigger -> <bef-dialog-trigger>.
// The outermost bef-* element turns its light DOM into a React tree (nested bef-* tags map to components, other tags stay plain HTML).
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
const camel = (s: string) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

// Every file in components/ui, not the barrel: index.ts does not re-export all of them.
const files = import.meta.glob<Record<string, unknown>>('/src/components/ui/*.tsx', { eager: true });
const registry = new Map<string, React.ElementType>();
for (const [file, mod] of Object.entries(files)) {
  for (const [name, c] of Object.entries(mod)) {
    const isComponent = typeof c === 'function' || (typeof c === 'object' && c !== null && '$$typeof' in c);
    const tag = `bef-${kebab(name)}`;
    if (/^[A-Z]/.test(name) && isComponent && !registry.has(tag)) registry.set(tag, c as React.ElementType);
    else if (registry.has(tag) && registry.get(tag) !== c && import.meta.env.DEV) console.warn(`befui: ${tag} also exported by ${file}`);
  }
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
  const isBef = registry.has(el.localName);
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
  return React.createElement(registry.get(el.localName) ?? el.localName, { ...readProps(el, host), ...slots }, ...kids);
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
    queueMicrotask(() => {
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
    const type = registry.get(this.localName)!;
    flushSync(() => this.root!.render(React.createElement(type, { ...readProps(this, this), ...this.slots, ...this.extra }, ...this.kids!)));
    (window as { htmx?: { process(el: Element): void } }).htmx?.process(this); // wire hx-* attributes React just rendered
  }
}

for (const tag of registry.keys()) {
  if (!customElements.get(tag)) customElements.define(tag, class extends BefElement {});
}

(window as unknown as { befui: unknown }).befui = { components: Object.fromEntries(registry), toast }; // befui.toast(...) shows a toast (needs a <bef-toaster> on the page)
