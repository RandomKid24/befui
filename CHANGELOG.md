# Changelog

All notable changes to befui. Versions follow [semver](https://semver.org): new components are minor releases, breaking prop changes are major. The same list, with links to each component, is on the docs site under Changelog.
(Generated from src/registry/changelog.json by `npm run registry:build`. Edit the JSON, not this file.)

## 1.9.1 - 2026-10-14

Next.js fixes for four dashboards, safer remove, readable amber and orange

- **Fixed:** Next.js: blocks that pass a function to a chart (finance, analytics, ecommerce and sales dashboards) now start with 'use client'. The check now flags any component that passes a function as a prop. (Finance dashboard, Analytics dashboard, Ecommerce dashboard, Sales dashboard)
- **Fixed:** befui remove now looks at every source file under your folder (pages, libs, blocks), not just components, handles relative imports, and lets you remove two components that use each other in one command.
- **Fixed:** Themes: amber and orange use a deeper primary so links and active states are readable on white (4.5:1), and the test now checks primary text on the page background for every theme.
- **Fixed:** Chat app and calendar app no longer fail on plain http, where crypto.randomUUID does not exist. (Chat app, Calendar app)

## 1.9.0 - 2026-10-14

Ten new page blocks and befui diff and remove

- **Added:** Account and system pages: OTP verify (six-digit code with a resend countdown), onboarding wizard (four steps with validation), notifications page (All and Unread tabs) and a server error page (500 with a retry and an incident timeline). (OTP verify, Onboarding wizard, Notifications page, Server error page)
- **Added:** Marketing and finance pages: a team page, a contact page (form with validation beside an FAQ) and a finance dashboard (balances, cash flow, spending by category, transactions). (Team page, Contact page, Finance dashboard)
- **Added:** App pages: a kanban board page (search, priority filter, task dialog, Alt and arrow keys to move cards), a chat app and a calendar app (add events in a dialog). (Kanban board page, Chat app, Calendar app)
- **Added:** CLI: befui diff <name> shows how your copy of a component differs from the latest, and befui remove <name> deletes a component's files. Remove refuses while other files import it, unless you pass --force.
- **Fixed:** Blocks are now checked for accessibility in the test suite. That found and fixed unnamed progress bars in billing, campaign performance, leave approvals and project overview, and an empty table header in employee directory. (Billing page, Campaign performance, Leave approvals, Project overview, Employee directory)

## 1.8.0 - 2026-10-13

Next.js support, 108 more icons, brand logos and ten themes

- **Changed:** Next.js: components that use state, Radix or browser APIs now start with 'use client', so they work in the App Router with nothing to configure. Purely presentational ones (cards, badges, tables, icons) stay server components, and a build check stops a new component shipping without the directive.
- **Added:** Icons: 108 new ones, 389 in total. Arrows and corners, panel and layout controls, text-editor tools, file types, developer icons, drag handles and calendar variants, plus health, finance, chart, weather and transport sets.
- **Added:** Brand icons: 30 logos (Google, GitHub, Apple, X, Stripe, Visa and more) as single-colour SVGs that follow the text colour, with official colours in brandColors. Check each provider's rules before using one in an official sign-in button. (Brand icons)
- **Added:** Themes: ten ready palettes (blue, indigo, violet, rose, red, emerald, teal, amber, orange, slate) for light and dark, all passing WCAG AA, on a new Themes page that recolours the docs live. befui init --theme rose writes one into your index.css.
- **Changed:** Sign in and sign up now offer Continue with Google and GitHub buttons above an or divider. (Sign in, Sign up)
- **Fixed:** Default dark theme: primary button text is now near-black instead of white, raising its contrast from 3.7 to 5.3 (WCAG AA). To keep the old look, set --primary-foreground back to #ffffff in .dark.

## 1.7.2 - 2026-10-13

Tour keyboard and spotlight fixes, input group disabled styling

- **Fixed:** Tour: arrow keys no longer fire with Alt, Ctrl, Cmd or Shift held, or while focus is in another widget on the page, and they swap in right-to-left pages. The spotlight no longer trails the target while the page scrolls, and never dims the whole page before it is positioned. (Tour)
- **Fixed:** Input group: a disabled button inside an addon no longer dims the whole field; only a disabled input does. (Input group)
- **Changed:** Hover card: the docs now say what to keep out of it (links, buttons, anything essential), because the card cannot be reached with the keyboard. (Hover card)

## 1.7.1 - 2026-10-13

Accessibility fixes: all 18 examples that failed the automated check now pass

- **Fixed:** Field: the label is now tied to its control automatically, so clicking the label focuses the input and screen readers announce it. Before, you had to set htmlFor and id yourself. (Label and Field)
- **Fixed:** Structure: the calendar is a real grid of rows and cells (same look, same keys), the file manager is a named listbox of options, the mention input is a text box that points at the active suggestion (a textarea cannot be a combobox), and accordion panels are named after their heading. (Calendar, File manager, Mention input, Accordion)
- **Fixed:** Names: progress bar and progress ring take an aria-label, the tag input keeps a name once tags replace its placeholder, the onboarding checklist names its bar, version log groups include the release number, the day agenda now-line has a role, and the typewriter and text reveal read their full text to screen readers. (Progress, Progress ring, Tag input, Onboarding checklist, Version log, Day agenda, Typewriter, Reveal)
- **Changed:** Examples: sliders, the select, the tooltip icon buttons and the table progress bars now carry labels, so they show the right way to build them. (Slider, Gauge, Select, Tooltip, Table)

## 1.7.0 - 2026-10-13

Seven missing basics: hover card, button and input groups, toggle group, navigation menu, menubar and tour

- **Added:** Menus and previews: hover card for a preview that opens on hover or focus, menubar for File, Edit, View style bars, and a navigation menu with mega-menu panels. (Hover card, Menubar, Navigation menu)
- **Added:** Joined controls: button group and input group (text, icons or buttons attached to a field), and a toggle group that lets several buttons stay pressed for formatting toolbars. (Button group, Input group, Toggle group)
- **Added:** Product tour: spotlight parts of the page one step at a time, with Back, Next, Skip, arrow keys, Escape and reduced-motion support. (Tour)

## 1.6.0 - 2026-10-12

34 animated charts with how-to-read guides, 13 page blocks, 16 building parts and 90 more icons

- **Added:** Chart guides: every chart page has a "New to this chart? Start here" panel that says what it shows, how to read it, when to use it and when to skip it. The same text is in llms-full.txt, so an AI can explain a chart to your users. (Charts, Line chart, Radar chart, Area chart, Treemap, Sankey chart, Box plot chart, Chord chart)
- **Added:** Everyday charts: pie, half donut, area (stacked or overlapping), stacked bar, histogram, lollipop, scatter or bubble, circle packing and word cloud. Each plays its entrance when scrolled into view. (Pie chart, Half donut chart, Area chart, Stacked bar chart, Histogram chart, Lollipop chart, Scatter chart, Circle pack chart, Word cloud)
- **Added:** Comparison charts: slope, dumbbell, bullet, butterfly, bump (rank over time), Pareto (the 80/20 view), waterfall, forecast with a confidence band and Marimekko. (Slope chart, Dumbbell chart, Bullet chart, Butterfly chart, Bump chart, Pareto chart, Waterfall chart, Forecast chart, Marimekko chart)
- **Added:** Flow and hierarchy charts: Sankey, chord, treemap, sunburst and streamgraph. Ribbons draw in, tiles spring, rings sweep. (Sankey chart, Chord chart, Treemap, Sunburst chart, Stream chart)
- **Added:** Circular charts: radial bar, radial line, rose and waffle. The radar (pentagon) chart now grows out from the center too. (Radial bar chart, Radial line chart, Rose chart, Waffle chart, Radar chart)
- **Added:** Distribution and live charts: box plot, ridgeline, matrix heatmap, punch card, Venn, candlestick, and a live streaming chart that slides as new values arrive. (Box plot chart, Ridgeline chart, Matrix heatmap, Candlestick chart, Live chart, Punch card chart, Venn chart)
- **Added:** New blocks for common pages: analytics dashboard, ecommerce dashboard, project overview, user management, profile, billing, API keys, invoice, checkout, landing page, inbox, top-nav layout and a 404 page. (Analytics dashboard, Ecommerce dashboard, Project overview, User management, Profile page, Billing page, API keys page, Invoice page, Checkout page, Landing page, Inbox, Top-nav layout, Not found page)
- **Added:** Page building parts: theme toggle, user menu, settings layout, description list, bar list, comparison table, invoice and landing sections (hero, feature grid, stats, FAQ, CTA banner, footer). (Theme toggle, User menu, Settings layout, Description list, Bar list, Comparison table, Invoice, Landing sections)
- **Added:** More building blocks: uptime bar for status pages, leaderboard with rank badges, rating breakdown for reviews, and a credit card preview that flips in 3D. (Uptime bar, Leaderboard, Rating breakdown, Credit card)
- **Added:** More everyday parts: week strip for picking a day, order tracker for delivery progress, diff viewer for before and after text, and a day agenda time grid with overlapping events. (Week strip, Order tracker, Diff viewer, Day agenda)
- **Added:** About 90 new icons: arrows, finance, files, devices, status, layout, people and editor tools.
- **Changed:** Chart entrances: sparkline, bar chart, donut and line chart now wipe, grow or sweep in when scrolled into view, and skip it for reduced motion. (Charts, Line chart)
- **Changed:** AI docs: llms.txt now has a page-recipe section (which blocks and parts to combine for a dashboard, settings page, landing page and more) and a block index grouped by purpose.
- **Fixed:** Stat card: the delta line no longer wraps word by word and the sparkline no longer spills out of a narrow card; it drops below the number instead. Donut chart: the legend wraps under the ring in narrow cards. (Stat card, Charts)

## 1.5.0 - 2026-10-09

Pivot and tree tables, week view, uploads with progress and auth blocks

- **Added:** Pivot table: cross-tab of your rows with sum, count, average, min or max, totals and heat shading. (Pivot table)
- **Added:** Tree table: rows with child rows, opened by click or arrow keys. (Tree table)
- **Added:** File uploader: several files at once with a progress bar each, cancel, retry and a concurrency limit. (File uploader)
- **Added:** Onboarding carousel: swipeable mobile intro with dots, Skip and a final Get started button. (Onboarding carousel)
- **Added:** Auth blocks: sign up with a password strength meter, and a four-step reset password flow. (Sign up, Reset password)
- **Added:** Week view: the event calendar now switches between month and week, and the week lists every event. (Event calendar)
- **Fixed:** Event calendar: a multi-day event now names itself once, on its first day and at the start of each week row, instead of on every day. (Event calendar)
- **Changed:** Changelog: every older release is rewritten with a bold label on each note, so it reads like the newer ones.

## 1.4.1 - 2026-10-09

An easier-to-read changelog

- **Changed:** Version log: each release groups its notes under Added, Changed, Fixed and Removed, with a bold lead phrase on every note so a long release can be skimmed. Larger text and clearer spacing. (Version log)
- **Fixed:** Event calendar: the "+n more" label no longer reads backwards in right-to-left pages. (Event calendar)

## 1.4.0 - 2026-10-09

Install flow, four new components, two blocks and locale support

- **Added:** New components: phone input (country picker, E.164 output), signature pad, event calendar (month view, multi-day events) and virtual list for huge datasets. (Phone input, Signature pad, Event calendar, Virtual list)
- **Added:** New blocks: pricing page and settings page. (Pricing page, Settings page)
- **Added:** Install flow: every component page now shows the befui add command first, and has a Copy for AI button that copies the install line, an example and the full source.
- **Added:** RTL switch: every preview can be flipped right-to-left to check a component.
- **Changed:** Locale support: calendar, date picker and range picker take a locale for month and weekday names and digits. Calendar flips its arrows and arrow-key movement in right-to-left pages, and the currency input and date picker use logical start and end spacing. (Calendar, Date picker, Currency input)

## 1.3.0 - 2026-10-08

Animated changelog and a version log component

- **Added:** Version log: an animated version history component. The rail draws and dots pop as releases scroll in, entries slide in one by one, releases fold open, with a version jump strip and a kind filter. The changelog page uses it. (Version log)
- **Added:** Changelog page: a page on the docs site where you can click any component name to open it. Click any component name to open it.
- **Added:** Icons: 95 new ones (189 in total), covering devices and media, commerce, charts, text formatting, files, map and travel, status, playback and more. Find them on the Icons page.

## 1.1.0 - 2026-10-08

Sixty new components, blocks and a smarter CLI

- **Added:** Page furniture: changelog, testimonial card, comment thread, code block, status dot, table of contents. (Changelog, Testimonial card, Comment thread, Code block, Status dot, Table of contents)
- **Added:** Search and input helpers: search bar with live results, currency input, inline edit, filter bar, notification center, cookie consent. (Search bar, Currency input, Inline edit, Filter bar, Notification center, Cookie consent)
- **Added:** Roles and access: permission matrix with per-column toggles and locked roles. (Permission matrix)
- **Changed:** Tooltip: gets a title, keyboard shortcut, light style and arrow, plus InfoTip and TruncatedText. (Tooltip)
- **Changed:** Data table: row selection with bulk actions, a column menu, sticky header, toolbar slot, row action menus and clickable rows. Table gets a footer and caption. (Data table, Table)
- **Added:** Boards, feeds and menus: kanban, activity feed, context menu. (Kanban board, Activity feed, Context menu)
- **Added:** Loader: six animations, a bar and an overlay. (Loader)
- **Changed:** Date range picker: gets quick presets (Last 7 days, This month and more) and a day count. (Date picker)
- **Added:** Reports table block: search, filters, sorting, row actions and a details drawer. (Reports table)
- **Added:** Online shop: product card, coupon input, order summary. (Product card, Coupon input, Order summary)
- **Added:** Layout and lists: split pane, sortable list, navbar, bottom navigation, floating action button. (Split pane, Sortable list, Navbar, Bottom navigation, Floating action button)
- **Added:** People and conversation: chat, mention input, profile card, terminal, error state, image viewer. (Chat, Mention input, Profile card, Terminal, Error state, Image viewer)
- **Added:** Charts and files: line chart, radar chart, audit log, file manager. (Line chart, Radar chart, Audit log, File manager)
- **Added:** Mobile and uploads: swipe actions, pull to refresh, bottom sheet, date and time picker, image upload. (Swipe actions, Pull to refresh, Bottom sheet, Date and time picker, Image upload)
- **Changed:** Avatar: gets presence dots, square shape, an extra-large size, hover names on groups and UserInfo. (Avatar)
- **Added:** Avatar upload: pick a photo and see it instantly. (Avatar upload)
- **Added:** Forms and settings: schema form (multi-step wizard), rich text editor, notification preferences, saved views. (Schema form, Rich text editor, Notification preferences, Saved views)
- **Added:** Planning and flow: funnel chart, gantt chart, org chart, approval flow, onboarding checklist, tag manager. (Funnel chart, Gantt chart, Org chart, Approval flow, Onboarding checklist, Tag manager)
- **Added:** Shortcuts dialog: press ? to open it. Also number formatting helpers. (Shortcuts dialog, Format helpers)
- **Added:** Sales dashboard block: KPI cards, revenue line chart, funnel and top deals. (Sales dashboard)
- **Added:** CLI: the update command adds missing animations to your index.css; befui add warns when one is missing. befui mcp runs an MCP server for AI tools.
- **Changed:** Icons everywhere: every component now uses the built-in icon set. lucide-react is no longer installed by init.
- **Changed:** Docs site: loads demos on demand (main bundle 1.4 MB down to 0.58 MB), and llms.txt is grouped by category with rules and a task map.

## 1.0.1 - 2026-10-07

Time components and AI-friendly docs

- **Added:** Time: time picker, analog clock, world clock, stopwatch, timer, countdown and relative time. (Time picker, Analog clock, World clock, Stopwatch, Timer, Countdown, Relative time)
- **Added:** Data and display: heatmap and pricing card. (Heatmap, Pricing card)
- **Added:** AI tooling: llms.txt and llms-full.txt, AGENTS.md rules written by init, a Use with AI page, and befui add all.

## 1.0.0 - 2026-10-06

First release

- **Added:** Inputs and forms: button, input, label and field, checkbox, switch, select, combobox, calendar, date picker, segmented, slider, radio group, rating, OTP input, tag input, number stepper, chip, color picker. (Button, Input, Label and Field, Checkbox, Switch, Select, Combobox, Calendar, Segmented control, Slider, Radio group, Rating, OTP input, Tag input, Number stepper, Chip, Color picker)
- **Added:** Display and motion: accordion, spotlight card, border beam, marquee, carousel, compare, tilt card, shimmer text, typewriter, confetti, dock, collapsible, tree view. (Accordion, Spotlight card, Border beam, Marquee, Carousel, Image compare, Tilt card, Shimmer text, Typewriter, Confetti, Dock, Collapsible, Tree view)
- **Added:** Data and layout: data table, gauge, progress ring, number ticker, stat card, charts, sidebar, app shell. (Data table, Gauge, Progress ring, Number ticker, Stat card, Charts, Sidebar, App shell)
- **Added:** Feedback and overlays: banner, alert, toast, skeleton, dialog and sheet, alert dialog, dropdown menu, popover, tooltip, command palette. (Banner, Alert, Toast, Skeleton, Dialog and Sheet, Alert dialog, Dropdown menu, Popover, Tooltip, Command palette)
- **Added:** Foundations: a built-in icon set, Storybook, the befui CLI (init, add, list), and HRMS and marketing blocks. (Admin shell, Employee directory, Leave approvals, Lead pipeline, Sign in)
