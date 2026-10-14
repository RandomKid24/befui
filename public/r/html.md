# befui for HTML and htmx

> Every befui component is a custom element in a plain HTML page: one CSS file and one script, no React in your app. Build them with `npm run build:html` (dist/html/befui.css and befui.js).

```html
<link rel="stylesheet" href="/befui.css">
<script src="/befui.js" defer></script>
<bef-button variant="soft">Save</bef-button>
```

## Rules
- Tag = `bef-` + kebab-case export name: Button -> <bef-button>, DataTable -> <bef-data-table>, DialogTrigger -> <bef-dialog-trigger>. Icons too: <bef-home-icon>.
- Props are attributes in kebab-case (default-value, as-child). A bare attribute is true. Strings are the default.
- JSON props use a colon: :value="40", :items='[{"id":"a","title":"T"}]'. Inside that JSON, a string that starts with a tag becomes content: {"icon":"<bef-home-icon></bef-home-icon>"}. A string like "~2026-12-31" becomes a Date.
- A child with slot="name" becomes the prop `name` (<bef-button slot="action">Undo</bef-button>). Other children are the component's children.
- Dates as plain attributes: ~to="2026-12-31T09:00".
- Callbacks: emit="value-change open-change" fires bubbling events bef:value-change and bef:open-change (value in event.detail). The tag also writes the new value back to itself (:value, :open...), so controlled components work with no script; set :open="true" to open a controlled dialog.
- Props that are functions or JSX (render, columns, onSubmit, onApply) cannot be attributes: set them from script, element.props = { columns: [...], onSubmit: fn }.
- style works on the outer tag. Do not invent Tailwind classes in HTML (they are not in the CSS); use inline style for layout.
- Works with htmx: elements added by a swap upgrade by themselves and hx-* attributes inside are processed. Radix inputs submit with the surrounding <form>.
- Dark mode: the dark class on <html>. Theme: the same CSS variables (--primary, ...).
- window.befui.toast.success('Saved') shows a toast when <bef-toaster> is on the page.
