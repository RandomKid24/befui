# Changelog

All notable changes to befui. Versions follow [semver](https://semver.org): new components are minor releases, breaking prop changes are major. The same list, with links to each component, is on the docs site under Changelog.
(Generated from src/registry/changelog.json by `npm run registry:build`. Edit the JSON, not this file.)

## 1.6.0 - 2026-10-12

Dashboard, account and marketing pages, animated charts, building blocks and 90 more icons

- **Added:** New blocks for common pages: analytics dashboard, ecommerce dashboard, project overview, user management, profile, billing, API keys, invoice, checkout, landing page, inbox, top-nav layout and a 404 page. (Analytics dashboard, Ecommerce dashboard, Project overview, User management, Profile page, Billing page, API keys page, Invoice page, Checkout page, Landing page, Inbox, Top-nav layout, Not found page)
- **Added:** Page building parts: theme toggle, user menu, settings layout, description list, bar list, comparison table, invoice and landing sections (hero, feature grid, stats, FAQ, CTA banner, footer). (Theme toggle, User menu, Settings layout, Description list, Bar list, Comparison table, Invoice, Landing sections)
- **Added:** Animated charts: pie, half donut, radial line, histogram, Pareto, slope, butterfly, lollipop, sunburst, ridgeline, box plot, chord, bump, rose, bullet, dumbbell, waffle, treemap, waterfall, Sankey flow, streamgraph, candlestick, area chart (stacked or overlapping), scatter and bubble chart, matrix heatmap, stacked bar chart, radial bar chart and a live streaming chart. Sparkline, bar chart, donut and line chart now play an entrance (wipe, grow or sweep) when scrolled into view, and skip it for reduced motion. (Pie chart, Half donut chart, Radial line chart, Histogram chart, Pareto chart, Slope chart, Butterfly chart, Lollipop chart, Sunburst chart, Ridgeline chart, Box plot chart, Chord chart, Bump chart, Rose chart, Bullet chart, Dumbbell chart, Waffle chart, Treemap, Waterfall chart, Sankey chart, Stream chart, Candlestick chart, Area chart, Scatter chart, Matrix heatmap, Stacked bar chart, Radial bar chart, Live chart, Charts, Line chart, Radar chart)
- **Added:** More building blocks: uptime bar for status pages, leaderboard with rank badges, rating breakdown for reviews, and a credit card preview that flips in 3D. (Uptime bar, Leaderboard, Rating breakdown, Credit card)
- **Added:** Chart guides: every chart page now has a "New to this chart? Start here" panel that says what it shows, how to read it, when to use it and when to skip it. The same text is in llms-full.txt. The radar (pentagon) chart now grows out from the center on scroll. (Radar chart, Charts, Line chart, Area chart, Treemap, Sankey chart, Box plot chart, Chord chart)
- **Added:** About 90 new icons: arrows, finance, files, devices, status, layout, people and editor tools.
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
