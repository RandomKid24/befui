'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, HomeIcon } from '@/components/ui/icons';

// Swap these for your own routes. The prompt below searches this list, so a lost visitor gets real suggestions.
const ROUTES = [
  ['/docs', 'Getting started'], ['/components', 'All components'], ['/blocks', 'Whole screens'], ['/dashboards', 'Dashboard designs'], ['/recipes', 'Copy-paste recipes'],
  ['/icons', 'Icon set'], ['/themes', 'Colour themes'], ['/changelog', 'What changed'],
] as const;

// "404" in block letters. The middle glyph is the zero, split out so it can flicker on its own.
const FOUR = ['██╗  ██╗', '██║  ██║', '███████║', '╚════██║', '     ██║', '     ╚═╝'];
const ZERO = [' ██████╗ ', '██╔═████╗', '██║██╔██║', '████╔╝██║', '╚██████╔╝', ' ╚═════╝ '];

/** Loose match: a straight substring beats letters that appear in order. */
const score = (q: string, s: string) => {
  const a = q.toLowerCase();
  const b = s.toLowerCase();
  if (b.includes(a)) return 2;
  let i = 0;
  for (const ch of b) if (ch === a[i]) i++;
  return i === a.length ? 1 : 0;
};

type Line = { kind: 'in' | 'out' | 'link'; text: string; to?: string };

/** A 404 that behaves like a terminal. Type a word to search the routes, or try help, back and home. */
export default function NotFoundPage() {
  const [value, setValue] = React.useState('');
  const [lines, setLines] = React.useState<Line[]>([{ kind: 'out', text: 'No such file: that page. Type what you were looking for, or "help".' }]);
  const tail = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => { tail.current?.scrollIntoView({ block: 'nearest' }); }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    const out: Line[] = [{ kind: 'in', text: cmd }];
    if (cmd === 'help') out.push({ kind: 'out', text: 'Type any word to search. Commands: back, home, ls, clear.' });
    else if (cmd === 'back') { out.push({ kind: 'out', text: 'Going back.' }); history.back(); }
    else if (cmd === 'home') { out.push({ kind: 'out', text: 'Heading home.' }); window.location.assign('/'); }
    else if (cmd === 'clear') { setLines([]); setValue(''); return; }
    else if (cmd === 'ls') ROUTES.forEach(([to, label]) => out.push({ kind: 'link', text: `${to.padEnd(14)}${label}`, to }));
    else {
      const hits = ROUTES.map(([to, label]) => ({ to, label, s: Math.max(score(cmd, to), score(cmd, label)) })).filter((h) => h.s > 0).sort((a, b) => b.s - a.s);
      if (hits.length === 0) out.push({ kind: 'out', text: `Nothing matches "${cmd}". Try "ls" to see everything.` });
      else { out.push({ kind: 'out', text: `${hits.length} close match${hits.length === 1 ? '' : 'es'}:` }); hits.forEach((h) => out.push({ kind: 'link', text: `${h.to.padEnd(14)}${h.label}`, to: h.to })); }
    }
    setLines((l) => [...l, ...out]);
    setValue('');
  };

  return (
    <div className="grid min-h-[480px] place-items-center rounded-xl border bg-[oklch(0.16_0.012_60)] p-4 text-[oklch(0.9_0.02_80)] sm:p-8">
      <style>{`@keyframes nf-flick{0%,18%,22%,62%,100%{opacity:1}20%{opacity:.25}64%{opacity:.4}66%{opacity:1}68%{opacity:.2}70%{opacity:1}}`}</style>
      <div className="w-full max-w-2xl">
        <div className="overflow-x-auto overflow-y-hidden pb-1" role="img" aria-label="404">
          <pre aria-hidden className="mx-auto w-fit select-none font-mono text-[13px] leading-[1.05] sm:text-[22px]">
            {FOUR.map((f, i) => (
              <span key={i} className="block whitespace-pre">
                <span>{f}</span><span className="text-[oklch(0.78_0.15_70)] motion-safe:[animation:nf-flick_4s_infinite]">{ZERO[i]}</span><span>{f}</span>
              </span>
            ))}
          </pre>
        </div>
        <p className="mt-4 text-center font-mono text-xs text-[oklch(0.7_0.02_80)]">The page you asked for is not on this server.</p>

        <div className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-black/35 font-mono text-[13px]">
          <div className="max-h-56 overflow-y-auto p-4" role="log" aria-live="polite" aria-label="Terminal output">
            {lines.map((l, i) => (
              <p key={i} className="whitespace-pre-wrap break-words leading-relaxed">
                {l.kind === 'in' && <span><span className="text-[oklch(0.78_0.15_70)]">$ </span>{l.text}</span>}
                {l.kind === 'out' && <span className="text-[oklch(0.72_0.02_80)]">{l.text}</span>}
                {l.kind === 'link' && <a href={`#${l.to}`} className="rounded-sm text-[oklch(0.82_0.1_200)] underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[oklch(0.78_0.15_70)]">{l.text}</a>}
              </p>
            ))}
            <div ref={tail} />
          </div>
          <form className="flex items-center gap-2 border-t border-white/10 px-4 py-2.5" onSubmit={(e) => { e.preventDefault(); run(value); }}>
            <label htmlFor="nf-prompt" className="text-[oklch(0.78_0.15_70)]">$</label>
            <input id="nf-prompt" value={value} onChange={(e) => setValue(e.target.value)} autoComplete="off" spellCheck={false} placeholder="search for a page" className="min-w-0 flex-1 bg-transparent text-[oklch(0.95_0.01_80)] caret-[oklch(0.78_0.15_70)] outline-none placeholder:text-[oklch(0.5_0.02_80)]" />
            <button type="submit" className="rounded px-2 py-0.5 text-xs text-[oklch(0.72_0.02_80)] outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-[oklch(0.78_0.15_70)]">Enter</button>
          </form>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button variant="outline" className="border-white/20 bg-transparent text-inherit hover:bg-white/10" onClick={() => history.back()}><ArrowLeftIcon /> Go back</Button>
          <Button asChild><a href="/"><HomeIcon /> Home</a></Button>
        </div>
      </div>
    </div>
  );
}
