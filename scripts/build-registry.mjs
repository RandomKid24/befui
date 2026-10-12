// Builds public/r/*.json: one self-contained file per component and block, plus index.json.
// The CLI (bin/befui.mjs) reads these. Dependencies come from each file's real imports.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';

const out = 'public/r';
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const reg = readFileSync('src/registry/index.ts', 'utf8');
const info = {};
for (const [, slug, name, cat, desc] of reg.matchAll(/^\s*m\('([^']+)', '([^']+)', '([^']+)', '((?:[^'\\]|\\.)*)'/gm)) info[`ui/${slug}`] = { name, group: cat, description: desc.replace(/\\'/g, "'") };
for (const [, slug, name, module, desc] of reg.matchAll(/slug: '([^']+)', name: '([^']+)', module: '([^']+)', description: '((?:[^'\\]|\\.)*)'/g)) info[`blocks/${slug}`] = { name, group: module, description: desc.replace(/\\'/g, "'") };

// Changelog: src/registry/changelog.json is the source for the docs page and CHANGELOG.md. Every slug must exist.
const releases = JSON.parse(readFileSync('src/registry/changelog.json', 'utf8'));
const nameOf = (slug) => (slug.startsWith('block:') ? info[`blocks/${slug.slice(6)}`] : info[`ui/${slug}`])?.name;
for (const r of releases) for (const e of r.entries) for (const slug of e.slugs ?? []) if (!nameOf(slug)) throw new Error(`changelog ${r.version}: unknown component "${slug}"`);
writeFileSync('CHANGELOG.md', `# Changelog

All notable changes to befui. Versions follow [semver](https://semver.org): new components are minor releases, breaking prop changes are major. The same list, with links to each component, is on the docs site under Changelog.
(Generated from src/registry/changelog.json by \`npm run registry:build\`. Edit the JSON, not this file.)

${releases.map((r) => `## ${r.version} - ${r.date}\n\n${r.title}\n\n${r.entries.map((e) => `- **${e.kind[0].toUpperCase()}${e.kind.slice(1)}:** ${e.text}${e.slugs?.length ? ` (${e.slugs.map(nameOf).join(', ')})` : ''}`).join('\n')}\n`).join('\n')}`);

const HELPERS = new Set(['react', 'react-dom', 'clsx', 'tailwind-merge', 'class-variance-authority']);

function analyse(src) {
  const deps = new Set();
  const requires = new Set();
  for (const [, spec] of src.matchAll(/from '([^']+)'/g)) {
    const ui = spec.match(/^(?:@\/components\/ui|\.)\/([\w-]+)$/);
    if (ui) requires.add(ui[1]);
    else if (!spec.startsWith('.') && !spec.startsWith('@/') && !HELPERS.has(spec)) deps.add(spec);
  }
  return { deps: [...deps].sort(), requires: [...requires].sort() };
}

const items = [];
const docs = [];
for (const [kind, dir, prefix] of [['ui', 'src/components/ui', ''], ['blocks', 'src/blocks', 'block:']]) {
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.tsx')) continue;
    const slug = f.replace('.tsx', '');
    const content = readFileSync(`${dir}/${f}`, 'utf8');
    const meta = info[`${kind}/${slug}`] ?? { name: slug, group: kind, description: '' };
    const a = analyse(content);
    const entry = {
      name: `${prefix}${slug}`,
      title: meta.name,
      group: meta.group,
      description: meta.description,
      deps: a.deps,
      requires: a.requires,
      files: [{ path: `${kind === 'ui' ? 'components/ui' : 'blocks'}/${f}`, content }],
    };
    const exportsList = [...content.matchAll(/^export (?:async )?(?:function|const|class) (\w+)/gm)].map((m) => m[1]);
    let example = '';
    try { example = readFileSync(`src/examples/${slug}.tsx`, 'utf8'); } catch { /* blocks have no separate example */ }
    if (slug === 'icons') example = `import { SearchIcon, ArrowRightIcon } from '@/components/ui/icons';\n\n<SearchIcon />                 // 16px, follows text color, static\n<SearchIcon className="size-6" />\n<ArrowRightIcon draw />        // opt-in: redraws on hover\n<SearchIcon weight={2.5} />     // heavier stroke\n\n// All ${exportsList.filter((e) => /^[A-Z]/.test(e) && e !== 'icons').length} icons: ${exportsList.filter((e) => /^[A-Z]/.test(e)).join(', ')}`;
    writeFileSync(`${out}/${prefix.replace(':', '-')}${slug}.json`, JSON.stringify({ ...entry, exports: exportsList, example: example.trim() }));
    docs.push({ ...entry, kind, exports: exportsList, example });
    items.push({ name: entry.name, title: entry.title, group: entry.group, description: entry.description });
  }
}

writeFileSync(`${out}/index.json`, JSON.stringify(items));
writeFileSync(`${out}/init.json`, JSON.stringify({
  name: 'init',
  deps: ['clsx', 'tailwind-merge', 'class-variance-authority', 'tailwindcss', '@tailwindcss/vite'],
  files: [
    { path: 'lib/utils.ts', content: readFileSync('src/lib/utils.ts', 'utf8') },
    { path: 'index.css', content: readFileSync('src/index.css', 'utf8') },
  ],
}));

// Agent-facing docs: a short index and a full catalog with a working example per component.
const RAW = 'https://raw.githubusercontent.com/RandomKid24/befui/main/public';
const ui = docs.filter((d) => d.kind === 'ui');
const bl = docs.filter((d) => d.kind === 'blocks');
const head = `# befui

> Copy-paste React components (Radix + Tailwind 4 + CSS variables) with real motion, plus HRMS and marketing blocks. You own the files: add them with the CLI, then import from \`@/components/ui/<name>\`.

## Setup
- One time: \`npx github:RandomKid24/befui init\` (theme CSS, cn helper, AGENTS.md rules, .mcp.json)
- Add: \`npx github:RandomKid24/befui add <name> [name...]\` or \`add all\`; blocks are \`block:<name>\`. It also installs npm packages and any befui files a component imports.
- Exact source of any component as JSON (files, npm deps, requires, example): ${RAW}/r/<name>.json (blocks: block-<name>.json). Every name below works in that URL.
- MCP: \`npx github:RandomKid24/befui mcp\` gives tools list_components, get_component, add_components
- Icons: our own set in \`@/components/ui/icons\`, e.g. \`import { SearchIcon } from '@/components/ui/icons'\`; no icon package needed
- Theme: CSS variables in index.css (--primary, --ring, --accent...). Dark mode = \`dark\` class on <html>. Use tokens (\`bg-primary\`, \`text-muted-foreground\`, \`border\`), never hard-coded colors.
- Full catalog with a working example per component: ${RAW}/llms-full.txt

## Rules that save a debugging round
- Wrap the app once in \`<TooltipProvider>\` (tooltip) and render \`<Toaster />\` once, then call \`toast.success('Saved')\` anywhere (toast).
- Sidebar, AppShell: put \`SidebarProvider\` above them. Dialog and Sheet are the same primitive; use \`SheetContent\` for a side drawer.
- Stateful inputs are controlled: pass \`value\` and \`onChange\` (or \`checked\` / \`onCheckedChange\` for checkbox and switch).
- Tables: \`table\` is bare parts for static layouts. \`data-table\` adds sort, filter, pagination, row selection (\`selectable\`, \`bulkActions\`), a column menu (\`columnMenu\`) and a sticky header (\`maxHeight\`); you pass rows and \`Column[]\`.
- Animated components need keyframes from index.css: run \`npx github:RandomKid24/befui update\` after adding (\`--check\` to only report).
- Fixed colors on purpose: terminal (always dark), avatar and tag-manager (per-name tints). Everything else follows theme tokens.
- Merge classes with \`cn\` from \`@/lib/utils\`. Edit copied files freely; \`add <name> --force\` overwrites local edits.

## Which component for what
${[
  ['Draw a chart', 'trend over time: line-chart or area-chart (stacked); compare categories: charts BarChart or stacked-bar-chart; share of whole: DonutChart or radial-bar-chart; correlation or outliers: scatter-chart; day-by-hour or cohort grid: matrix-heatmap; yearly activity: heatmap; tiny trend in a card: Sparkline; live feed: live-chart; stages: funnel-chart; scores on axes: radar-chart; parts of a budget: treemap; start-to-end bridge (profit): waterfall-chart; flow between stages: sankey-chart; mix shifting over time: stream-chart; price range per period: candlestick-chart. All animate in on scroll.'],
  ['Show tabular data', 'table (static), data-table (sort/filter/select/paginate), permission-matrix (roles by permissions), kanban (cards in columns), heatmap, charts, line-chart, radar-chart, funnel-chart, gantt (schedule), org-chart, saved-views (table presets), audit-log (who changed what), file-manager'],
  ['Hint or explain on hover', 'tooltip (title, shortcut, arrow), InfoTip and TruncatedText (both exported by tooltip), popover for richer content'],
  ['Pick a value', 'select, combobox, radio-group, segmented, chip, switch, checkbox, slider, calendar, date-picker, time-picker, color-picker'],
  ['Type text or numbers', 'input, search-input, search-bar, password-input, otp-input, currency-input, number-stepper, tag-input, inline-edit, datetime-picker, image-upload, rich-text-editor (HTML), schema-form (form from a JSON-like description, wizard with steps), notification-preferences, mention-input (@ people), coupon-input'],
  ['Confirm, ask, or show a form on top', 'dialog, alert-dialog (destructive), dialog\'s Sheet (side drawer), popover, context-menu (right click), image-viewer (lightbox), bottom-sheet (mobile)'],
  ['Loading and failure states', 'loader (ring/dots/bars/pulse/orbit/dual, BarLoader, LoadingOverlay), skeleton, spinner, empty-state, error-state (404/500), pull-to-refresh'],
  ['Workflows and settings', 'approval-flow (approver chain), onboarding-checklist, tag-manager, notification-preferences, shortcuts-dialog (press ?), permission-matrix'],
  ['Format numbers', 'format (formatCurrency, formatCompact, formatPercent, formatBytes, formatDuration, Currency); defaults to INR and en-IN'],
  ['Online shop and checkout', 'product-card (and Price), order-summary, coupon-input, number-stepper (quantity), rating'],
  ['Reorder or resize', 'sortable-list (rows), kanban (cards across columns), split-pane (resizable panels)'],
  ['Tell the user something', 'toast (transient), alert (inline), banner (page-wide), notification-center (inbox), cookie-consent'],
  ['Navigate', 'sidebar, app-shell, navbar (top bar), user-menu (avatar menu), theme-toggle (dark mode), settings-layout (side nav for settings), bottom-nav (mobile), swipe-actions (row gestures), tabs, breadcrumb, pagination, stepper, command (Ctrl K), table-of-contents, fab'],
  ['Show KPIs and status', 'stat-card, bar-list (ranked bars), description-list (details), invoice, gauge, progress, progress-ring, number-ticker, badge, status-dot, charts (Sparkline, BarChart, DonutChart)'],
  ['Show people and activity', 'avatar, profile-card, activity-feed, timeline, chat, comment-thread, changelog, testimonial-card, rating, terminal (CLI output)'],
  ['Time', 'time-picker, analog-clock, world-clock, stopwatch, timer, countdown, relative-time'],
  ['Whole pages', 'see Page recipes below; all blocks are listed under Blocks'],
].map(([task, use]) => `- ${task}: ${use}`).join('\n')}

## Page recipes (start from a block, then edit it)
Add the block with \`add block:<name>\`; it pulls in everything it uses. Layout frames: wrap pages in \`app-shell\` (sidebar), or use \`block:top-nav-layout\` (navbar, no sidebar).
${[
  ['Admin app frame (sidebar + topbar)', 'block:admin-shell. Topbar extras: theme-toggle, user-menu, notification-center, command (Ctrl K)'],
  ['Analytics / traffic dashboard', 'block:analytics-dashboard (stat-card, line-chart, donut, bar-list)'],
  ['Sales or CRM dashboard', 'block:sales-dashboard, block:lead-pipeline, block:campaign-performance'],
  ['Online store admin', 'block:ecommerce-dashboard, block:checkout-page, block:invoice-page'],
  ['Project or team dashboard', 'block:project-overview, kanban, gantt, org-chart'],
  ['HR / people', 'block:hrms-overview, block:employee-directory, block:leave-approvals, block:leave-request-form'],
  ['Users, roles, API keys', 'block:user-management (invite dialog + table), permission-matrix, block:api-keys-page'],
  ['Account area', 'block:settings-page (tabs) or settings-layout (side nav), block:profile-page, block:billing-page'],
  ['Sign in / sign up / reset', 'block:sign-in, block:sign-up, block:reset-password'],
  ['Marketing site', 'block:landing-page (landing-sections: Hero, FeatureGrid, StatsStrip, Faq, CtaBanner, SiteFooter + navbar), block:pricing-page, comparison-table'],
  ['Mail or messages', 'block:inbox, chat, comment-thread'],
  ['Error pages', 'block:not-found-page or error-state (code 403, 404, 500)'],
  ['Details panel for one record', 'description-list inside a card, plus timeline or audit-log for history'],
].map(([task, use]) => `- ${task}: ${use}`).join('\n')}
`;
const iconNames = [...readFileSync('src/components/ui/icons.tsx', 'utf8').matchAll(/^export const (\w+Icon) = make/gm)].map((m) => m[1]);
const iconSection = `## Icons (${iconNames.length})\nImport from \`@/components/ui/icons\`. Use only these names; do not guess or add an icon package. Props: className (size-4 default, e.g. size-5), weight, draw.\n${iconNames.join(', ')}\n`;
const ORDER = ['Layout', 'Navigation', 'Inputs', 'Display', 'Data', 'Feedback', 'Overlays', 'Time'];
const rank = (g) => (ORDER.includes(g) ? ORDER.indexOf(g) : ORDER.length);
const byGroup = [...ui].sort((x, y) => rank(x.group) - rank(y.group) || x.name.localeCompare(y.name));
const importOf = (d) => d.exports.filter((e) => !/Variants$/.test(e));
const line = (d) => `- \`${d.name}\`: ${d.description} Exports: ${importOf(d).slice(0, 8).join(', ')}${importOf(d).length > 8 ? ', ...' : ''}.${d.requires.length ? ` Needs: ${d.requires.join(', ')}.` : ''}`;
const sections = ORDER.concat([...new Set(ui.map((d) => d.group))].filter((g) => !ORDER.includes(g)))
  .map((g) => ({ g, list: byGroup.filter((d) => d.group === g) }))
  .filter((x) => x.list.length)
  .map((x) => `### ${x.g} (${x.list.length})\n${x.list.map(line).join('\n')}`)
  .join('\n\n');
writeFileSync('public/llms.txt', `${head}\n${iconSection}\n## Components (${ui.length})\n\n${sections}\n\n## Blocks\n${bl.map((d) => `- \`${d.name}\`: ${d.description} Uses: ${d.requires.join(', ')}.`).join('\n')}\n`);
const full = byGroup.map((d) => `## ${d.title} (\`${d.name}\`)\n${d.description}\n- Group: ${d.group}\n- Add: \`npx github:RandomKid24/befui add ${d.name}\`\n- Import: \`import { ${importOf(d).join(', ')} } from '@/components/ui/${d.name}'\`\n${d.requires.length ? `- Also needs: ${d.requires.join(', ')}\n` : ''}${d.deps.length ? `- npm packages: ${d.deps.join(', ')}\n` : ''}\nExample:\n\n\`\`\`tsx\n${d.example.trim()}\n\`\`\`\n`).join('\n');
writeFileSync('public/llms-full.txt', `${head}\n${iconSection}\n# Components\n\n${full}`);
writeFileSync(`${out}/agents.md`, readFileSync('scripts/agents-snippet.md', 'utf8'));
console.log(`registry: ${items.length} items, llms.txt for ${ui.length} components`);
