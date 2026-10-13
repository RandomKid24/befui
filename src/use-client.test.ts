// Next.js App Router renders components on the server unless they say 'use client'.
// Anything with state, context, Radix, handlers or browser globals must carry the directive; this keeps new files honest.
import { describe, expect, it } from 'vitest';
import { hasDirective, needsClient } from '../scripts/use-client.mjs';

describe('needsClient', () => {
  it.each([
    ['a React hook', 'const [a, setA] = useState(0);'],
    ['a namespaced hook', 'const r = React.useRef(null);'],
    ['a custom hook', 'const [ref, seen] = useInView();'],
    ['a handler prop', 'export const A = () => <button onClick={go} />;'],
    ['a Radix import with no hooks', "import * as D from '@radix-ui/react-dialog';\nexport const Dialog = D.Root;"],
    ['cmdk', "import { Command } from 'cmdk';"],
    ['a browser global', "const m = window.matchMedia('(min-width: 1px)');"],
    ['context', 'const C = React.createContext(null);'],
    ['a function passed as a prop (not allowed server to client)', 'export const A = () => <LineChart format={(n) => `${n}L`} />;'],
  ])('is true for %s', (_, source) => {
    expect(needsClient(source)).toBe(true);
  });

  it.each([
    ['a pure icon file', "export const SearchIcon = make('SearchIcon', [['circle', 11, 11, 6]]);"],
    ['a formatting helper', 'export const formatPercent = (n: number) => `${n}%`;'],
    ['a comment that mentions window. and useState(', '// uses window.x and useState(0) in the docs\nexport const A = () => <div />;'],
  ])('is false for %s', (_, source) => {
    expect(needsClient(source)).toBe(false);
  });
});

describe('hasDirective', () => {
  it.each([["'use client';\nimport x from 'x';", true], ['"use client"\nimport x from "x";', true], ["\n\n'use client';\nconst a = 1;", true], ["import x from 'x';\n'use client';", false], ['const a = 1;', false]])(
    '%j -> %s',
    (source, expected) => {
      expect(hasDirective(source)).toBe(expected);
    },
  );
});

describe('the library', () => {
  const files = {
    ...import.meta.glob('/src/components/ui/*.tsx', { query: '?raw', import: 'default', eager: true }),
    ...import.meta.glob('/src/blocks/*.tsx', { query: '?raw', import: 'default', eager: true }),
  } as Record<string, string>;

  it('marks every file that needs the directive', () => {
    const missing = Object.entries(files)
      .filter(([, src]) => needsClient(src) && !hasDirective(src))
      .map(([path]) => path.replace('/src/', ''));
    expect(missing).toEqual([]);
  });
});
