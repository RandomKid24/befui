## UI components (befui)

This project uses [befui](https://github.com/RandomKid24/befui): copy-paste React components built on Radix, Tailwind 4 and CSS variables. Components live in `src/components/ui`, one file each, and are imported as `@/components/ui/<name>`.

Rules:
- Before building any UI, check whether a befui component already exists. Full catalog with usage examples: https://raw.githubusercontent.com/RandomKid24/befui/main/public/llms-full.txt (short index: `llms.txt` in the same folder).
- If a `befui` MCP server is connected (registered in `.mcp.json` by `init`), use its `list_components`, `get_component` (exact source, import and example; `format: "html"` gives `<bef-*>` tags and an HTML example), `get_html_rules`, `get_design_rules` and `add_components` tools instead of guessing.
- Add a missing component with the CLI, never by retyping its code: `npx github:RandomKid24/befui add <name>` (several names allowed, `all` for everything). It also installs the npm packages and any befui components it depends on. There is no `befui` package on npm, so `npx befui` fails: use the `github:` form.
- If the CLI or GitHub is blocked, fetch `https://raw.githubusercontent.com/RandomKid24/befui/main/public/r/<name>.json` (or the same `/r/<name>.json` path on the docs site) and write each `files[].content` to `src/<path>`. Do the same for every name in `requires` (almost always `icons`) and `npm i` its `deps`. Never replace a befui icon with lucide or another icon package: components import from `./icons`, so copy that file too.
- Icons come from `@/components/ui/icons` (e.g. `import { SearchIcon } from '@/components/ui/icons'`). Do not add another icon package.
- Style with the theme tokens (`bg-primary`, `text-muted-foreground`, `border`, ...). Do not hard-code colors, and do not add gradients.
- Components that animate (loader, bottom-sheet, toast, ...) need keyframes in index.css. If one looks static or broken, run `npx github:RandomKid24/befui update`.
- Colors: use theme tokens. Only `terminal`, `avatar` and `tag-manager` use fixed colors on purpose (dark terminal, per-name tints).
- Merge classes with `cn` from `@/lib/utils`.
- Edit copied component files freely; they belong to this project. To pull the latest version of one, re-run `add <name> --force` (this overwrites local edits).
- No React in the page (plain HTML, htmx, server templates)? Use the `<bef-*>` custom elements from the HTML build instead: tag rules and an example per component are in https://raw.githubusercontent.com/RandomKid24/befui/main/public/llms-html.txt.

### Making the screen look designed (read before composing a page)

Components alone do not make a good screen. A page of headings, rules and grey sentences on one flat background is the usual failure, and it reads as unfinished even when every part works. Before writing a page:

- Start from a block when one is close (`block:analytics-dashboard`, `block:admin-shell`, the Page recipes list). Editing a composed screen beats assembling one from primitives.
- Pick one thing the screen is for and make it the largest, most contrasting element. Everything else is smaller and quieter. Four equal numbers in a row plus five equal sections is a list, not a hierarchy.
- Use the surfaces. `bg-background` is the page, `bg-card` with `border` lifts the working area, `bg-muted` sits behind secondary or inactive areas. A screen that uses only `bg-background` looks blank.
- Use colour for meaning, not only on the main button: `text-success` and `bg-success/10` for paid, done, up; `text-warning` for due or low; `text-destructive` for overdue or failed; `bg-primary-soft text-primary` for the selected or current thing. Put state in a `badge` or `status-dot`, never in a bare sentence.
- Numbers get context. Use `stat-card` or `kpi-strip` with a change against last period, a `Sparkline`, or a `progress` or `progress-ring` toward a target. Format with `format` (formatCurrency, formatCompact). A lone figure with a label says nothing.
- Show at least one real chart or visual reading of the data on an overview screen (`area-chart`, `bar-list`, `heatmap`, `gauge`), and give people a face with `avatar` wherever a row is about a person.
- Design the empty account first, because that is what the user sees on day one. Never render a dashboard of zeros with "No one arrives today." under each heading. When there is no data: collapse the empty sections into one `empty-state` with an icon, one sentence on what will appear here, and the primary action (for example New booking); hide totals that would all read 0; keep any part that is still true and useful (for example the list of free rooms).
- Within a populated screen, an empty section still uses `empty-state` (compact) with its action, not a grey line of text.
- Rows are objects. A booking, guest, order or task row has a leading `avatar` or icon, a strong title, a muted second line, a trailing `badge` and an action. Use `data-table`, `activity-feed`, `description-list` or `timeline` before hand-writing `div` rows.
- Vary density on purpose: tight inside tables and lists, generous around the page title and between regions. The same gap everywhere flattens the page.
- Every icon-only button gets a `tooltip`. Navigation shows where you are with `bg-secondary` or `bg-primary-soft`, not weight alone.
- Give loading a `skeleton` shaped like the content and errors an `error-state` with a retry.
- Seed realistic demo data when the backend is empty in development, and say it is demo data. A design cannot be judged, by you or the user, on a screen with nothing in it.
- Before you call it done, look at the result: one clear focal point, at least two surface levels, colour carrying status, no section that is only a sentence, and it holds up at phone width.
