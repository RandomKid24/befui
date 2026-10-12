import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SettingsNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

/**
 * Two-column settings page: a vertical section list on the left (a scrolling strip on mobile), the active section on the right.
 * Controlled: pass `value` and `onChange`. Fill the right side with SettingsSection blocks.
 */
export function SettingsLayout({ items, value, onChange, children, className }: { items: SettingsNavItem[]; value: string; onChange: (id: string) => void; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('grid gap-6 md:grid-cols-[13rem_1fr]', className)}>
      <nav aria-label="Settings" className="flex gap-1 overflow-x-auto md:grid md:content-start">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            aria-current={it.id === value ? 'page' : undefined}
            onClick={() => onChange(it.id)}
            className={cn('flex h-8 shrink-0 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 [&_svg]:size-4', it.id === value ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')}
          >
            {it.icon}{it.label}
          </button>
        ))}
      </nav>
      <div className="grid min-w-0 content-start gap-6">{children}</div>
    </div>
  );
}

/** One settings group: title and help text on the left, the controls on the right. Stack several with dividers. */
export function SettingsSection({ title, description, children, className }: { title: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('grid gap-4 border-b pb-6 last:border-b-0 lg:grid-cols-[14rem_1fr]', className)}>
      <div className="grid content-start gap-1">
        <h2 className="text-sm font-semibold">{title}</h2>
        {description && <p className="text-[13px] text-muted-foreground">{description}</p>}
      </div>
      <div className="grid max-w-xl gap-4">{children}</div>
    </section>
  );
}
