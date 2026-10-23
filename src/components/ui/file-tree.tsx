'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRightIcon, FileCodeIcon, FileIcon, FileImageIcon, FileJsonIcon, FileTextIcon, FolderIcon, FolderOpenIcon } from './icons';

export interface FileNode {
  name: string;
  /** Present on folders. A folder with an empty array is an empty folder. */
  children?: FileNode[];
}

const icon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'json') return FileJsonIcon;
  if (ext && ['ts', 'tsx', 'js', 'jsx', 'css', 'html', 'go', 'py', 'rs'].includes(ext)) return FileCodeIcon;
  if (ext && ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(ext)) return FileImageIcon;
  if (ext && ['md', 'txt'].includes(ext)) return FileTextIcon;
  return FileIcon;
};

/** Folders first, then files, each A to Z. */
const sorted = (nodes: FileNode[]) => [...nodes].sort((a, b) => Number(!!b.children) - Number(!!a.children) || a.name.localeCompare(b.name));

/**
 * A folder and file tree like an editor sidebar: folders first, file-type icons, click to open or close, and
 * `onSelect` gives the full path (`src/app/page.tsx`). Arrow keys walk the tree; Right opens a folder, Left closes it or goes to the parent.
 */
export function FileTree({
  nodes,
  selected,
  onSelect,
  defaultOpen = [],
  className,
}: {
  nodes: FileNode[];
  selected?: string;
  onSelect?: (path: string) => void;
  /** Folder paths that start open. */
  defaultOpen?: string[];
  className?: string;
}) {
  const [open, setOpen] = React.useState(() => new Set(defaultOpen));
  const [focus, setFocus] = React.useState<string>();
  const root = React.useRef<HTMLUListElement>(null);

  const rows = React.useMemo(() => {
    const out: { path: string; node: FileNode; depth: number; parent?: string }[] = [];
    const walk = (list: FileNode[], base: string, depth: number) => {
      for (const n of sorted(list)) {
        const path = base ? `${base}/${n.name}` : n.name;
        out.push({ path, node: n, depth, parent: base || undefined });
        if (n.children && open.has(path)) walk(n.children, path, depth + 1);
      }
    };
    walk(nodes, '', 0);
    return out;
  }, [nodes, open]);

  const tabStop = rows.find((r) => r.path === focus)?.path ?? rows.find((r) => r.path === selected)?.path ?? rows[0]?.path;
  const toggle = (p: string, on?: boolean) => setOpen((s) => { const n = new Set(s); (on ?? !n.has(p)) ? n.add(p) : n.delete(p); return n; });
  const go = (p?: string) => { if (!p) return; setFocus(p); requestAnimationFrame(() => root.current?.querySelector<HTMLElement>(`[data-path="${CSS.escape(p)}"]`)?.focus()); };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const r = rows[i]!;
    const isDir = !!r.node.children;
    if (e.key === 'ArrowDown') { e.preventDefault(); go(rows[i + 1]?.path); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); go(rows[i - 1]?.path); }
    else if (e.key === 'Home') { e.preventDefault(); go(rows[0]?.path); }
    else if (e.key === 'End') { e.preventDefault(); go(rows[rows.length - 1]?.path); }
    else if (e.key === 'ArrowRight' && isDir) { e.preventDefault(); open.has(r.path) ? go(rows[i + 1]?.path) : toggle(r.path, true); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); isDir && open.has(r.path) ? toggle(r.path, false) : go(r.parent); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); isDir ? toggle(r.path) : onSelect?.(r.path); }
  };

  return (
    <ul ref={root} role="tree" aria-label="Files" className={cn('text-[13px]', className)}>
      {rows.map((r, i) => {
        const isDir = !!r.node.children;
        const isOpen = open.has(r.path);
        const Icon = isDir ? (isOpen ? FolderOpenIcon : FolderIcon) : icon(r.node.name);
        return (
          <li
            key={r.path}
            role="treeitem"
            data-path={r.path}
            aria-level={r.depth + 1}
            aria-expanded={isDir ? isOpen : undefined}
            aria-selected={r.path === selected}
            tabIndex={r.path === tabStop ? 0 : -1}
            onKeyDown={(e) => onKey(e, i)}
            onFocus={() => setFocus(r.path)}
            onClick={() => (isDir ? toggle(r.path) : onSelect?.(r.path))}
            style={{ paddingInlineStart: `${r.depth * 14 + 6}px` }}
            className={cn('flex cursor-pointer select-none items-center gap-1.5 rounded-md py-1 pe-2 outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/50', r.path === selected && 'bg-accent text-accent-foreground')}
          >
            <ChevronRightIcon className={cn('size-3.5 shrink-0 text-muted-foreground transition-transform duration-150 rtl:-scale-x-100', isOpen && 'rotate-90 rtl:rotate-90', !isDir && 'invisible')} />
            <Icon className={cn('size-4 shrink-0', isDir ? 'text-primary' : 'text-muted-foreground')} />
            <span className="truncate">{r.node.name}</span>
          </li>
        );
      })}
    </ul>
  );
}
