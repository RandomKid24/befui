// Decides whether a component file must start with 'use client' to work in the Next.js App Router.
// False positives are harmless (a client boundary around a pure file); false negatives break server-rendered pages.

const withoutComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');

export function needsClient(source) {
  const src = withoutComments(source);
  return (
    /\buse[A-Z]\w*\s*\(/.test(src) || // React and custom hooks
    /\bcreateContext\b/.test(src) ||
    /from\s+['"](@radix-ui\/|cmdk)/.test(src) ||
    /\bon[A-Z]\w*\s*=/.test(src) || // JSX event handler props
    /\b(window|document|localStorage|sessionStorage|navigator)\./.test(src)
  );
}

/** True when the first statement of the file is the 'use client' directive (either quote style). */
export function hasDirective(source) {
  return /^\s*(['"])use client\1/.test(source);
}
