import * as React from 'react';
import { cn } from '@/lib/utils';

const SAFE = /^(https?:|mailto:|\/|#)/i;

/** **bold**, *italic*, `code` and [links](https://...) inside one line. Anything else stays text, so nothing in it can run. */
function inline(text: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)|(\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0, i = 0, m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0], k = `${key}-${i++}`;
    if (m[1]) out.push(<code key={k} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">{t.slice(1, -1)}</code>);
    else if (m[2]) out.push(<strong key={k} className="font-semibold">{inline(t.slice(2, -2), k)}</strong>);
    else if (m[3]) out.push(<em key={k}>{inline(t.slice(1, -1), k)}</em>);
    else {
      const [, label = '', href = ''] = t.match(/^\[([^\]]+)\]\(([^)]+)\)$/) ?? [];
      out.push(SAFE.test(href)
        ? <a key={k} href={href} {...(/^https?:/i.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="text-primary underline underline-offset-2 hover:no-underline">{label}</a>
        : label);
    }
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * Turns Markdown text into styled elements without `dangerouslySetInnerHTML`: headings, paragraphs, bold, italic, inline code, fenced
 * code blocks, bullet and numbered lists, quotes, rules and links (only http, https, mailto and relative ones). For AI answers and notes.
 * It covers the everyday subset; for tables or HTML in Markdown, use a full library.
 */
export function Markdown({ children, className }: { children: string; className?: string }) {
  const lines = children.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0, n = 0;
  const key = () => `b${n++}`;
  while (i < lines.length) {
    const line = lines[i]!;
    if (!line.trim()) { i++; continue; }
    const fence = line.match(/^```(\w*)/);
    if (fence) {
      const code: string[] = [];
      for (i++; i < lines.length && !lines[i]!.startsWith('```'); i++) code.push(lines[i]!);
      i++;
      blocks.push(<pre key={key()} className="overflow-x-auto rounded-lg border bg-muted/50 p-3 font-mono text-[13px] leading-relaxed" data-lang={fence[1] || undefined}><code>{code.join('\n')}</code></pre>);
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const lvl = h[1]!.length;
      const cls = ['text-2xl font-semibold tracking-tight', 'text-xl font-semibold tracking-tight', 'text-lg font-semibold', 'text-base font-semibold'][lvl - 1];
      blocks.push(React.createElement(`h${lvl}`, { key: key(), className: cn(cls, 'mt-5 first:mt-0') }, inline(h[2]!, `h${n}`)));
      i++; continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) { blocks.push(<hr key={key()} className="my-4" />); i++; continue; }
    if (line.startsWith('>')) {
      const q: string[] = [];
      for (; i < lines.length && lines[i]!.startsWith('>'); i++) q.push(lines[i]!.replace(/^>\s?/, ''));
      blocks.push(<blockquote key={key()} className="border-s-2 border-primary/40 ps-3 text-muted-foreground">{inline(q.join(' '), `q${n}`)}</blockquote>);
      continue;
    }
    const li = line.match(/^(\s*)([-*]|\d+\.)\s+/);
    if (li) {
      const ordered = /\d/.test(li[2]!);
      const items: string[] = [];
      for (; i < lines.length && /^(\s*)([-*]|\d+\.)\s+/.test(lines[i]!); i++) items.push(lines[i]!.replace(/^(\s*)([-*]|\d+\.)\s+/, ''));
      const Tag = ordered ? 'ol' : 'ul';
      blocks.push(<Tag key={key()} className={cn('ms-5 grid gap-1', ordered ? 'list-decimal' : 'list-disc')}>{items.map((t, k) => <li key={k}>{inline(t, `l${n}-${k}`)}</li>)}</Tag>);
      continue;
    }
    const p: string[] = [];
    for (; i < lines.length && lines[i]!.trim() && !/^(```|#{1,4}\s|>|(\s*)([-*]|\d+\.)\s)/.test(lines[i]!); i++) p.push(lines[i]!);
    blocks.push(<p key={key()}>{inline(p.join(' '), `p${n}`)}</p>);
  }
  return <div className={cn('grid gap-3 text-sm leading-7', className)}>{blocks}</div>;
}
