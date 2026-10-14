// Docs for the HTML build. Plain JS on purpose: this is how an app without React would use befui.
const $ = (s) => document.querySelector(s);
let data;

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);

function nav(filter = '') {
  const f = filter.trim().toLowerCase();
  const by = {};
  for (const c of data.list) if (!f || (c.name + ' ' + c.slug + ' ' + c.category).toLowerCase().includes(f)) (by[c.category] ??= []).push(c);
  $('#nav').innerHTML = Object.entries(by).map(([cat, items]) =>
    `<h3>${cat} (${items.length})</h3>` + items.map((c) => `<a href="#/${c.slug}" data-s="${c.slug}">${esc(c.name)}</a>`).join('')).join('') || '<p class="note">No match</p>';
  mark();
}
const mark = () => document.querySelectorAll('#nav a').forEach((a) => a.classList.toggle('on', a.dataset.s === location.hash.slice(2)));

function page() {
  const slug = location.hash.slice(2);
  const c = data.list.find((x) => x.slug === slug);
  mark();
  if (!c) {
    $('#page').innerHTML = `<h1>All ${data.list.length} components</h1><p class="d">Every component from the React library as a custom element. Pick one on the left. Add <code>befui.css</code> and <code>befui.js</code> to your page and use the tags shown in each example.</p>`;
    return;
  }
  const demo = data.demo[slug];
  $('#page').innerHTML = `<h1>${esc(c.name)}</h1><p class="d">${esc(c.description)}</p>
    <div class="stage${c.wide ? ' wide' : ''}" id="stage"></div>
    <h2>HTML</h2>${demo ? `<pre><code>${esc(demo)}</code></pre>` : '<p class="note">No HTML example written for this one yet. The tags below work, see the README for how props map to attributes.</p>'}
    <h2>Tags in this component</h2><div class="tags">${c.tags.map((t) => `<code>&lt;${t}&gt;</code>`).join('') || '<span class="note">none</span>'}</div>`;
  const stage = $('#stage');
  if (demo) {
    stage.innerHTML = demo;
    stage.querySelectorAll('script').forEach((old) => { const s = document.createElement('script'); s.textContent = '{\n' + old.textContent + '\n}'; /* block scope: demos can reuse names */ old.replaceWith(s); });
  } else stage.innerHTML = '<span class="note">Preview needs an example.</span>';
  scrollTo(0, 0);
}

$('#q').addEventListener('input', (e) => nav(e.target.value));
$('#theme').addEventListener('click', () => {
  const dark = document.documentElement.classList.toggle('dark');
  $('#theme').textContent = dark ? 'Light' : 'Dark';
});
addEventListener('hashchange', () => { page(); parent !== window && parent.postMessage({ befuiSlug: location.hash.slice(2) }, '*'); });

// Embedded in the befui site: ?embed hides our header, ?theme=dark starts dark, and the site sends theme changes.
const q = new URLSearchParams(location.search);
if (q.has('embed')) document.body.classList.add('embed');
const setDark = (dark) => { document.documentElement.classList.toggle('dark', dark); $('#theme').textContent = dark ? 'Light' : 'Dark'; };
if (q.get('theme') === 'dark') setDark(true);
addEventListener('message', (e) => e.data?.befuiTheme && setDark(e.data.befuiTheme === 'dark'));

fetch('demos.json').then((r) => r.json()).then((d) => { data = d; nav(); page(); });

// Dev check: __check() opens every example and lists the ones that error, stay empty or never upgrade.
window.__check = async (slugs) => {
  const bad = [], errs = [];
  const note = (e) => errs.push(e.message || String(e.reason));
  addEventListener('error', note); addEventListener('unhandledrejection', note);
  const ce = console.error; console.error = (...a) => errs.push('console: ' + String(a[0]).slice(0, 160));
  for (const s of slugs || Object.keys(data.demo)) {
    errs.length = 0; location.hash = '#/' + s;
    await new Promise((r) => setTimeout(r, 450));
    const st = $('#stage');
    const un = [...st.querySelectorAll('*')].filter((e) => e.localName.startsWith('bef-') && !e.closest('[data-bef]')).length;
    const h = Math.round(st.getBoundingClientRect().height);
    if (errs.length || un || h < 70) bad.push(`${s} errs=${[...new Set(errs)].join('|')} unupgraded=${un} h=${h}`);
  }
  console.error = ce; removeEventListener('error', note);
  return bad;
};
