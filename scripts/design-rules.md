## Making the screen look designed (read before composing a page)

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
