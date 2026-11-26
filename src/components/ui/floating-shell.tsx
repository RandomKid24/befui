'use client';

import * as React from 'react';
import { Avatar } from './avatar';
import { Button } from './button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './dialog';
import { MenuIcon, PanelLeftIcon, SearchIcon } from './icons';
import { StretchNav } from './stretch-nav';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';

export interface FloatingNavItem { id: string; label: string; icon: React.ReactNode; badge?: number }
export interface FloatingNavGroup { label: string; items: FloatingNavItem[] }

/** The see-through panel used by the shell; use it for the cards inside so they match. */
export const glass = 'rounded-2xl border border-foreground/10 bg-card/55 shadow-lg backdrop-blur-2xl backdrop-saturate-150';

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
  /** The signed-in person: shown at the bottom of the sidebar, or at the end of the top bar. */
  user?: { name: string; role?: string };
  children: React.ReactNode;
  className?: string;
}

/** Dashboard frame where the menu floats over a soft coloured backdrop. The sidebar folds to icons, and becomes a drawer on phones. */
export function FloatingShell({ brand, groups, value, onChange, layout = 'sidebar', actions, footer, user, children, className }: FloatingShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [drawer, setDrawer] = React.useState(false);
  const [search, setSearch] = React.useState(false);
  const items = groups.flatMap((g) => g.items);
  const current = items.find((i) => i.id === value);
  React.useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'k' || !(e.metaKey || e.ctrlKey)) return;
      e.preventDefault();
      setSearch((o) => !o);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);
  const searchButton = (wide?: boolean) => (
    <button type="button" onClick={() => setSearch(true)} aria-label={wide ? undefined : 'Jump to a page'} aria-keyshortcuts="Meta+K Control+K" className={cn('flex h-9 items-center gap-2 rounded-xl border border-foreground/10 bg-card/55 px-3 text-[13px] text-muted-foreground outline-none backdrop-blur-xl hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring', wide && 'w-full max-w-sm')}>
      <SearchIcon className="size-4 shrink-0" />
      {wide && <><span className="me-auto truncate">Jump to a page</span><kbd aria-hidden className="rounded-md border border-foreground/10 px-1.5 font-mono text-[11px]">⌘K</kbd></>}
    </button>
  );
  const brandBlock = (small?: boolean) => (
    <div className="flex min-w-0 items-center gap-2.5">
      <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground [&_svg]:size-4">{brand.mark}</span>
      <span className={cn('min-w-0', small && 'sr-only')}><span className="block truncate text-sm font-semibold">{brand.name}</span>{brand.tagline && <span className="block truncate text-xs text-muted-foreground">{brand.tagline}</span>}</span>
    </div>
  );
  return (
    <div
      className={cn('flex min-h-[max(46rem,100dvh)] w-full flex-col gap-3 bg-background p-3 text-foreground', layout === 'sidebar' && 'md:flex-row', className)}
      style={{ backgroundImage: [['38rem 30rem at 8% 4%', '--primary', 42], ['34rem 28rem at 78% 0%', '--info', 28], ['44rem 34rem at 100% 78%', '--primary', 34], ['32rem 26rem at 30% 100%', '--success', 20], ['26rem 22rem at 52% 46%', '--info', 14]].map(([at, token, amount]) => `radial-gradient(${at}, color-mix(in srgb, var(${token}) ${amount}%, transparent), transparent 72%)`).join(', ') }}
    >
      <CommandDialog open={search} onOpenChange={setSearch} label="Jump to a page">
        <CommandInput placeholder="Jump to a page..." />
        <CommandList>
          <CommandEmpty>No page matches.</CommandEmpty>
          {groups.map((g) => (
            <CommandGroup key={g.label} heading={g.label}>
              {g.items.map((it) => <CommandItem key={it.id} onSelect={() => { onChange(it.id); setSearch(false); }}>{it.icon}{it.label}</CommandItem>)}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
      {layout === 'sidebar' && (
        <aside className={cn(glass, 'hidden shrink-0 flex-col gap-4 self-start overflow-y-auto p-3 transition-[width] motion-reduce:transition-none md:sticky md:top-3 md:flex md:h-[calc(100dvh-1.5rem)] md:min-h-[44.5rem]', collapsed ? 'w-16' : 'w-60')}>
          <div className={cn('flex items-center justify-between gap-2', collapsed && 'flex-col')}>
            {brandBlock(collapsed)}
            <Button variant="ghost" size="icon-sm" aria-label={collapsed ? 'Expand menu' : 'Collapse menu'} aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)}><PanelLeftIcon /></Button>
          </div>
          <nav aria-label={brand.name}><SideMenu groups={groups} value={value} onChange={onChange} collapsed={collapsed} /></nav>
          <div className="mt-auto grid gap-3">
            {footer && !collapsed && <div className="rounded-xl border border-foreground/10 bg-background/50 p-3">{footer}</div>}
            {user && (
              <div className={cn('flex items-center gap-2.5 border-t border-foreground/10 pt-3', collapsed && 'justify-center')}>
                <Avatar name={user.name} size="sm" />
                <span className={cn('min-w-0', collapsed && 'sr-only')}><span className="block truncate text-[13px] font-medium">{user.name}</span>{user.role && <span className="block truncate text-xs text-muted-foreground">{user.role}</span>}</span>
              </div>
            )}
          </div>
        </aside>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {/* beside a sidebar the top row sits straight on the backdrop; on its own it is a floating bar */}
        <div className={cn('flex items-center gap-3', layout === 'top' ? cn(glass, 'px-3 py-2') : 'px-1 pt-1')}>
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
            <>
              <p className="shrink-0 truncate text-[13px] text-muted-foreground max-lg:me-auto">{brand.name} / <span className="font-medium text-foreground">{current?.label}</span></p>
              <div className="mx-auto hidden w-full justify-center lg:flex">{searchButton(true)}</div>
            </>
          )}
          <div className="flex shrink-0 items-center gap-1.5">
            <span className={cn(layout === 'sidebar' && 'lg:hidden')}>{searchButton()}</span>
            {actions}<ThemeToggle />
            {user && layout === 'top' && <Avatar name={user.name} size="sm" />}
          </div>
        </div>
        <main key={value} className="flex min-w-0 flex-1 flex-col gap-3 [&>*]:shrink-0 motion-safe:[&>*]:animate-rise [&>*:nth-child(2)]:[animation-delay:80ms] [&>*:nth-child(3)]:[animation-delay:160ms] [&>*:nth-child(n+4)]:[animation-delay:240ms]">{children}</main>
      </div>
    </div>
  );
}
