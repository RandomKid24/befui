import * as React from 'react';
import { SidebarRail } from '@/components/ui/sidebar-rail';
import { Avatar } from '@/components/ui/avatar';
import { BellIcon, CalendarIcon, FolderIcon, HomeIcon, InboxIcon } from '@/components/ui/icons';

function Page({ title }: { title: string }) {
  return (
    <div className="flex-1 p-6">
      <h3 className="text-lg font-semibold capitalize">{title}</h3>
      <div className="mt-4 grid gap-2"><div className="h-3 w-3/4 rounded bg-muted" /><div className="h-3 w-1/2 rounded bg-muted" /><div className="h-24 rounded-lg bg-muted/60" /></div>
    </div>
  );
}

const items = [
  { id: 'home', label: 'Home', icon: <HomeIcon /> },
  { id: 'inbox', label: 'Inbox', icon: <InboxIcon />, badge: 4 },
  { id: 'files', label: 'Files', icon: <FolderIcon /> },
  { id: 'calendar', label: 'Calendar', icon: <CalendarIcon /> },
  { id: 'alerts', label: 'Alerts', icon: <BellIcon />, badge: 12 },
];

export default function SidebarRailDemo() {
  const [v, setV] = React.useState('home');
  return (
    <div className="flex h-[26rem] w-full max-w-3xl overflow-hidden rounded-xl border bg-background">
      <SidebarRail items={items} value={v} onChange={setV} header={<span className="grid size-9 place-items-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">B</span>} footer={<Avatar name="Meera Iyer" size="sm" />} />
      <Page title={v} />
    </div>
  );
}
