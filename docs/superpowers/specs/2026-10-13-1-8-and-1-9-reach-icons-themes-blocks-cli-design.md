# befui 1.8.0 and 1.9.0: Next.js support, icons, themes, blocks, CLI

Date: 2026-10-13. Status: draft for review.

## Goal

Close the gaps found after 1.7: the library breaks in Next.js App Router, has no brand icons or ready themes, lacks common pages, and gives users no way to compare their edited copy with the latest. Five independent sub-projects, shipped as two releases. Each sub-project is a section below and can be built and tested on its own.

- **1.8.0 (reach and look):** A Next.js support, B icons, C theme presets.
- **1.9.0 (pages and tooling):** D ten blocks, E CLI `diff` and `remove`.

Out of scope: publishing to npm (needs the owner's `npm login`), a Slack logo, multi-colour brand logos, new non-block components, animation changes to existing icons, non-React ports.

## What exists today (checked in the repo)

- 199 components, 27 blocks, 281 stroke icons in `src/components/ui/icons.tsx` (`make(name, shapes)` on a 24px grid, exported through an `icons` map that the docs Icons page lists automatically), a CLI in `bin/befui.mjs` (`init`, `add`, `list`, `update`, `mcp`), tokens in `src/index.css` (`:root, .light` and `.dark` blocks defining `--primary`, `--primary-foreground`, `--accent`, `--accent-foreground`, `--ring`).
- No file has `'use client'`. No brand icons exist (only `XIcon`, the close glyph). Blocks are registered in `src/registry/index.ts` and loaded by glob from `src/blocks/*.tsx` (default export each).
- Tests: `src/examples.a11y.test.tsx` scans every example with axe against an empty baseline; `src/new-components.test.tsx` and `src/a11y-fixes.test.tsx` cover behaviour. CI builds, checks generated files are committed, runs tests.

## A. Next.js support (`'use client'`)

Components that use hooks, context, Radix, event handlers or browser globals break in a Next.js server component unless marked `'use client'`. Pure presentational files (icons, format helpers) stay server-compatible.

- `scripts/use-client.mjs` exports `needsClient(source: string): boolean`, true if the file matches any of: a React hook call (`React.use…(`, `useState(`, `useEffect(` and the other hooks), `createContext`, an `@radix-ui/` or `cmdk` import, a JSX event-handler prop (`\bon[A-Z]\w*=`), or `window.` / `document.` / `localStorage` / `navigator.`.
- A one-off codemod (`scripts/add-use-client.mjs`) puts `'use client';` as the first line of every `src/components/ui/*.tsx` and `src/blocks/*.tsx` file that `needsClient` selects and that lacks it. It is run once and kept as the tool for future files.
- `scripts/build-registry.mjs` throws, naming the files, when a file that `needsClient` selects lacks the directive, so a new component cannot ship without it. A vitest test (`src/use-client.test.ts`) asserts the same over the real files.
- README gets a short "Next.js" note: components are marked for the App Router, nothing to configure.
- Verification includes `vite build` with no new warnings.

## B. Icons

**B1. Stroke icons, 108 new** (389 in total), authored in the existing style (24px grid, round caps, shapes from `['path'|'circle'|'rect', …]`). Many icons first listed here already exist (Pill, Thermometer, Rocket, Gauge, Table, Wifi, Landmark and others), so the implementation plan carries the final non-colliding list: health 12, finance 8, charts 8, weather 10, transport 10, and 60 UI and frontend essentials (arrows and corners, panel and layout controls, text-editor tools, file types, developer icons, drag handles and toggles, calendar variants, a few devices that appear in UIs), chosen by the user over everyday objects. Each icon is rendered on the docs Icons page and checked by eye at the default size and enlarged before release.

**B2. Brand icons**, a new file `src/components/ui/brand-icons.tsx` (registry slug `brand-icons`, category Display), separate from the stroke set because logos are filled shapes.

- Exports one component per brand (`GoogleIcon`, `GithubIcon`, …) taking the same `className` and SVG props, `fill="currentColor"`, `viewBox="0 0 24 24"`, decorative by default (`aria-hidden` unless an `aria-label` is passed), plus `brandColors: Record<string, string>` with each brand's hex so callers can opt into colour (`style={{ color: brandColors.github }}`).
- Source: the Simple Icons set (CC0-1.0). The plan's first step copies the 24px paths for: Google, GitHub, Gitlab, Apple, X, Facebook, Instagram, YouTube, TikTok, Reddit, Twitch, Discord, WhatsApp, Telegram, Spotify, Figma, Notion, Dropbox, Google Drive, Zoom, Atlassian, Jira, Trello, Shopify, Stripe, PayPal, Visa, Mastercard.
- Simple Icons does not include Microsoft, LinkedIn or Slack. Microsoft (four squares) and LinkedIn ("in" in a rounded square) are built from simple geometry in the same file; Slack is left out.
- A note in the component's doc comment and README: these are trademarks shown to identify a service; official "Sign in with Google/Apple" buttons have brand rules the glyph alone does not satisfy.
- `block:sign-in` and `block:sign-up` gain "Continue with Google" and "Continue with GitHub" buttons using these icons.

## C. Theme presets

- `src/registry/themes.json`: ten presets (blue is today's default, indigo, violet, rose, red, emerald, teal, amber, orange, slate). Each defines, for light and dark, `primary`, `primary-foreground`, `accent`, `accent-foreground` and `ring`.
- Every preset must meet WCAG AA (4.5:1) for `primary` on `primary-foreground` and `accent` on `accent-foreground`, in both modes. A vitest test (`src/themes.test.ts`) computes the ratios and fails below 4.5. Amber and orange therefore use a dark `primary-foreground`.
- `scripts/build-registry.mjs` writes it to `public/r/themes.json`.
- CLI: `befui init --theme <name>` fetches `themes.json` from the same `--from` source and rewrites the five variables in the `:root, .light` and `.dark` blocks of the generated `index.css`. An unknown name lists the valid ones and exits non-zero. Plain `init` is unchanged.
- Docs site: a `/themes` page (nav entry beside Icons) with a card per preset (swatches, a live mini-preview of a button, badge and progress bar), an Apply button that switches the whole docs site live by injecting a `<style id="befui-theme">`, a Copy CSS button and the `init --theme` command. The chosen theme is not persisted.

## D. Ten new blocks (1.9.0)

Each is `src/blocks/<slug>.tsx` with a default export, built from existing components with mock data you swap, registered in `src/registry/index.ts`, and passing the axe scan.

| Slug | Module | What it is |
|---|---|---|
| `otp-verify` | Auth | Six-digit code entry with a resend countdown and error state |
| `onboarding-wizard` | Account | Four-step setup (profile, team, preferences, done) with a stepper and validation |
| `notifications-page` | Account | Full-page inbox with tabs, filters, mark all read |
| `server-error-page` | Layout | 500 page with retry, status link and a short incident timeline |
| `team-page` | Marketing | Team grid with roles and a join CTA |
| `contact-page` | Marketing | Contact form beside an FAQ accordion |
| `kanban-board-page` | Dashboard | Full-page board with filters, column totals and a card dialog |
| `chat-app` | Messaging | Conversation list, thread and composer |
| `calendar-app` | Productivity | Month and week views with an event dialog |
| `finance-dashboard` | Dashboard | Balances, spending by category, cash-flow chart and recent transactions |

`src/examples.a11y.test.tsx` is extended to scan `src/blocks/*.tsx` too. Any of the 27 existing blocks that fails axe is recorded in `src/a11y-baseline.json` with its exact reason (this may be none); the ten new blocks may not be baselined (the existing "never baselined" guard lists them).

## E. CLI `diff` and `remove` (1.9.0)

- `befui diff <name…>`: fetches the latest files for each component and prints a unified diff against the local copy (`--dir` respected). Identical files print `✓ <name> is up to date`; a missing local file prints a clear message. Exit code 0 in all cases except an unknown component.
- `befui remove <name…>`: deletes the component's own files from the target directory. If any other local file imports it, it refuses and lists them, unless `--force`. It never deletes dependencies it did not name and never touches `index.css`.
- Both work against a local folder via `--from` (used by the tests) as well as the default URL. `befui list`'s help text and the README CLI table gain both commands.

## Testing

- Unit: `use-client.test.ts` (rule matches, all real files comply), `themes.test.ts` (contrast for every preset and mode; JSON shape), icon tests (no duplicate names, every new icon renders an `<svg>` with at least one shape; brand icons render one `<path>` with `fill="currentColor"` and are `aria-hidden` by default).
- Blocks: the extended axe scan, plus a behaviour test per interactive block where it has logic (OTP entry and resend timer, wizard step order and validation).
- CLI: spawn `node bin/befui.mjs` against a temp directory and `--from public` for `init --theme`, `diff` (same, changed, missing) and `remove` (clean, blocked, `--force`).
- Browser: Icons page, Themes page (switch presets in light and dark), each new block page at desktop and mobile width, and the sign-in block, checked for layout and console errors.
- CI stays as is; both releases are pushed with their changelog entries and tags only after build, typecheck and tests pass.

## Success criteria

- A Next.js App Router page can import any copied component without adding `'use client'`; the build and tests fail if a new component needs the directive and lacks it.
- The Icons page shows 389 stroke icons; `brand-icons` has a docs page and sign-in/sign-up offer Google and GitHub.
- `befui init --theme rose` produces a working rose-themed `index.css`; every preset passes the contrast test.
- Ten new blocks render, pass axe, and appear in `llms.txt`; README counts are regenerated.
- `befui diff button` and `befui remove button` behave as specified, with tests.
- 1.8.0 and 1.9.0 are tagged, pushed, and CI is green.
