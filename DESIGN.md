# Design

How befui looks and why. Read this before adding a component, a variant or a page, so it matches the rest.

## Principles

1. **Quiet by default.** Hairline borders, small shadows, one accent colour. A screen built from befui should look calm; the content is the loudest thing on it.
2. **One variable rebrands everything.** Every colour is a CSS variable. Change `--primary` and links, focus rings, active states, charts and buttons follow, in light and dark. Components never hard-code a colour, except a few on purpose (brand logos, code highlighting, the `brutal` button).
3. **Motion explains, it does not decorate.** Things move to show cause and effect: a panel opening, a number counting to its value, a toast arriving. Everything stops for `prefers-reduced-motion`. Nothing loops without a reason (loaders, live data).
4. **Real states, not just the happy path.** Every input has invalid, disabled and loading. Every list has empty and error.
5. **Same design on every platform.** React, the `<bef-*>` HTML tags and the Flutter widgets share the same tokens, sizes and radii. A change to a token goes to all three.
6. **Accessible first.** Radix handles focus, keyboard and ARIA for overlays and menus. The rest follow the same rules, and the test suite runs an accessibility check on every example (`src/examples.a11y.test.tsx`).

## Colour

Tokens live in `src/index.css` (`:root` for light, `.dark` for dark). Ten ready palettes are in `src/registry/themes.json` and on the Themes page.

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--background` | `#ffffff` | `#0a0c10` | page |
| `--foreground` | `#0f172a` | `#e6e9ef` | text |
| `--card` | `#ffffff` | `#0f1218` | raised surfaces |
| `--primary` | `#2563eb` | `#3b82f6` | the one accent: buttons, links, focus, active |
| `--secondary` | `#f1f5f9` | `#171b23` | quiet fills, hover |
| `--muted` / `--muted-foreground` | `#f8fafc` / `#64748b` | `#11141b` / `#8b94a5` | backgrounds and secondary text |
| `--accent` | `#eff6ff` | `#14213d` | selected rows, soft highlights |
| `--border` / `--input` | `#e2e8f0` | `#1f2430` / `#272d3a` | hairlines and field borders |
| `--ring` | `#3b82f6` | `#3b82f6` | focus ring |
| `--destructive` / `--success` / `--warning` / `--info` | rose, emerald, amber, blue | brighter | status |

Full token list (from `src/index.css`):

| Token | Light | Dark |
|---|---|---|
| `--primary-foreground` | `#ffffff` | `#0a0c10` |
| `--card-foreground` / `--popover` / `--popover-foreground` | `#ffffff`, `#0f172a` | `#0f1218`, `#e6e9ef` |
| `--secondary-foreground` | `#0f172a` | `#e6e9ef` |
| `--accent-foreground` | `#1d4ed8` | `#93c5fd` |
| `--destructive` | `#e11d48` | `#f43f5e` |
| `--success` | `#059669` | `#10b981` |
| `--warning` | `#d97706` | `#f59e0b` |
| `--info` | `#2563eb` | `#60a5fa` |

The blue family is Tailwind blue: 50 `#eff6ff` (accent), 300 `#93c5fd`, 400 `#60a5fa`, 500 `#3b82f6` (ring, dark primary), 600 `#2563eb` (primary), 700 `#1d4ed8`. Neutrals are slate, with a slightly blue-black in dark (`#0a0c10`, `#0f1218`, `#171b23`).

Rules: text on `--primary` is `--primary-foreground`; status colours always come with an icon or label, never colour alone; primary text on the page background must pass 4.5:1 (the tests check this for every palette).

## Type

Inter for text, JetBrains Mono for code and keys. The scale follows Tailwind: 11 (labels, uppercase with tracking), 12, 13 (dense UI), 14 (default), 16, 18, 20, 24, 30, 36+. Weights: 400 body, 500 labels and buttons, 600 titles. Headlines use tight tracking (`-0.02em` and up). Numbers in tables and stats use tabular figures.

## Shape and space

- **Radius:** `--radius` is 8px. Small is 6, large 10, cards and dialogs 14, pills fully round. Inputs, buttons and menus are 8.
- **Borders:** 1px, `--border`. Focus is a 2px `--ring` at 40–50% opacity, never removed.
- **Shadow:** `sm` for cards at rest, `md` for hover and popovers. Dark mode leans on borders more than shadows.
- **Density:** controls are 36px tall (32 small, 40 large); touch targets on mobile are at least 40.
- **Spacing:** a 4px grid. Cards pad 20, dense lists 12–16, page gutters 16 on mobile and 24+ on desktop.

## Motion

| What | Timing |
|---|---|
| hover, press, colour changes | 150ms ease |
| menus, popovers, dropdowns | 150ms fade + 2px rise |
| accordion, collapsible, panels | 200–300ms, height via grid rows |
| drawers, sheets, toasts | 250–280ms `cubic-bezier(0.22, 1, 0.36, 1)` |
| number tickers, progress, chart draw-in | 700–1200ms ease-out, once |
| page change | 280ms fade and 6px rise |

Only `transform` and `opacity` are animated in loops or on scroll, so nothing repaints per frame. Components that run on a timer (clocks, live charts, typewriter, marquee) pause when off screen or when the user prefers reduced motion.

## Components

- **Variants over props soup.** A `Button` has `variant`, `size`, `shape`. Add a variant before adding a boolean.
- **Compose, do not configure.** Cards are `Card` + `CardHeader` + `CardContent`; menus are items you pass in. A component takes children before it takes a config object.
- **One file each.** A component is a single file you can copy; shared pieces (`cn`, icons) are the only imports across files.
- **Logical spacing.** `ms-*`, `ps-*`, `start-*` instead of left and right, so components flip in right-to-left pages.
- **Icons:** our own set (`src/components/ui/icons.tsx`), 24px grid, 1.75 stroke, `currentColor`, optional draw animation. No icon package.

## The docs site

The site is built from the library, so it is the first test of every component.

- **Home:** headline, two buttons, the install line, then a sheet of real components (buttons, badges, controls) that fills in diagonally once. No decorative animation loops.
- **Per component:** React, HTML and Flutter tabs, each on its own page with its own sidebar. Flutter pages have a working preview at phone width and a phone-frame view.
- **Speed budget:** the first load is the shell and the home page; every other page loads on demand. Long lists use `content-visibility` and lazy-mounted previews so they stay smooth.

## Flutter

The same tokens, as a `BefTheme` extension (`context.bef.primary`). Widgets use custom-styled Material parts: hover, press (scale 0.97) and focus ring are drawn by `BefPressable`; icons are painted from the same SVG paths. Never hard-code a colour in a widget, use `context.bef`. Dark mode follows `Theme.of(context).brightness`.

## Adding something new

1. Does an existing component with a new variant cover it? Add the variant.
2. Build it with tokens only. Check light, dark, a custom palette and RTL.
3. Add an example in `src/examples/<name>.tsx` with the empty/loading/error states that apply.
4. Run `npm run registry:build` (updates the catalog, `llms.txt`, README counts and `COMPONENTS.md`) and `npm test`.
5. If it makes sense on a phone, add the Flutter widget and example (see `flutter/`).
