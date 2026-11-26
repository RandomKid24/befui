'use client';

import * as React from 'react';
import { Button } from './button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './dialog';
import { MenuIcon, PanelLeftIcon } from './icons';
import { StretchNav } from './stretch-nav';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';

export interface FloatingNavItem { id: string; label: string; icon: React.ReactNode; badge?: number }
export interface FloatingNavGroup { label: string; items: FloatingNavItem[] }

/** The see-through panel used by the shell; use it for the cards inside so they match. */
export const glass = 'rounded-2xl border border-foreground/10 bg-card/65 shadow-lg backdrop-blur-xl';

/** A card on the glass backdrop with an optional heading row. */
export function GlassPanel({ title, note, action, className, children, ...props }: Omit<React.HTMLAttributes<HTMLElement>, 'title'> & { title?: string; note?: string; action?: React.ReactNode }) {
  return (
    <section className={cn(glass, 'min-w-0 p-4', className)} {...props}>
      {title && (
        <header className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div><h2 className="text-sm font-semibold">{title}</h2>{note && <p className="text-xs text-muted-foreground">{note}</p>}</div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

/** Menu with one highlight that stretches up or down to the picked item. */
function SideMenu({ groups, value, onChange, collapsed }: { groups: FloatingNavGroup[]; value: string; onChange: (id: string) => void; collapsed?: boolean }) {
  const box = React.useRef<HTMLDivElement>(null);
  const [mark, setMark] = React.useState<{ top: number; bottom: number; down: boolean } | null>(null);
  React.useLayoutEffect(() => {
    const root = box.current;
    if (!root) return;
    const measure = () => {
      // offsets are from `root`, the only positioned ancestor of the items
      const el = root.querySelector<HTMLElement>('[aria-current="page"]')?.parentElement;
      if (!el) return setMark(null);
      const top = el.offsetTop;
      const bottom = root.offsetHeight - top - el.offsetHeight;
      setMark((was) => (was && was.top === top && was.bottom === bottom ? was : { top, bottom, down: !was || top >= was.top }));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [value, groups, collapsed]);
  return (
    <div ref={box} className="relative">
      {mark && <span aria-hidden className="absolute inset-x-0 rounded-xl bg-primary shadow-sm motion-reduce:!transition-none" style={{ top: mark.top, bottom: mark.bottom, transition: `top ${mark.down ? 'var(--dur-medium)' : 'var(--dur-base)'} var(--ease-out), bottom ${mark.down ? 'var(--dur-base)' : 'var(--dur-medium)'} var(--ease-out)` }} />}
      {groups.map((g) => (
        <div key={g.label} className="mb-3 last:mb-0">
          <p className={cn('mb-1 px-3 text-[11px] font-medium text-muted-foreground', collapsed && 'sr-only')}>{g.label}</p>
          <ul className="grid gap-0.5">
            {g.items.map((it) => (
              <li key={it.id}>
                <button type="button" title={collapsed ? it.label : undefined} aria-label={collapsed ? it.label : undefined} aria-current={it.id === value ? 'page' : undefined} onClick={() => onChange(it.id)} className={cn('relative flex h-9 w-full items-center gap-2.5 rounded-xl px-3 text-[13px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4 [&_svg]:shrink-0', collapsed && 'justify-center px-0', it.id === value ? 'text-primary-foreground' : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground')}>
                  {it.icon}
                  {!collapsed && <span className="truncate">{it.label}</span>}
                  {!!it.badge && (collapsed ? <span aria-hidden className="absolute end-2 top-1.5 size-2 rounded-full bg-destructive" /> : <span className="ms-auto rounded-md bg-background/80 px-1.5 text-[11px] tabular-nums text-foreground">{it.badge}</span>)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export interface FloatingShellProps {
  brand: { name: string; tagline?: string; mark: React.ReactNode };
  groups: FloatingNavGroup[];
  value: string;
  onChange: (id: string) => void;
  /** 'sidebar' floats a collapsible menu on the side; 'top' floats a menu bar across the top. */
  layout?: 'sidebar' | 'top';
  /** Right side of the top row, before the theme toggle. */
  actions?: React.ReactNode;
  /** Card at the bottom of the sidebar, hidden when it is collapsed. */
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Dashboard frame where the menu floats over a soft coloured backdrop. The sidebar folds to icons, and becomes a drawer on phones. */
export function FloatingShell({ brand, groups, value, onChange, layout = 'sidebar', actions, footer, children, className }: FloatingShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [drawer, setDrawer] = React.useState(false);
  const items = groups.flatMap((g) => g.items);
  const current = items.find((i) => i.id === value);
  const brandBlock = (small?: boolean) => (
    <div className="flex min-w-0 items-center gap-2.5">
      <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground [&_svg]:size-4">{brand.mark}</span>
      <span className={cn('min-w-0', small && 'sr-only')}><span className="block truncate text-sm font-semibold">{brand.name}</span>{brand.tagline && <span className="block truncate text-xs text-muted-foreground">{brand.tagline}</span>}</span>
    </div>
  );
  return (
    <div
      className={cn('flex min-h-[max(46rem,100dvh)] w-full flex-col gap-3 bg-background p-3 text-foreground', layout === 'sidebar' && 'md:flex-row', className)}
      style={{ backgroundImage: 'radial-gradient(60rem 40rem at 0% 0%, color-mix(in srgb, var(--primary) 22%, transparent), transparent 70%), radial-gradient(50rem 40rem at 100% 100%, color-mix(in srgb, var(--info) 16%, transparent), transparent 70%)' }}
    >
      {layout === 'sidebar' && (
        <aside className={cn(glass, 'hidden shrink-0 flex-col gap-4 self-start overflow-y-auto p-3 transition-[width] motion-reduce:transition-none md:sticky md:top-3 md:flex md:h-[calc(100dvh-1.5rem)] md:min-h-[44.5rem]', collapsed ? 'w-16' : 'w-60')}>
          <div className={cn('flex items-center justify-between gap-2', collapsed && 'flex-col')}>
            {brandBlock(collapsed)}
            <Button variant="ghost" size="icon-sm" aria-label={collapsed ? 'Expand menu' : 'Collapse menu'} aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)}><PanelLeftIcon /></Button>
          </div>
          <nav aria-label={brand.name}><SideMenu groups={groups} value={value} onChange={onChange} collapsed={collapsed} /></nav>
          {footer && !collapsed && <div className="mt-auto rounded-xl border border-foreground/10 bg-background/50 p-3">{footer}</div>}
        </aside>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className={cn(glass, 'flex items-center gap-3 px-3 py-2', layout === 'sidebar' && 'md:justify-end')}>
          <Sheet open={drawer} onOpenChange={setDrawer}>
            <SheetTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="Open menu" className="md:hidden"><MenuIcon /></Button></SheetTrigger>
            <SheetContent side="left" className="max-w-72 overflow-y-auto p-4" aria-describedby={undefined}>
              <SheetTitle className="sr-only">{brand.name} menu</SheetTitle>
              <div className="grid content-start gap-4">{brandBlock()}<SideMenu groups={groups} value={value} onChange={(id) => { onChange(id); setDrawer(false); }} /></div>
            </SheetContent>
          </Sheet>
          {layout === 'top' ? (
            <>
              {brandBlock()}
              <StretchNav className="mx-auto hidden border-0 bg-transparent md:block" label={brand.name} value={value} onChange={onChange} items={items.map((i) => ({ id: i.id, label: <>{i.icon}{i.label}</> }))} />
              <span className="ms-auto md:ms-0" />
            </>
          ) : (
            <p className="me-auto truncate text-sm font-medium">{current?.label}</p>
          )}
          <div className="flex shrink-0 items-center gap-1.5">{actions}<ThemeToggle /></div>
        </div>
        <main key={value} className="min-w-0 flex-1 motion-safe:animate-pop">{children}</main>
      </div>
    </div>
  );
}
