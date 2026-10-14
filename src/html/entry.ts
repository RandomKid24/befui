import * as React from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import * as ui from '@/components/ui';
import './befui-html.css';

// Every exported component becomes a <bef-kebab-name> tag: DataTable -> <bef-data-table>, DialogTrigger -> <bef-dialog-trigger>.
// The outermost bef-* element turns its light DOM into a React tree (nested bef-* tags map to components, other tags stay plain HTML).
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
const camel = (s: string) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

const registry = new Map<string, React.ElementType>();
for (const [name, c] of Object.entries(ui)) {
  const isComponent = typeof c === 'function' || (typeof c === 'object' && c !== null && '$$typeof' in c);
  if (/^[A-Z]/.test(name) && isComponent) registry.set(`bef-${kebab(name)}`, c as React.ElementType);
}

const RENAME: Record<string, string> = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength', colspan: 'colSpan', rowspan: 'rowSpan' };
const BOOLEAN = new Set(['disabled', 'checked', 'required', 'readonly', 'hidden', 'multiple', 'selected', 'open', 'autofocus', 'controls', 'loop', 'muted', 'autoplay']);
const KEEP_EMPTY = new Set(['value', 'placeholder', 'alt', 'title', 'name']);

const parseStyle = (css: string) =>
  Object.fromEntries(css.split(';').map((d) => d.split(/:(.*)/s)).filter((p) => p[1]?.trim()).map(([k, v]) => [k.trim().startsWith('--') ? k.trim() : camel(k.trim()), v.trim()]));

function readProps(el: Element, host: Element): Record<string, unknown> {
  const isBef = registry.has(el.localName);
  const props: Record<string, unknown> = {};
  for (const { name, value } of Array.from(el.attributes)) {
    if (name === 'emit') continue;
    if (name.startsWith(':')) props[camel(name.slice(1))] = JSON.parse(value); // :value="40", :items='[...]'
    else if (name === 'style') props.style = parseStyle(value);
    else if (name === 'class' || name.startsWith('data-') || name.startsWith('aria-') || name.startsWith('hx-')) props[RENAME[name] ?? name] = value;
    else if (value === '' && (isBef ? !KEEP_EMPTY.has(name) : BOOLEAN.has(name))) props[camel(name)] = true;
    else props[RENAME[name] ?? (isBef ? camel(name) : name)] = value;
  }
  // emit="value-change open-change" -> onValueChange/onOpenChange fire a bubbling "bef:value-change" CustomEvent on the host
  for (const ev of (el.getAttribute('emit') ?? '').split(/\s+/).filter(Boolean)) {
    props[camel(`on-${ev}`)] = (...args: unknown[]) => host.dispatchEvent(new CustomEvent(`bef:${ev}`, { bubbles: true, detail: args[0] }));
  }
  return props;
}

function toReact(node: Node, host: Element): React.ReactNode {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  const el = node as Element;
  const kids = Array.from(el.childNodes).map((n) => toReact(n, host));
  return React.createElement(registry.get(el.localName) ?? el.localName, readProps(el, host), ...kids);
}

const insideBef = (el: Element) => {
  for (let p = el.parentElement; p; p = p.parentElement) if (p.localName.startsWith('bef-')) return true;
  return false;
};

class BefElement extends HTMLElement {
  private root?: Root;
  private kids?: React.ReactNode[];
  private extra: Record<string, unknown> = {};
  private watcher = new MutationObserver(() => this.render());

  // Non-JSON props (functions, JSX): el.props = { columns: [...], onRowClick: fn }
  set props(v: Record<string, unknown>) { this.extra = v; if (this.root) this.render(); }

  connectedCallback() {
    if (insideBef(this)) return;
    queueMicrotask(() => {
      if (!this.isConnected || this.root) return;
      this.kids = Array.from(this.childNodes).map((n) => toReact(n, this));
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
    flushSync(() => this.root!.render(React.createElement(type, { ...readProps(this, this), ...this.extra }, ...this.kids!)));
    (window as { htmx?: { process(el: Element): void } }).htmx?.process(this); // wire hx-* attributes React just rendered
  }
}

for (const tag of registry.keys()) {
  if (!customElements.get(tag)) customElements.define(tag, class extends BefElement {});
}

(window as unknown as { befui: unknown }).befui = { components: Object.fromEntries(registry) };
