'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon, CodeIcon, CopyIcon, DownloadIcon, EyeIcon, MaximizeIcon, MinimizeIcon, XIcon } from './icons';

/**
 * The side panel next to a chat where something the AI made lives: a document, a page, a snippet. Header with title, a
 * Preview / Code switch, copy, download, expand and close. You pass the rendered result as `children` and the raw text as `code`.
 */
export function ArtifactPanel({
  title,
  children,
  code,
  language = 'text',
  filename,
  onClose,
  className,
}: {
  title: string;
  /** The rendered result, shown on the Preview tab. */
  children: React.ReactNode;
  /** The raw text, shown on the Code tab and used by Copy and Download. Leave out for a preview-only panel. */
  code?: string;
  language?: string;
  filename?: string;
  onClose?: () => void;
  className?: string;
}) {
  const [tab, setTab] = React.useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = React.useState(false);
  const [wide, setWide] = React.useState(false);
  const act = 'grid size-8 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:size-4';

  const copy = async () => {
    try { await navigator.clipboard.writeText(code ?? ''); } catch { return; }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([code ?? ''], { type: 'text/plain' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: filename ?? `${title}.${language}` });
    a.click();
    URL.revokeObjectURL(url);
  };
  const seg = (t: 'preview' | 'code', label: string, icon: React.ReactNode) => (
    <button type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 aria-selected:bg-background aria-selected:text-foreground aria-selected:shadow-sm [&_svg]:size-3.5">{icon}{label}</button>
  );

  return (
    <section aria-label={title} className={cn('flex flex-col overflow-hidden rounded-xl border bg-card', wide ? 'fixed inset-3 z-50 shadow-2xl' : 'h-[28rem] w-full max-w-xl', className)}>
      <header className="flex items-center gap-2 border-b px-3 py-2">
        <h3 className="min-w-0 flex-1 truncate text-sm font-medium">{title}</h3>
        {code !== undefined && (
          <div role="tablist" aria-label="View" className="flex gap-0.5 rounded-lg bg-secondary p-0.5">
            {seg('preview', 'Preview', <EyeIcon />)}
            {seg('code', 'Code', <CodeIcon />)}
          </div>
        )}
        {code !== undefined && <button type="button" aria-label={copied ? 'Copied' : 'Copy'} onClick={copy} className={act}>{copied ? <CheckIcon className="text-success" /> : <CopyIcon />}</button>}
        {code !== undefined && <button type="button" aria-label="Download" onClick={download} className={act}><DownloadIcon /></button>}
        <button type="button" aria-label={wide ? 'Shrink' : 'Expand'} aria-pressed={wide} onClick={() => setWide(!wide)} className={act}>{wide ? <MinimizeIcon /> : <MaximizeIcon />}</button>
        {onClose && <button type="button" aria-label="Close" onClick={onClose} className={act}><XIcon /></button>}
      </header>
      <div role="tabpanel" className="min-h-0 flex-1 overflow-auto">
        {tab === 'preview' || code === undefined ? <div className="p-4">{children}</div> : <pre className="p-4 font-mono text-[13px] leading-relaxed"><code>{code}</code></pre>}
      </div>
    </section>
  );
}
