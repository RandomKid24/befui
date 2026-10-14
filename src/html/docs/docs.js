// Docs for the HTML build. Plain JS on purpose: this is how an app without React would use befui.
const $ = (s) => document.querySelector(s);
const ORDER = ['Inputs', 'Display', 'Feedback', 'Overlays', 'Navigation', 'Data', 'Layout', 'Time'];
let data, byCat, flat, query = '', width = 'full', view = 'react', cleanup, token = 0, previews;

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
const copy = async (text, btn) => {
  try { await navigator.clipboard.writeText(text); } catch { const t = document.createElement('textarea'); t.value = text; document.body.append(t); t.select(); document.execCommand('copy'); t.remove(); }
  const old = btn.textContent; btn.textContent = 'Copied'; setTimeout(() => (btn.textContent = old), 1200);
};

// Tiny highlighter: tags, attributes, strings, comments. Everything else is escaped as is.
const RE = /(<!--[\s\S]*?-->)|(<\/?[\w-]+)|([:~@\w.-]+)(=)("[^"]*"|'[^']*')/g;
function highlight(code) {
  let out = '', last = 0, m;
  while ((m = RE.exec(code))) {
    out += esc(code.slice(last, m.index));
    out += m[1] ? `<span class="c">${esc(m[1])}</span>` : m[2] ? `<span class="t">${esc(m[2])}</span>` : `<span class="a">${esc(m[3])}</span>=<span class="s">${esc(m[5])}</span>`;
    last = RE.lastIndex;
  }
  return out + esc(code.slice(last));
}

const CSSRE = /(\/\*[\s\S]*?\*\/)|(@[\w-]+)|(--[\w-]+)(?=:)|([\w-]+)(?=\s*:)/g;
function highlightCss(code) {
  let out = '', last = 0, m;
  while ((m = CSSRE.exec(code))) {
    out += esc(code.slice(last, m.index));
    out += m[1] ? `<span class="c">${esc(m[1])}</span>` : m[2] ? `<span class="t">${esc(m[2])}</span>` : `<span class="a">${esc(m[3] ?? m[4])}</span>`;
    last = CSSRE.lastIndex;
  }
  return out + esc(code.slice(last));
}

const match = (c) => !query || (c.name + ' ' + c.slug + ' ' + c.category + ' ' + c.description).toLowerCase().includes(query);
const link = (c) => `<a href="#/${c.slug}" data-s="${c.slug}">${esc(c.name)}</a>`;

function nav() {
  const html = ORDER.filter((cat) => byCat[cat]).map((cat) => {
    const items = byCat[cat].filter(match);
    return items.length ? `<h3>${cat} (${items.length})</h3>${items.map(link).join('')}` : '';
  }).join('');
  $('#nav').innerHTML = html || '<p class="empty">No match</p>';
  mark();
}
const mark = () => document.querySelectorAll('#nav a').forEach((a) => a.classList.toggle('on', a.dataset.s === location.hash.slice(2)));

function home() {
  const start = '<link rel="stylesheet" href="befui.css">\n<script src="befui.js" defer></script>\n\n<bef-button variant="soft">Hello</bef-button>';
  const grid = ORDER.filter((cat) => byCat[cat]).map((cat) => {
    const items = byCat[cat].filter(match);
    return items.length ? `<h2>${cat} <span style="font-weight:400">(${items.length})</span></h2><div class="tiles">${items.map((c) => `<a href="#/${c.slug}"><b>${esc(c.name)}</b><span>${esc(c.description)}</span></a>`).join('')}</div>` : '';
  }).join('');
  $('#page').innerHTML = `<div class="hero"><h1>Use befui from plain HTML</h1>
    <p class="lead">All ${data.list.length} components as custom elements. Drop in one CSS file and one script, then write <code>&lt;bef-button&gt;</code>, <code>&lt;bef-dialog&gt;</code>, <code>&lt;bef-data-table&gt;</code>. Works with htmx, Django, Rails, PHP and static pages. No React in your app.</p></div>
    <div class="code"><button class="plain copy" data-copy>Copy</button><pre>${highlight(start)}</pre></div>
    <div class="stage" style="min-height:110px;margin-top:12px"><bef-button variant="soft">Hello</bef-button></div>
    <h2>How it works</h2>
    <div class="cards">
      <div class="card"><b>Props are attributes</b><code>variant="soft"</code>, <code>default-value="x"</code>. A bare attribute is true.</div>
      <div class="card"><b>JSON with a colon</b><code>:value="40"</code>, <code>:items='[...]'</code>. Tags inside JSON strings become content.</div>
      <div class="card"><b>Slots for content</b><code>slot="action"</code> on a child passes it as that prop.</div>
      <div class="card"><b>Events</b><code>emit="value-change"</code> fires <code>bef:value-change</code>. Controlled values update themselves.</div>
      <div class="card"><b>Functions in script</b><code>el.props = { columns }</code> for render props and callbacks.</div>
      <div class="card"><b>htmx friendly</b>Swapped-in tags upgrade by themselves and <code>hx-*</code> attributes work.</div>
    </div>${grid || '<p class="empty">No match</p>'}`;
  $('#page').querySelector('[data-copy]').onclick = (e) => copy(start, e.target);
}

