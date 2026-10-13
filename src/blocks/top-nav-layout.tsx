'use client';

import * as React from 'react';
import { BefMark, BellIcon, SettingsIcon, UserCircleIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/ui/navbar';
import { StatCard } from '@/components/ui/stat-card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { UserMenu } from '@/components/ui/user-menu';
import { toast } from '@/components/ui/toast';

/** App frame with a top navigation bar instead of a sidebar. Good for apps with five or fewer sections. */
export default function TopNavLayout() {
  const [page, setPage] = React.useState('Overview');
  const pages = ['Overview', 'Projects', 'Reports', 'Team'];
  return (
    <div className="overflow-hidden rounded-xl border bg-background text-left">
      <Navbar
        brand={<><BefMark className="size-5 text-primary" /> Acme</>}
        links={pages.map((p) => ({ label: p, href: `#${p.toLowerCase()}`, active: p === page }))}
        actions={
          <>
            <Button variant="ghost" size="icon-sm" aria-label="Notifications"><BellIcon /></Button>
            <ThemeToggle />
            <UserMenu name="Aarav Mehta" email="aarav@acme.co" items={[{ label: 'Profile', icon: <UserCircleIcon /> }, { label: 'Settings', icon: <SettingsIcon /> }]} onSignOut={() => toast.success('Signed out')} />
          </>
        }
      />
      <div className="mx-auto grid max-w-6xl gap-4 p-4 sm:p-6">
        <div className="flex gap-1 overflow-x-auto">
          {pages.map((p) => (
            <button key={p} type="button" onClick={() => setPage(p)} aria-current={p === page ? 'page' : undefined} className={`rounded-md px-3 py-1.5 text-[13px] font-medium md:hidden ${p === page ? 'bg-secondary' : 'text-muted-foreground'}`}>{p}</button>
          ))}
        </div>
        <h1 className="text-xl font-semibold tracking-tight">{page}</h1>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Active projects" value="12" delta={8} />
          <StatCard label="Open tasks" value="87" delta={-4} />
          <StatCard label="Team members" value="24" delta={2} />
        </div>
        <Card><CardHeader><CardTitle>Content goes here</CardTitle></CardHeader><CardContent className="text-[13px] text-muted-foreground">Swap this card for the page you are building. The bar stays put.</CardContent></Card>
      </div>
    </div>
  );
}
