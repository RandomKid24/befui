import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const KEYWORDS =
  /^(import|export|from|default|const|let|var|function|return|if|else|type|interface|extends|as|new|typeof|async|await|for|of|in|null|undefined|true|false|React)$/;
const HTML_TOKEN = /(<!--[\s\S]*?-->)|('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*")|(<\/?[A-Za-z][\w.-]*)|(\b\d+(?:\.\d+)?\b)|([:~@]?[A-Za-z_][\w-]*(?==))/g;
const DART_KEYWORDS = /^(import|export|show|hide|as|class|extends|implements|with|abstract|enum|mixin|extension|const|final|var|late|static|void|return|if|else|for|while|switch|case|default|break|continue|new|this|super|null|true|false|required|async|await|override|get|set|typedef|in|is|try|catch|throw)$/;
const DART_TOKEN = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*")|()(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][\w$]*\b)/g;
const TOKEN = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`)|(<\/?[A-Z][\w.]*)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][\w$]*\b)/g;

/** Small regex highlighter. Not a parser, but good enough to read TSX and CSS. */
export function highlight(code: string, mode: 'tsx' | 'html' | 'dart' = 'tsx'): React.ReactNode[] {
  const html = mode === 'html';
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const match of code.matchAll(mode === 'html' ? HTML_TOKEN : mode === 'dart' ? DART_TOKEN : TOKEN)) {
    const [text, comment, str, tag, num, word] = match;
    const start = match.index!;
    if (start > last) out.push(code.slice(last, start));
    const key = i++;
    if (comment) out.push(<span key={key} className="text-muted-foreground/70 italic">{text}</span>);
    else if (str) out.push(<span key={key} className="text-emerald-700 dark:text-emerald-300">{text}</span>);
    else if (tag) out.push(<span key={key} className="text-blue-700 dark:text-blue-300">{text}</span>);
    else if (num) out.push(<span key={key} className="text-amber-700 dark:text-amber-300">{text}</span>);
    else if (word && mode === 'dart' && DART_KEYWORDS.test(word)) out.push(<span key={key} className="text-violet-700 dark:text-violet-300">{text}</span>);
    else if (word && mode === 'dart' && /^[A-Z]/.test(word)) out.push(<span key={key} className="text-blue-700 dark:text-blue-300">{text}</span>); // types and widgets
    else if (word && html) out.push(<span key={key} className="text-violet-700 dark:text-violet-300">{text}</span>); // attribute names
    else if (word && KEYWORDS.test(word)) out.push(<span key={key} className="text-violet-700 dark:text-violet-300">{text}</span>);
    else out.push(text);
    last = start + text.length;
  }
  out.push(code.slice(last));
  return out;
}

export function CodeBlock({
  code,
  title,
  maxHeight,
  className,
  html,
  dart,
}: {
  code: string;
  title?: string;
  maxHeight?: number;
  className?: string;
  /** Highlight tags and attributes (HTML) instead of TSX. */
  html?: boolean;
  /** Highlight Dart. */
  dart?: boolean;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const clipped = maxHeight !== undefined && !expanded;
  // a collapsed block only shows about 20 lines, so highlight the first 60 and the rest once it is expanded (long sources made pages slow to open)
  const shown = React.useMemo(() => {
    if (!clipped) return code;
    const lines = code.split('\n');
    return lines.length > 60 ? lines.slice(0, 60).join('\n') : code;
  }, [code, clipped]);
  const nodes = React.useMemo(() => highlight(shown, html ? 'html' : dart ? 'dart' : 'tsx'), [shown, html, dart]);
  return (
    <div className={cn('overflow-hidden rounded-lg border bg-muted/60', className)}>
      <div className="flex h-9 items-center justify-between border-b bg-muted px-3">
        <span className="font-mono text-xs text-muted-foreground">{title}</span>
        <CopyButton value={code} className="size-7 border-transparent bg-transparent" />
      </div>
      <div className="relative">
        <pre
          className="overflow-auto p-4 font-mono text-[12.5px] leading-relaxed"
          style={clipped ? { maxHeight } : undefined}
        >
          <code>{nodes}</code>
        </pre>
        {clipped && (
          <div className="absolute inset-x-0 bottom-0 flex h-20 items-end justify-center bg-gradient-to-t from-muted to-transparent pb-3">
            <Button size="xs" variant="outline" onClick={() => setExpanded(true)}>Show full file</Button>
          </div>
        )}
      </div>
    </div>
  );
}

const managers = [
  ['npm', (c: string) => c],
  ['pnpm', (c: string) => c.replace(/^npm i /, 'pnpm add ')],
  ['yarn', (c: string) => c.replace(/^npm i /, 'yarn add ')],
  ['bun', (c: string) => c.replace(/^npm i /, 'bun add ')],
] as const;

/** Shell command with a package-manager switch when it is an `npm i` line. The choice sticks across the page. */
export function Command({ children }: { children: string }) {
  const [pm, setPm] = React.useState(() => {
    try { return localStorage.getItem('befui-pm') ?? 'npm'; } catch { return 'npm'; }
  });
  React.useEffect(() => {
    const sync = () => { try { setPm(localStorage.getItem('befui-pm') ?? 'npm'); } catch { /* storage can be blocked */ } };
    window.addEventListener('befui-pm', sync);
    return () => window.removeEventListener('befui-pm', sync);
  }, []);
  const swappable = children.startsWith('npm i ');
  const text = swappable ? managers.find(([n]) => n === pm)![1](children) : children;
  return (
    <div className="overflow-hidden rounded-lg border bg-muted/60">
      {swappable && (
        <Tabs value={pm} onValueChange={(v) => { setPm(v); try { localStorage.setItem('befui-pm', v); } catch { /* storage can be blocked */ } window.dispatchEvent(new Event('befui-pm')); }}>
          <TabsList variant="pill" className="m-1.5 mb-0">
            {managers.map(([n]) => <TabsTrigger key={n} value={n} className="px-2.5 text-xs">{n}</TabsTrigger>)}
          </TabsList>
        </Tabs>
      )}
      <div className="flex items-center justify-between gap-3 py-1.5 pl-4 pr-1.5">
        <code className="overflow-x-auto whitespace-nowrap font-mono text-[12.5px]">{text}</code>
        <CopyButton value={text} className="size-7 shrink-0 border-transparent bg-transparent" />
      </div>
    </div>
  );
}