function component(c) {
  const demo = data.demo[c.slug];
  const i = flat.findIndex((x) => x.slug === c.slug), prev = flat[i - 1], next = flat[i + 1];
  const usesScript = /<script/.test(demo);
  $('#page').innerHTML = `<div class="crumb"><a href="#/">Components</a> / ${c.category}</div>
    <h1>${esc(c.name)}</h1><p class="lead">${esc(c.description)}</p>
    <div class="bar"><span class="seg" id="views"><button data-v="react" class="${view === 'react' ? 'on' : ''}">React demo</button><button data-v="html" class="${view === 'html' ? 'on' : ''}">HTML, live</button></span><span class="seg" id="widths">${[['full', 'Full'], ['768', 'Tablet'], ['375', 'Mobile']].map(([w, l]) => `<button data-w="${w}" class="${w === width ? 'on' : ''}">${l}</button>`).join('')}</span></div>
    <div class="frame" id="frame" style="width:${width === 'full' ? '100%' : width + 'px'}"><div class="stage${c.wide ? ' wide' : ''}" id="stage"></div></div>
    <div class="bar" style="margin-top:34px"><span class="seg" id="tabs"><button data-tab="html" class="on">HTML</button>${c.css ? '<button data-tab="css">CSS</button>' : ''}</span><span class="size" id="size"></span></div>
    <div class="code"><button class="plain copy" id="cp">Copy</button><pre id="code">${highlight(demo)}</pre></div>
    ${usesScript ? '<p class="note">This example uses a short <code>&lt;script&gt;</code> because some props are functions or objects that attributes cannot express. Everything else is plain attributes.</p>' : ''}
    <h2>Tags in this component</h2><div class="chips">${c.tags.map((t) => `<code data-t="${t}" title="Copy tag">&lt;${t}&gt;</code>`).join('') || '<span class="empty">none</span>'}</div>
    <div class="pager">${prev ? `<a href="#/${prev.slug}"><small>Previous</small>${esc(prev.name)}</a>` : '<span></span>'}${next ? `<a class="next" href="#/${next.slug}"><small>Next</small>${esc(next.name)}</a>` : ''}</div>`;
  const stage = $('#stage');
  const show = async () => {
    const my = ++token;
    cleanup?.(); cleanup = null; stage.innerHTML = '';
    stage.classList.toggle('pv', view === 'react');
    if (view === 'html') {
      stage.innerHTML = demo;
      stage.querySelectorAll('script').forEach((old) => { const s = document.createElement('script'); s.textContent = '{\n' + old.textContent + '\n}'; /* block scope: demos can reuse names */ old.replaceWith(s); });
      return;
    }
    try {
      if (!previews) {
        document.head.append(Object.assign(document.createElement('link'), { rel: 'stylesheet', href: 'previews/previews.css' }));
        previews = import('./previews/previews.js');
      }
      const unmount = await (await previews).mount(c.slug, stage);
      if (my === token) cleanup = unmount; else unmount();
    } catch (e) { stage.innerHTML = '<span class="note">Could not load the React preview. Showing the HTML one instead.</span>'; view = 'html'; }
  };
  show();
  $('#views').onclick = (e) => {
    const v = e.target.dataset?.v; if (!v || v === view) return;
    view = v; document.querySelectorAll('#views button').forEach((b) => b.classList.toggle('on', b.dataset.v === v));
    show();
  };
  let shown = demo;
  const tab = async (name) => {
    document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === name));
    if (name === 'html') { shown = demo; $('#code').innerHTML = highlight(demo); $('#size').textContent = ''; return; }
    $('#code').textContent = 'Loading...';
    const css = await fetch(`css/${c.slug}.css`).then((r) => r.text());
    if (!$('#code')) return;
    shown = css; $('#code').innerHTML = highlightCss(css); $('#size').textContent = `${(css.length / 1024).toFixed(1)} KB, only what this component uses`;
  };
  $('#tabs').onclick = (e) => e.target.dataset?.tab && tab(e.target.dataset.tab);
  $('#cp').onclick = (e) => copy(shown, e.target);
  document.querySelectorAll('.chips code[data-t]').forEach((el) => (el.onclick = () => copy(`<${el.dataset.t}></${el.dataset.t}>`, el)));
  $('#widths').onclick = (e) => {
    const w = e.target.dataset?.w; if (!w) return;
    width = w; $('#frame').style.width = w === 'full' ? '100%' : w + 'px';
    document.querySelectorAll('#widths button').forEach((b) => b.classList.toggle('on', b.dataset.w === w));
  };
}

function page() {
  const c = data.list.find((x) => x.slug === location.hash.slice(2));
  document.body.classList.remove('menu');
  cleanup?.(); cleanup = null; token++;
  mark();
  if (c) component(c); else home();
  document.title = (c ? c.name + ' · ' : '') + 'befui for HTML and htmx';
  scrollTo(0, 0);
}

$('#q').addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); nav(); if (!location.hash.slice(2)) home(); });
addEventListener('keydown', (e) => { if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); $('#q').focus(); } if (e.key === 'Escape') { $('#q').blur(); document.body.classList.remove('menu'); } });
$('#menu').onclick = () => document.body.classList.toggle('menu');
$('#theme').addEventListener('click', () => setDark(!document.documentElement.classList.contains('dark')));
addEventListener('hashchange', () => { page(); parent !== window && parent.postMessage({ befuiSlug: location.hash.slice(2) }, '*'); });

// Embedded in the befui site: ?embed hides our header bits, ?theme=dark starts dark, and the site sends theme changes.
const q = new URLSearchParams(location.search);
if (q.has('embed')) document.body.classList.add('embed');
function setDark(dark) { document.documentElement.classList.toggle('dark', dark); $('#theme').textContent = dark ? 'Light' : 'Dark'; }
if (q.get('theme') === 'dark') setDark(true);
addEventListener('message', (e) => e.data?.befuiTheme && setDark(e.data.befuiTheme === 'dark'));

fetch('demos.json').then((r) => r.json()).then((d) => {
  data = d;
  byCat = {};
  for (const c of d.list) (byCat[c.category] ??= []).push(c);
  flat = ORDER.flatMap((cat) => byCat[cat] ?? []);
  nav(); page();
});

// Dev check: __check() opens every example and lists the ones that error, stay empty or never upgrade.
window.__check = async (slugs, v = 'html') => {
  view = v;
  const bad = [], errs = [];
  const note = (e) => errs.push(e.message || String(e.reason));
  addEventListener('error', note); addEventListener('unhandledrejection', note);
  const ce = console.error; console.error = (...a) => errs.push('console: ' + String(a[0]).slice(0, 160));
  for (const s of slugs || Object.keys(data.demo)) {
    errs.length = 0; location.hash = '#/' + s;
    await new Promise((r) => setTimeout(r, v === 'html' ? 450 : 700));
    const st = $('#stage');
    const un = v === 'html' ? [...st.querySelectorAll('*')].filter((e) => e.localName.startsWith('bef-') && !e.closest('[data-bef]')).length : 0;
    const h = Math.round(st.getBoundingClientRect().height);
    if (errs.length || un || h < 70) bad.push(`${s} errs=${[...new Set(errs)].join('|')} unupgraded=${un} h=${h}`);
  }
  console.error = ce; removeEventListener('error', note);
  return bad;
};
